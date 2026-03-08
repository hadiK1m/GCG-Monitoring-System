<template>
  <div>
    <!-- Page Header with Year Filter -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gcg-dark dark:text-white">
          Dashboard ACGS
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitoring pencapaian ASEAN Corporate Governance Scorecard
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-calendar" class="size-4 text-gray-400" />
        <select
          v-model="selectedYear"
          class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium text-gcg-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-gcg-accent"
        >
          <option v-for="y in availableYears" :key="y.value" :value="y.value">
            Tahun {{ y.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Row 1: Key Performance Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
      <!-- Skor ACGS Total -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="size-10 rounded-lg flex items-center justify-center bg-gcg-light dark:bg-gcg-primary/20">
            <UIcon name="i-lucide-trophy" class="size-5 text-gcg-primary dark:text-gcg-accent" />
          </div>
          <span
            v-if="scoreChange"
            class="text-xs font-semibold px-2 py-0.5 rounded-full"
            :class="scoreChange.direction === 'up'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'"
          >
            {{ scoreChange.direction === 'up' ? '↑' : '↓' }} {{ Math.abs(scoreChange.absolute) }}%
          </span>
        </div>
        <p class="text-3xl font-bold" :class="scoreColorClass">
          {{ summary.percentage }}%
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Skor ACGS Saat Ini</p>
        <div class="mt-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-500"
            :class="scoreBarColorClass"
            :style="{ width: `${Math.min(summary.percentage, 100)}%` }"
          />
        </div>
        <p class="text-xs text-gray-400 mt-1.5">{{ summary.totalScore }}/{{ summary.maxScore }} poin</p>
      </div>

      <!-- Skor Level 1 -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="size-10 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
            <UIcon name="i-lucide-layers" class="size-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span class="text-xs font-medium text-gray-400">Maks {{ summary.level1Max }}</span>
        </div>
        <p class="text-3xl font-bold text-gcg-dark dark:text-white">
          {{ summary.level1Score }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Skor Level 1</p>
        <div class="mt-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
          <div
            class="h-2 rounded-full bg-blue-500 transition-all duration-500"
            :style="{ width: `${summary.level1Percentage}%` }"
          />
        </div>
        <p class="text-xs text-gray-400 mt-1.5">{{ summary.level1Percentage }}% pencapaian</p>
      </div>

      <!-- Skor Level 2 (Bonus/Penalti) -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="size-10 rounded-lg flex items-center justify-center bg-amber-50 dark:bg-amber-900/20">
            <UIcon name="i-lucide-sparkles" class="size-5 text-amber-600 dark:text-amber-400" />
          </div>
          <span class="text-xs font-medium text-gray-400">Maks {{ summary.level2Max }}</span>
        </div>
        <p class="text-3xl font-bold text-gcg-dark dark:text-white">
          {{ summary.level2Score }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Skor Level 2 (Bonus)</p>
        <div class="mt-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
          <div
            class="h-2 rounded-full bg-amber-500 transition-all duration-500"
            :style="{ width: `${summary.level2Percentage}%` }"
          />
        </div>
        <p class="text-xs text-gray-400 mt-1.5">{{ summary.level2Percentage }}% pencapaian</p>
      </div>

      <!-- Area of Improvement -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="size-10 rounded-lg flex items-center justify-center bg-orange-50 dark:bg-orange-900/20">
            <UIcon name="i-lucide-alert-circle" class="size-5 text-orange-600 dark:text-orange-400" />
          </div>
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
            {{ overallAoi.total }} total
          </span>
        </div>
        <p class="text-3xl font-bold text-gcg-dark dark:text-white">
          {{ currentYearAoi.total }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Area of Improvement</p>
        <div class="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
          <div class="flex items-center gap-1.5">
            <span class="size-2 rounded-full bg-green-500" />
            <span class="text-gray-500 dark:text-gray-400">Selesai: {{ currentYearAoi.selesai }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="size-2 rounded-full bg-yellow-500" />
            <span class="text-gray-500 dark:text-gray-400">Progress: {{ currentYearAoi.onProgress }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="size-2 rounded-full bg-red-500" />
            <span class="text-gray-500 dark:text-gray-400">Belum: {{ currentYearAoi.belum }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="size-2 rounded-full bg-gray-400" />
            <span class="text-gray-500 dark:text-gray-400">Tidak Dapat: {{ currentYearAoi.tidakDapat }}</span>
          </div>
        </div>
      </div>

      <!-- Progress Evidence Upload -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="size-10 rounded-lg flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20">
            <UIcon name="i-lucide-upload-cloud" class="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            {{ evidenceProgress.percentage }}%
          </span>
        </div>
        <p class="text-3xl font-bold text-gcg-dark dark:text-white">
          {{ evidenceProgress.uploaded }}/{{ evidenceProgress.totalQuestions }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Progress Evidence</p>
        <div class="mt-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
          <div
            class="h-2 rounded-full bg-emerald-500 transition-all duration-500"
            :style="{ width: `${evidenceProgress.percentage}%` }"
          />
        </div>
        <p class="text-xs text-gray-400 mt-1.5">Belum: {{ evidenceProgress.notUploaded }} · N/A: {{ evidenceProgress.na }}</p>
      </div>

      <!-- Tahun Asesmen Aktif -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="size-10 rounded-lg flex items-center justify-center bg-gcg-light dark:bg-gcg-primary/20">
            <UIcon name="i-lucide-calendar-check" class="size-5 text-gcg-primary dark:text-gcg-accent" />
          </div>
          <span
            class="text-xs font-semibold px-2 py-0.5 rounded-full"
            :class="assessmentStatusClass"
          >
            {{ activeAssessment.status }}
          </span>
        </div>
        <p class="text-3xl font-bold text-gcg-dark dark:text-white">
          {{ activeAssessment.year }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Tahun Asesmen Aktif</p>
        <div class="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <UIcon name="i-lucide-info" class="size-3.5" />
          <span>
            {{ activeAssessment.status === 'Input' ? 'Sedang proses input data' : activeAssessment.status === 'Review' ? 'Dalam tahap review' : 'Asesmen telah final' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Row 2: Trend Chart -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="font-semibold text-gcg-dark dark:text-white">Tren Pencapaian Skor ACGS</h3>
          <p class="text-xs text-gray-400 mt-0.5">Perkembangan skor per tahun dengan target {{ targetScore }}%</p>
        </div>
        <div class="flex items-center gap-1.5 text-xs text-gray-400">
          <UIcon name="i-lucide-trending-up" class="size-4" />
          <span>{{ trendData.length }} tahun</span>
        </div>
      </div>
      <div class="h-72 sm:h-80">
        <ClientOnly>
          <DashboardChartsTrendChart :data="trendData" />
          <template #fallback>
            <div class="h-full flex items-center justify-center text-gray-400">
              <UIcon name="i-lucide-loader-2" class="size-6 animate-spin" />
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>

    <!-- Row 3: Part Scores + AoI Status -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
      <!-- Bar Chart: Skor per Part -->
      <div class="lg:col-span-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-semibold text-gcg-dark dark:text-white">Pencapaian per Bagian</h3>
            <p class="text-xs text-gray-400 mt-0.5">Skor Level 1 + Level 2 per Part ({{ selectedYear }})</p>
          </div>
        </div>
        <div class="h-64">
          <ClientOnly>
            <DashboardChartsPartScoreChart :data="partScores" />
            <template #fallback>
              <div class="h-full flex items-center justify-center text-gray-400">
                <UIcon name="i-lucide-loader-2" class="size-6 animate-spin" />
              </div>
            </template>
          </ClientOnly>
        </div>
        <!-- Part Detail Table -->
        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-b border-gray-100 dark:border-gray-800">
                <th class="text-left py-2 font-medium text-gray-400">Bagian</th>
                <th class="text-right py-2 font-medium text-gray-400">L1</th>
                <th class="text-right py-2 font-medium text-gray-400">L2</th>
                <th class="text-right py-2 font-medium text-gray-400">Total</th>
                <th class="text-right py-2 font-medium text-gray-400">%</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="part in partScores"
                :key="part.code"
                class="border-b border-gray-50 dark:border-gray-800/50"
              >
                <td class="py-2 text-gcg-dark dark:text-gray-200">Part {{ part.code }}</td>
                <td class="text-right py-2 text-gray-500">{{ part.level1Score }}/{{ part.level1Max }}</td>
                <td class="text-right py-2 text-gray-500">{{ part.level2Score }}/{{ part.level2Max }}</td>
                <td class="text-right py-2 font-medium text-gcg-dark dark:text-white">{{ part.totalScore }}/{{ part.totalMax }}</td>
                <td class="text-right py-2">
                  <span
                    class="font-semibold"
                    :class="part.percentage >= 90 ? 'text-green-600' : part.percentage >= 70 ? 'text-amber-600' : 'text-red-600'"
                  >
                    {{ part.percentage }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Donut Chart: AoI Status -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="mb-4">
          <h3 class="font-semibold text-gcg-dark dark:text-white">Status Area of Improvement</h3>
          <p class="text-xs text-gray-400 mt-0.5">Distribusi status AoI tahun {{ selectedYear }}</p>
        </div>
        <div class="h-56">
          <ClientOnly>
            <DashboardChartsAoiStatusChart :data="currentYearAoi" />
            <template #fallback>
              <div class="h-full flex items-center justify-center text-gray-400">
                <UIcon name="i-lucide-loader-2" class="size-6 animate-spin" />
              </div>
            </template>
          </ClientOnly>
        </div>
        <!-- AoI per Year Mini Table -->
        <div class="mt-4">
          <h4 class="text-xs font-medium text-gray-400 mb-2">Ringkasan AoI per Tahun</h4>
          <div class="space-y-2">
            <div
              v-for="(aoi, year) in aoiByYear"
              :key="year"
              class="flex items-center justify-between p-2 rounded-lg text-xs"
              :class="Number(year) === selectedYear
                ? 'bg-gcg-light dark:bg-gcg-primary/10 border border-gcg-accent/30'
                : 'bg-gray-50 dark:bg-gray-800/50'"
            >
              <span class="font-medium text-gcg-dark dark:text-white">{{ year }}</span>
              <div class="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <span class="text-green-600">{{ aoi.selesai }}</span>
                <span class="text-yellow-600">{{ aoi.onProgress }}</span>
                <span class="text-red-600">{{ aoi.belum }}</span>
                <span class="font-medium text-gcg-dark dark:text-white">{{ aoi.total }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 4: Summary Stats & Top 3 Weakest -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Summary Statistics -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 class="font-semibold text-gcg-dark dark:text-white mb-4">Ringkasan Statistik</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p class="text-2xl font-bold text-gcg-dark dark:text-white">193</p>
            <p class="text-xs text-gray-500 mt-1">Total Pertanyaan ACGS</p>
          </div>
          <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p class="text-2xl font-bold text-gcg-dark dark:text-white">{{ summary.totalFulfilled }}</p>
            <p class="text-xs text-gray-500 mt-1">Pertanyaan Terpenuhi</p>
          </div>
          <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p class="text-2xl font-bold text-gcg-dark dark:text-white">{{ evidenceProgress.uploaded }}</p>
            <p class="text-xs text-gray-500 mt-1">Evidence Ter-upload</p>
          </div>
          <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p class="text-2xl font-bold text-green-600">{{ aoiClosedThisYear }}</p>
            <p class="text-xs text-gray-500 mt-1">AoI Selesai Tahun Ini</p>
          </div>
          <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p class="text-2xl font-bold text-gcg-primary dark:text-gcg-accent">85.71</p>
            <p class="text-xs text-gray-500 mt-1">Benchmark PLN 2024</p>
          </div>
          <div class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <p class="text-2xl font-bold" :class="summary.percentage >= 85.71 ? 'text-green-600' : 'text-red-600'">
              {{ summary.percentage >= 85.71 ? '↑' : '↓' }} {{ Math.abs(Number((summary.percentage - 85.71).toFixed(2))) }}%
            </p>
            <p class="text-xs text-gray-500 mt-1">vs Benchmark PLN</p>
          </div>
        </div>
      </div>

      <!-- Top 3 Weakest Sections -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center gap-2 mb-4">
          <UIcon name="i-lucide-alert-triangle" class="size-4 text-amber-500" />
          <h3 class="font-semibold text-gcg-dark dark:text-white">Bagian Perlu Perhatian</h3>
        </div>
        <div class="space-y-3">
          <div
            v-for="(part, idx) in top3Weakest"
            :key="part.code"
            class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
          >
            <div
              class="size-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
              :class="idx === 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                : idx === 1 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'"
            >
              {{ idx + 1 }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-gcg-dark dark:text-white">Part {{ part.code }}</p>
                <span
                  class="text-sm font-bold"
                  :class="part.percentage >= 90 ? 'text-green-600' : part.percentage >= 70 ? 'text-amber-600' : 'text-red-600'"
                >
                  {{ part.percentage }}%
                </span>
              </div>
              <p class="text-xs text-gray-400 mt-0.5 truncate">{{ part.name }}</p>
              <div class="mt-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  class="h-1.5 rounded-full transition-all duration-500"
                  :class="part.percentage >= 90 ? 'bg-green-500' : part.percentage >= 70 ? 'bg-amber-500' : 'bg-red-500'"
                  :style="{ width: `${part.percentage}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  title: 'Dashboard ACGS',
})

useHead({
  title: 'Dashboard ACGS — GCG Monitoring System',
})

const {
  selectedYear,
  availableYears,
  summary,
  scoreChange,
  currentYearAoi,
  overallAoi,
  evidenceProgress,
  activeAssessment,
  partScores,
  trendData,
  top3Weakest,
  aoiClosedThisYear,
  aoiByYear,
  targetScore,
} = useDashboardData()

const scoreColorClass = computed(() => {
  const pct = summary.value.percentage
  if (pct >= 90) return 'text-green-600 dark:text-green-400'
  if (pct >= 70) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
})

const scoreBarColorClass = computed(() => {
  const pct = summary.value.percentage
  if (pct >= 90) return 'bg-green-500'
  if (pct >= 70) return 'bg-amber-500'
  return 'bg-red-500'
})

const assessmentStatusClass = computed(() => {
  switch (activeAssessment.value.status) {
    case 'Input': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'Review': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'Final': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    default: return 'bg-gray-100 text-gray-700'
  }
})
</script>
