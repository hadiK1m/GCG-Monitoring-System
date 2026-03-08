<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import type { TrendPoint } from '~/composables/useDashboardData'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps<{
  data: TrendPoint[]
}>()

const chartData = computed(() => ({
  labels: props.data.map(d => d.year.toString()),
  datasets: [
    {
      label: 'Total Skor (%)',
      data: props.data.map(d => d.percentage),
      borderColor: '#125d72',
      backgroundColor: 'rgba(18, 93, 114, 0.08)',
      fill: true,
      tension: 0.35,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: '#125d72',
      borderWidth: 2.5,
    },
    {
      label: 'Level 1 (%)',
      data: props.data.map(d => d.level1Percentage),
      borderColor: '#14a2ba',
      backgroundColor: 'transparent',
      borderDash: [6, 3],
      tension: 0.35,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#14a2ba',
      borderWidth: 2,
    },
    {
      label: 'Level 2 (%)',
      data: props.data.map(d => d.level2Percentage),
      borderColor: '#efe62f',
      backgroundColor: 'transparent',
      borderDash: [4, 4],
      tension: 0.35,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#efe62f',
      borderWidth: 2,
    },
    {
      label: 'Target (90%)',
      data: props.data.map(d => d.target),
      borderColor: '#ef4444',
      backgroundColor: 'transparent',
      borderDash: [10, 5],
      pointRadius: 0,
      borderWidth: 1.5,
      fill: false,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { size: 12 },
      },
    },
    tooltip: {
      backgroundColor: '#09303b',
      titleFont: { size: 13 },
      bodyFont: { size: 12 },
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y}%`,
      },
    },
  },
  scales: {
    y: {
      min: 60,
      max: 100,
      ticks: {
        callback: (v: any) => `${v}%`,
        font: { size: 11 },
      },
      grid: { color: 'rgba(0,0,0,0.06)' },
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 12, weight: 500 as any } },
    },
  },
}))
</script>
