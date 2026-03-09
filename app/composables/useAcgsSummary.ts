export interface AcgsSectionData {
  year: number
  level: 1 | 2
  sectionCode: 'A' | 'B' | 'C' | 'D'
  sectionName: string
  totalQuestions: number
  maxScore: number
  achievedScore: number
  percentage: number
  aoiCount: number
}

export interface AcgsLevelSummary {
  totalQuestions: number
  maxScore: number
  achievedScore: number
  percentage: number
  aoiCount: number
}

export interface AcgsYearSummary {
  totalScore: number
  maxScore: number
  percentage: number
  level1Score: number
  level1Max: number
  level1Percentage: number
  level2Score: number
  level2Max: number
  level2Percentage: number
  totalQuestions: number
  totalFulfilled: number
  totalAOI: number
}

export const ACGS_SECTION_NAMES: Record<'A' | 'B' | 'C' | 'D', string> = {
  A: 'Hak-hak dan Perlakuan Setara terhadap Pemegang Saham',
  B: 'Keberlanjutan dan Ketahanan',
  C: 'Transparansi dan Pengungkapan',
  D: 'Tanggung Jawab Dewan',
}

function section(
  year: number,
  level: 1 | 2,
  code: 'A' | 'B' | 'C' | 'D',
  totalQuestions: number,
  achievedScore: number,
  aoiCount: number,
): AcgsSectionData {
  return {
    year,
    level,
    sectionCode: code,
    sectionName: ACGS_SECTION_NAMES[code],
    totalQuestions,
    maxScore: totalQuestions,
    achievedScore,
    percentage: Number(((achievedScore / totalQuestions) * 100).toFixed(2)),
    aoiCount,
  }
}

/**
 * 193 pertanyaan ACGS — distribusi per level & bagian:
 *   Level 1 (125): A=42, B=20, C=38, D=25
 *   Level 2 (68):  A=15, B=10, C=20, D=23
 *
 * Skor per tahun:
 *   2023 → 154/193 = 79.79%
 *   2024 → 165/193 = 85.49%  (mendekati 85.71 sesuai dokumen)
 *   2025 → 170/193 = 88.08%
 *   2026 → 174/193 = 90.16%
 */
const MOCK_DATA: AcgsSectionData[] = [
  // ── 2023 ── total 154/193 = 79.79%
  section(2023, 1, 'A', 42, 36, 4),
  section(2023, 1, 'B', 20, 16, 3),
  section(2023, 1, 'C', 38, 33, 3),
  section(2023, 1, 'D', 25, 20, 4),
  section(2023, 2, 'A', 15, 11, 3),
  section(2023, 2, 'B', 10, 7, 2),
  section(2023, 2, 'C', 20, 15, 4),
  section(2023, 2, 'D', 23, 16, 5),

  // ── 2024 ── total 165/193 = 85.49%
  section(2024, 1, 'A', 42, 38, 3),
  section(2024, 1, 'B', 20, 17, 2),
  section(2024, 1, 'C', 38, 35, 2),
  section(2024, 1, 'D', 25, 21, 3),
  section(2024, 2, 'A', 15, 12, 2),
  section(2024, 2, 'B', 10, 7, 2),
  section(2024, 2, 'C', 20, 17, 2),
  section(2024, 2, 'D', 23, 18, 4),

  // ── 2025 ── total 170/193 = 88.08%
  section(2025, 1, 'A', 42, 39, 2),
  section(2025, 1, 'B', 20, 18, 1),
  section(2025, 1, 'C', 38, 35, 2),
  section(2025, 1, 'D', 25, 22, 2),
  section(2025, 2, 'A', 15, 13, 1),
  section(2025, 2, 'B', 10, 8, 1),
  section(2025, 2, 'C', 20, 17, 2),
  section(2025, 2, 'D', 23, 18, 3),

  // ── 2026 ── total 174/193 = 90.16%
  section(2026, 1, 'A', 42, 40, 1),
  section(2026, 1, 'B', 20, 18, 1),
  section(2026, 1, 'C', 38, 36, 1),
  section(2026, 1, 'D', 25, 23, 1),
  section(2026, 2, 'A', 15, 13, 1),
  section(2026, 2, 'B', 10, 8, 1),
  section(2026, 2, 'C', 20, 18, 1),
  section(2026, 2, 'D', 23, 18, 3),
]

function computeSubtotal(data: AcgsSectionData[]): AcgsLevelSummary {
  const totalQuestions = data.reduce((s, d) => s + d.totalQuestions, 0)
  const maxScore = data.reduce((s, d) => s + d.maxScore, 0)
  const achievedScore = data.reduce((s, d) => s + d.achievedScore, 0)
  const aoiCount = data.reduce((s, d) => s + d.aoiCount, 0)
  return {
    totalQuestions,
    maxScore,
    achievedScore,
    percentage: maxScore > 0 ? Number(((achievedScore / maxScore) * 100).toFixed(2)) : 0,
    aoiCount,
  }
}

/** Returns section data for a given year without mutating reactive state. */
function getYearDataForYear(year: number): AcgsSectionData[] {
  return MOCK_DATA.filter(d => d.year === year)
}

/** Returns summary for a given year without mutating reactive state. Safe for use inside computed. */
function getSummaryForYear(year: number): AcgsYearSummary {
  const yd = getYearDataForYear(year)
  const l1 = computeSubtotal(yd.filter(d => d.level === 1))
  const l2 = computeSubtotal(yd.filter(d => d.level === 2))
  const gt = computeSubtotal(yd)
  return {
    totalScore: gt.achievedScore,
    maxScore: gt.maxScore,
    percentage: gt.percentage,
    level1Score: l1.achievedScore,
    level1Max: l1.maxScore,
    level1Percentage: l1.percentage,
    level2Score: l2.achievedScore,
    level2Max: l2.maxScore,
    level2Percentage: l2.percentage,
    totalQuestions: gt.totalQuestions,
    totalFulfilled: gt.achievedScore,
    totalAOI: gt.aoiCount,
  }
}

export function useAcgsSummary() {
  const latestYear = Math.max(...MOCK_DATA.map(d => d.year))
  const selectedYear = ref<number>(latestYear)

  const availableYears = computed(() => {
    const years = [...new Set(MOCK_DATA.map(d => d.year))].sort((a, b) => b - a)
    return years.map(y => ({ label: y.toString(), value: y }))
  })

  const yearData = computed(() => MOCK_DATA.filter(d => d.year === selectedYear.value))
  const level1Data = computed(() => yearData.value.filter(d => d.level === 1))
  const level2Data = computed(() => yearData.value.filter(d => d.level === 2))

  const level1Summary = computed(() => computeSubtotal(level1Data.value))
  const level2Summary = computed(() => computeSubtotal(level2Data.value))
  const grandTotal = computed(() => computeSubtotal(yearData.value))

  const summary = computed<AcgsYearSummary>(() => getSummaryForYear(selectedYear.value))

  return {
    selectedYear,
    availableYears,
    yearData,
    level1Data,
    level2Data,
    level1Summary,
    level2Summary,
    grandTotal,
    summary,
    getSummaryForYear,
    getYearDataForYear,
  }
}
