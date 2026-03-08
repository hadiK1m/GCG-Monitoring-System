<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import type { AoiBreakdown } from '~/composables/useDashboardData'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  data: AoiBreakdown
}>()

const chartData = computed(() => ({
  labels: ['Selesai', 'On Progress', 'Belum', 'Tidak Dapat 100%'],
  datasets: [
    {
      data: [props.data.selesai, props.data.onProgress, props.data.belum, props.data.tidakDapat],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverOffset: 6,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 14,
        font: { size: 11 },
        generateLabels: (chart: any) => {
          const dataset = chart.data.datasets[0]
          return chart.data.labels.map((label: string, i: number) => ({
            text: `${label} (${dataset.data[i]})`,
            fillStyle: dataset.backgroundColor[i],
            strokeStyle: dataset.backgroundColor[i],
            pointStyle: 'circle',
            hidden: false,
            index: i,
          }))
        },
      },
    },
    tooltip: {
      backgroundColor: '#09303b',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (ctx: any) => {
          const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : '0'
          return `${ctx.label}: ${ctx.parsed} (${pct}%)`
        },
      },
    },
  },
}))
</script>
