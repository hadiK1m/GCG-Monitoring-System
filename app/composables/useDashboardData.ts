import { useAcgsSummary, ACGS_SECTION_NAMES } from './useAcgsSummary'
import type { AcgsSectionData } from './useAcgsSummary'

export type AoiStatus = 'selesai' | 'onProgress' | 'belum' | 'tidakDapat'

export interface AoiBreakdown {
  total: number
  selesai: number
  onProgress: number
  belum: number
  tidakDapat: number
}

export interface EvidenceProgress {
  totalQuestions: number
  uploaded: number
  notUploaded: number
  na: number
  percentage: number
}

export interface PartScore {
  code: 'A' | 'B' | 'C' | 'D'
  name: string
  level1Score: number
  level1Max: number
  level2Score: number
  level2Max: number
  totalScore: number
  totalMax: number
  percentage: number
}

export interface TrendPoint {
  year: number
  totalScore: number
  totalMax: number
  percentage: number
  level1Percentage: number
  level2Percentage: number
  target: number
}

export interface YearAssessment {
  year: number
  status: 'Input' | 'Review' | 'Final'
}

const AOI_BY_YEAR: Record<number, AoiBreakdown> = {
  2023: { total: 28, selesai: 18, onProgress: 5, belum: 2, tidakDapat: 3 },
  2024: { total: 20, selesai: 12, onProgress: 4, belum: 2, tidakDapat: 2 },
  2025: { total: 12, selesai: 5, onProgress: 4, belum: 2, tidakDapat: 1 },
  2026: { total: 10, selesai: 2, onProgress: 5, belum: 2, tidakDapat: 1 },
}

const EVIDENCE_BY_YEAR: Record<number, EvidenceProgress> = {
  2023: { totalQuestions: 193, uploaded: 185, notUploaded: 3, na: 5, percentage: 95.9 },
  2024: { totalQuestions: 193, uploaded: 178, notUploaded: 8, na: 7, percentage: 92.2 },
  2025: { totalQuestions: 193, uploaded: 162, notUploaded: 22, na: 9, percentage: 84.0 },
  2026: { totalQuestions: 193, uploaded: 118, notUploaded: 65, na: 10, percentage: 61.1 },
}

const YEAR_STATUS: Record<number, YearAssessment['status']> = {
  2023: 'Final',
  2024: 'Final',
  2025: 'Review',
  2026: 'Input',
}

const TARGET_SCORE = 90

function computePartScores(yearData: AcgsSectionData[]): PartScore[] {
  const codes: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D']
  return codes.map((code) => {
    const l1 = yearData.find(d => d.sectionCode === code && d.level === 1)
    const l2 = yearData.find(d => d.sectionCode === code && d.level === 2)
    const l1Score = l1?.achievedScore ?? 0
    const l1Max = l1?.maxScore ?? 0
    const l2Score = l2?.achievedScore ?? 0
    const l2Max = l2?.maxScore ?? 0
    const totalScore = l1Score + l2Score
    const totalMax = l1Max + l2Max
    return {
      code,
      name: ACGS_SECTION_NAMES[code],
      level1Score: l1Score,
      level1Max: l1Max,
      level2Score: l2Score,
      level2Max: l2Max,
      totalScore,
      totalMax,
      percentage: totalMax > 0 ? Number(((totalScore / totalMax) * 100).toFixed(1)) : 0,
    }
  })
}

export function useDashboardData() {
  const acgs = useAcgsSummary()

  const currentYearAoi = computed(() =>
    AOI_BY_YEAR[acgs.selectedYear.value] ?? { total: 0, selesai: 0, onProgress: 0, belum: 0, tidakDapat: 0 },
  )

  const overallAoi = computed<AoiBreakdown>(() => {
    const all = Object.values(AOI_BY_YEAR)
    return {
      total: all.reduce((s, a) => s + a.total, 0),
      selesai: all.reduce((s, a) => s + a.selesai, 0),
      onProgress: all.reduce((s, a) => s + a.onProgress, 0),
      belum: all.reduce((s, a) => s + a.belum, 0),
      tidakDapat: all.reduce((s, a) => s + a.tidakDapat, 0),
    }
  })

  const evidenceProgress = computed(() =>
    EVIDENCE_BY_YEAR[acgs.selectedYear.value] ?? { totalQuestions: 193, uploaded: 0, notUploaded: 193, na: 0, percentage: 0 },
  )

  const activeAssessment = computed<YearAssessment>(() => ({
    year: acgs.selectedYear.value,
    status: YEAR_STATUS[acgs.selectedYear.value] ?? 'Input',
  }))

  const previousYearSummary = computed(() => {
    const prevYear = acgs.selectedYear.value - 1
    const hasPrev = acgs.availableYears.value.some(y => y.value === prevYear)
    if (!hasPrev) return null
    return acgs.getSummaryForYear(prevYear)
  })

  const scoreChange = computed(() => {
    if (!previousYearSummary.value) return null
    const curr = acgs.summary.value.percentage
    const prev = previousYearSummary.value.percentage
    return {
      absolute: Number((curr - prev).toFixed(2)),
      direction: curr >= prev ? 'up' as const : 'down' as const,
    }
  })

  const partScores = computed(() => computePartScores(acgs.yearData.value))

  const trendData = computed<TrendPoint[]>(() => {
    return acgs.availableYears.value
      .map((y) => {
        const s = acgs.getSummaryForYear(y.value)
        return {
          year: y.value,
          totalScore: s.totalScore,
          totalMax: s.maxScore,
          percentage: s.percentage,
          level1Percentage: s.level1Percentage,
          level2Percentage: s.level2Percentage,
          target: TARGET_SCORE,
        }
      })
      .sort((a, b) => a.year - b.year)
  })

  const top3Weakest = computed(() =>
    [...partScores.value]
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 3),
  )

  const aoiClosedThisYear = computed(() =>
    AOI_BY_YEAR[acgs.selectedYear.value]?.selesai ?? 0,
  )

  return {
    ...acgs,
    currentYearAoi,
    overallAoi,
    evidenceProgress,
    activeAssessment,
    previousYearSummary,
    scoreChange,
    partScores,
    trendData,
    top3Weakest,
    aoiClosedThisYear,
    aoiByYear: AOI_BY_YEAR,
    targetScore: TARGET_SCORE,
  }
}
