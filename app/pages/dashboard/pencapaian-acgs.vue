<template>
  <div>
    <!-- Page Header + Year Selector -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gcg-dark dark:text-white">
          Pencapaian ACGS
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Hasil Asesmen ASEAN Corporate Governance Scorecard setiap tahun
        </p>
      </div>
      <div class="w-full sm:w-48">
        <USelect
          v-model="selectedYear"
          :options="availableYears"
          option-attribute="label"
          value-attribute="value"
          size="lg"
          placeholder="Pilih tahun..."
        />
      </div>
    </div>

    <!-- Summary Cards (6 cards, 3 columns) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <!-- Total Skor ACGS -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="size-10 rounded-lg flex items-center justify-center bg-gcg-light dark:bg-gcg-primary/20">
            <UIcon name="i-lucide-target" class="size-5 text-gcg-primary dark:text-gcg-accent" />
          </div>
        </div>
        <p class="text-2xl font-bold text-gcg-dark dark:text-white">{{ summary.percentage }}%</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ summary.totalScore }} dari {{ summary.maxScore }} poin
        </p>
        <div class="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            class="h-1.5 rounded-full bg-gcg-primary dark:bg-gcg-accent transition-all"
            :style="{ width: `${Math.min(summary.percentage, 100)}%` }"
          />
        </div>
      </div>

      <!-- Skor Level 1 -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="size-10 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
            <UIcon name="i-lucide-shield-check" class="size-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            Level 1
          </span>
        </div>
        <p class="text-2xl font-bold text-gcg-dark dark:text-white">{{ summary.level1Percentage }}%</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ summary.level1Score }} dari {{ summary.level1Max }} poin
        </p>
        <div class="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            class="h-1.5 rounded-full bg-blue-500 transition-all"
            :style="{ width: `${Math.min(summary.level1Percentage, 100)}%` }"
          />
        </div>
      </div>

      <!-- Skor Level 2 -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="size-10 rounded-lg flex items-center justify-center bg-purple-50 dark:bg-purple-900/20">
            <UIcon name="i-lucide-shield-plus" class="size-5 text-purple-600 dark:text-purple-400" />
          </div>
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            Level 2
          </span>
        </div>
        <p class="text-2xl font-bold text-gcg-dark dark:text-white">{{ summary.level2Percentage }}%</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ summary.level2Score }} dari {{ summary.level2Max }} poin
        </p>
        <div class="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div
            class="h-1.5 rounded-full bg-purple-500 transition-all"
            :style="{ width: `${Math.min(summary.level2Percentage, 100)}%` }"
          />
        </div>
      </div>

      <!-- Total Pertanyaan -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="size-10 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <UIcon name="i-lucide-list-checks" class="size-5 text-slate-600 dark:text-slate-400" />
          </div>
        </div>
        <p class="text-2xl font-bold text-gcg-dark dark:text-white">{{ summary.totalQuestions }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Total pertanyaan ACGS</p>
      </div>

      <!-- Pertanyaan Terpenuhi -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="size-10 rounded-lg flex items-center justify-center bg-green-50 dark:bg-green-900/20">
            <UIcon name="i-lucide-check-circle-2" class="size-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ summary.totalFulfilled }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Pertanyaan terpenuhi dari {{ summary.totalQuestions }}
        </p>
      </div>

      <!-- Total AOI -->
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="size-10 rounded-lg flex items-center justify-center bg-orange-50 dark:bg-orange-900/20">
            <UIcon name="i-lucide-alert-triangle" class="size-5 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ summary.totalAOI }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Area of Improvement</p>
      </div>
    </div>

    <!-- Assessment Detail Table -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div class="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <h3 class="font-semibold text-gcg-dark dark:text-white">
          Detail Penilaian Tahun {{ selectedYear }}
        </h3>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-800/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <th class="px-4 py-3">Level</th>
              <th class="px-4 py-3">Kode</th>
              <th class="px-4 py-3">Bagian</th>
              <th class="px-4 py-3 text-right">Pertanyaan</th>
              <th class="px-4 py-3 text-right">Skor</th>
              <th class="px-4 py-3 w-40">Persentase</th>
              <th class="px-4 py-3 text-right">AOI</th>
              <th class="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <!-- Level 1 Rows -->
            <tr
              v-for="row in level1Data"
              :key="`l1-${row.sectionCode}`"
              class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
            >
              <td class="px-4 py-3">
                <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/30">
                  Level 1
                </span>
              </td>
              <td class="px-4 py-3 font-semibold text-gcg-dark dark:text-white">{{ row.sectionCode }}</td>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">{{ row.sectionName }}</td>
              <td class="px-4 py-3 text-right text-gray-700 dark:text-gray-300">{{ row.totalQuestions }}</td>
              <td class="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                {{ row.achievedScore }} / {{ row.maxScore }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full transition-all"
                      :class="percentageBarColor(row.percentage)"
                      :style="{ width: `${Math.min(row.percentage, 100)}%` }"
                    />
                  </div>
                  <span class="text-xs font-medium text-gray-900 dark:text-white w-12 text-right">
                    {{ row.percentage }}%
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <span
                  class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                  :class="row.aoiCount > 0
                    ? 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-900/30 dark:text-orange-400 dark:ring-orange-400/30'
                    : 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400/30'
                  "
                >
                  {{ row.aoiCount }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <UButton
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-eye"
                    @click="navigateToDetail(row)"
                  />
                  <UButton
                    size="xs"
                    color="warning"
                    variant="ghost"
                    icon="i-lucide-alert-circle"
                    @click="navigateToAOI(row)"
                  />
                </div>
              </td>
            </tr>

            <!-- Level 1 Subtotal -->
            <tr class="bg-blue-50/70 dark:bg-blue-900/10 border-t-2 border-blue-200 dark:border-blue-800 font-semibold">
              <td class="px-4 py-3" colspan="3">
                <span class="text-blue-700 dark:text-blue-400">Total Level 1</span>
              </td>
              <td class="px-4 py-3 text-right text-blue-700 dark:text-blue-400">
                {{ level1Summary.totalQuestions }}
              </td>
              <td class="px-4 py-3 text-right text-blue-700 dark:text-blue-400">
                {{ level1Summary.achievedScore }} / {{ level1Summary.maxScore }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-blue-200 dark:bg-blue-800 rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full bg-blue-500 transition-all"
                      :style="{ width: `${Math.min(level1Summary.percentage, 100)}%` }"
                    />
                  </div>
                  <span class="text-xs font-medium text-blue-700 dark:text-blue-400 w-12 text-right">
                    {{ level1Summary.percentage }}%
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-right text-blue-700 dark:text-blue-400">
                {{ level1Summary.aoiCount }}
              </td>
              <td class="px-4 py-3" />
            </tr>

            <!-- Level 2 Rows -->
            <tr
              v-for="row in level2Data"
              :key="`l2-${row.sectionCode}`"
              class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
            >
              <td class="px-4 py-3">
                <span class="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20 dark:bg-purple-900/30 dark:text-purple-400 dark:ring-purple-400/30">
                  Level 2
                </span>
              </td>
              <td class="px-4 py-3 font-semibold text-gcg-dark dark:text-white">{{ row.sectionCode }}</td>
              <td class="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">{{ row.sectionName }}</td>
              <td class="px-4 py-3 text-right text-gray-700 dark:text-gray-300">{{ row.totalQuestions }}</td>
              <td class="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                {{ row.achievedScore }} / {{ row.maxScore }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full transition-all"
                      :class="percentageBarColor(row.percentage)"
                      :style="{ width: `${Math.min(row.percentage, 100)}%` }"
                    />
                  </div>
                  <span class="text-xs font-medium text-gray-900 dark:text-white w-12 text-right">
                    {{ row.percentage }}%
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <span
                  class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                  :class="row.aoiCount > 0
                    ? 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-900/30 dark:text-orange-400 dark:ring-orange-400/30'
                    : 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-400/30'
                  "
                >
                  {{ row.aoiCount }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <UButton
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-eye"
                    @click="navigateToDetail(row)"
                  />
                  <UButton
                    size="xs"
                    color="warning"
                    variant="ghost"
                    icon="i-lucide-alert-circle"
                    @click="navigateToAOI(row)"
                  />
                </div>
              </td>
            </tr>

            <!-- Level 2 Subtotal -->
            <tr class="bg-purple-50/70 dark:bg-purple-900/10 border-t-2 border-purple-200 dark:border-purple-800 font-semibold">
              <td class="px-4 py-3" colspan="3">
                <span class="text-purple-700 dark:text-purple-400">Total Level 2</span>
              </td>
              <td class="px-4 py-3 text-right text-purple-700 dark:text-purple-400">
                {{ level2Summary.totalQuestions }}
              </td>
              <td class="px-4 py-3 text-right text-purple-700 dark:text-purple-400">
                {{ level2Summary.achievedScore }} / {{ level2Summary.maxScore }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-purple-200 dark:bg-purple-800 rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full bg-purple-500 transition-all"
                      :style="{ width: `${Math.min(level2Summary.percentage, 100)}%` }"
                    />
                  </div>
                  <span class="text-xs font-medium text-purple-700 dark:text-purple-400 w-12 text-right">
                    {{ level2Summary.percentage }}%
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-right text-purple-700 dark:text-purple-400">
                {{ level2Summary.aoiCount }}
              </td>
              <td class="px-4 py-3" />
            </tr>

            <!-- Grand Total -->
            <tr class="bg-gcg-light/70 dark:bg-gcg-primary/10 border-t-2 border-gcg-primary/30 dark:border-gcg-accent/30 font-bold">
              <td class="px-4 py-3" colspan="3">
                <span class="text-gcg-primary dark:text-gcg-accent">Total Keseluruhan</span>
              </td>
              <td class="px-4 py-3 text-right text-gcg-primary dark:text-gcg-accent">
                {{ grandTotal.totalQuestions }}
              </td>
              <td class="px-4 py-3 text-right text-gcg-primary dark:text-gcg-accent">
                {{ grandTotal.achievedScore }} / {{ grandTotal.maxScore }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full bg-gcg-primary dark:bg-gcg-accent transition-all"
                      :style="{ width: `${Math.min(grandTotal.percentage, 100)}%` }"
                    />
                  </div>
                  <span class="text-xs font-medium text-gcg-primary dark:text-gcg-accent w-12 text-right">
                    {{ grandTotal.percentage }}%
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-right text-gcg-primary dark:text-gcg-accent">
                {{ grandTotal.aoiCount }}
              </td>
              <td class="px-4 py-3" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AcgsSectionData } from '~/composables/useAcgsSummary'

definePageMeta({
  layout: 'dashboard',
  title: 'Pencapaian ACGS',
})

useHead({
  title: 'Pencapaian ACGS — GCG Monitoring System',
})

const {
  selectedYear,
  availableYears,
  level1Data,
  level2Data,
  level1Summary,
  level2Summary,
  grandTotal,
  summary,
} = useAcgsSummary()

function percentageBarColor(pct: number): string {
  if (pct >= 85) return 'bg-green-500'
  if (pct >= 70) return 'bg-blue-500'
  if (pct >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

function navigateToDetail(row: AcgsSectionData) {
  navigateTo(`/dashboard/detail-pencapaian-acgs?year=${row.year}&level=${row.level}&section=${row.sectionCode}`)
}

function navigateToAOI(row: AcgsSectionData) {
  navigateTo(`/dashboard/area-of-improvement?year=${row.year}&level=${row.level}&section=${row.sectionCode}`)
}
</script>
