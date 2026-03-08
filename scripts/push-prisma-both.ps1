param(
  [ValidateSet('db-push', 'migrate-deploy')]
  [string]$Mode = 'db-push'
)

$ErrorActionPreference = 'Stop'

function Load-DotEnv {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path
  )

  $envMap = @{}

  foreach ($line in Get-Content -Path $Path) {
    $trimmed = $line.Trim()

    if (-not $trimmed -or $trimmed.StartsWith('#')) {
      continue
    }

    $separatorIndex = $trimmed.IndexOf('=')
    if ($separatorIndex -lt 1) {
      continue
    }

    $key = $trimmed.Substring(0, $separatorIndex).Trim()
    $value = $trimmed.Substring($separatorIndex + 1).Trim()

    if (
      ($value.StartsWith('"') -and $value.EndsWith('"')) -or
      ($value.StartsWith("'") -and $value.EndsWith("'"))
    ) {
      $value = $value.Substring(1, $value.Length - 2)
    }

    $envMap[$key] = $value
  }

  return $envMap
}

function Require-Value {
  param(
    [Parameter(Mandatory = $true)]
    [hashtable]$Map,
    [Parameter(Mandatory = $true)]
    [string]$Key
  )

  if (-not $Map.ContainsKey($Key) -or [string]::IsNullOrWhiteSpace($Map[$Key])) {
    throw "Missing required environment variable '$Key' in .env."
  }

  return $Map[$Key]
}

function Test-ConnectionString {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Label,
    [Parameter(Mandatory = $true)]
    [string]$Value,
    [Parameter(Mandatory = $true)]
    [string]$VariableName
  )

  try {
    $uri = [System.Uri]$Value
  } catch {
    throw "$VariableName for $Label is not a valid URL."
  }

  if ($uri.Scheme -ne 'postgresql') {
    throw "$VariableName for $Label must start with 'postgresql://'."
  }

  if ([string]::IsNullOrWhiteSpace($uri.Host)) {
    throw "$VariableName for $Label is missing a database host."
  }

  if ($uri.Port -le 0) {
    throw "$VariableName for $Label is missing a valid database port."
  }

  if ([string]::IsNullOrWhiteSpace($uri.UserInfo)) {
    throw "$VariableName for $Label is missing credentials. Expected format: postgresql://username:password@host:port/database"
  }

  $userInfoParts = $uri.UserInfo.Split(':', 2)
  if ($userInfoParts.Length -lt 2 -or [string]::IsNullOrWhiteSpace($userInfoParts[0]) -or [string]::IsNullOrWhiteSpace($userInfoParts[1])) {
    throw "$VariableName for $Label must include both username and password. Expected format: postgresql://username:password@host:port/database"
  }
}

function Invoke-PrismaForDatabase {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Label,
    [Parameter(Mandatory = $true)]
    [string]$DatabaseUrl,
    [Parameter(Mandatory = $true)]
    [string]$DirectUrl,
    [Parameter(Mandatory = $true)]
    [string]$ProjectRoot,
    [Parameter(Mandatory = $true)]
    [string]$Mode
  )

  Write-Host ""
  Write-Host "==> Running Prisma $Mode for $Label"

  $env:DATABASE_URL = $DatabaseUrl
  $env:DIRECT_URL = $DirectUrl

  Push-Location $ProjectRoot
  try {
    if ($Mode -eq 'db-push') {
      & pnpm exec prisma db push
    } else {
      & pnpm exec prisma migrate deploy
    }

    if ($LASTEXITCODE -ne 0) {
      throw "Prisma $Mode failed for $Label."
    }
  } finally {
    Pop-Location
  }
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$envPath = Join-Path $projectRoot '.env'

if (-not (Test-Path -Path $envPath)) {
  throw "Could not find .env at '$envPath'."
}

$envMap = Load-DotEnv -Path $envPath

$primaryDatabaseUrl = Require-Value -Map $envMap -Key 'DATABASE_URL'
$primaryDirectUrl = if ($envMap.ContainsKey('DIRECT_URL') -and -not [string]::IsNullOrWhiteSpace($envMap['DIRECT_URL'])) {
  $envMap['DIRECT_URL']
} else {
  $primaryDatabaseUrl
}

$secondaryDatabaseUrl = Require-Value -Map $envMap -Key 'DATABASE_URL_SECOND'
$secondaryDirectUrl = if ($envMap.ContainsKey('DIRECT_URL_SECOND') -and -not [string]::IsNullOrWhiteSpace($envMap['DIRECT_URL_SECOND'])) {
  $envMap['DIRECT_URL_SECOND']
} else {
  $secondaryDatabaseUrl
}

Test-ConnectionString -Label 'primary database' -Value $primaryDatabaseUrl -VariableName 'DATABASE_URL'
Test-ConnectionString -Label 'primary database' -Value $primaryDirectUrl -VariableName 'DIRECT_URL'
Test-ConnectionString -Label 'secondary database' -Value $secondaryDatabaseUrl -VariableName 'DATABASE_URL_SECOND'
Test-ConnectionString -Label 'secondary database' -Value $secondaryDirectUrl -VariableName 'DIRECT_URL_SECOND'

$previousDatabaseUrl = $env:DATABASE_URL
$previousDirectUrl = $env:DIRECT_URL

try {
  Invoke-PrismaForDatabase `
    -Label 'primary database' `
    -DatabaseUrl $primaryDatabaseUrl `
    -DirectUrl $primaryDirectUrl `
    -ProjectRoot $projectRoot `
    -Mode $Mode

  Invoke-PrismaForDatabase `
    -Label 'secondary database' `
    -DatabaseUrl $secondaryDatabaseUrl `
    -DirectUrl $secondaryDirectUrl `
    -ProjectRoot $projectRoot `
    -Mode $Mode

  Write-Host ""
  Write-Host "Prisma $Mode completed successfully for both databases."
} finally {
  $env:DATABASE_URL = $previousDatabaseUrl
  $env:DIRECT_URL = $previousDirectUrl
}
