<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import type { PartScore } from '~/composables/useDashboardData'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  data: PartScore[]
}>()

const PART_COLORS = {
  level1: ['#125d72', '#167a96', '#1a8fad', '#14a2ba'],
  level2: ['#0e4a5b', '#126475', '#157a8e', '#1890a8'],
}

const chartData = computed(() => ({
  labels: props.data.map(d => `Part ${d.code}`),
  datasets: [
    {
      label: 'Level 1',
      data: props.data.map(d => d.level1Score),
      backgroundColor: PART_COLORS.level1,
      borderRadius: 4,
      barPercentage: 0.7,
    },
    {
      label: 'Level 2',
      data: props.data.map(d => d.level2Score),
      backgroundColor: PART_COLORS.level2,
      borderRadius: 4,
      barPercentage: 0.7,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 16,
        font: { size: 12 },
      },
    },
    tooltip: {
      backgroundColor: '#09303b',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        afterLabel: (ctx: any) => {
          const part = props.data[ctx.dataIndex]
          if (!part) return ''
          const max = ctx.datasetIndex === 0 ? part.level1Max : part.level2Max
          return `Maks: ${max}`
        },
      },
    },
  },
  scales: {
    y: {
      stacked: true,
      beginAtZero: true,
      ticks: { font: { size: 11 } },
      grid: { color: 'rgba(0,0,0,0.06)' },
    },
    x: {
      stacked: true,
      grid: { display: false },
      ticks: { font: { size: 12, weight: 500 as any } },
    },
  },
}))
</script>
