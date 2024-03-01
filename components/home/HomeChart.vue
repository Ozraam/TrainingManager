<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, registerables } from 'chart.js'
ChartJS.register(...registerables)

const props = defineProps<{
    yearsStat: {
        year: number
        budget: number
        expenses: number
        trainingPlanned: number
        trainingDone: number
    }[],
    currentPage: number
}>()

const dataBudget = computed(() => ({
    labels: ['Budget Remaining', 'Expenses'],
    datasets: [
        {
            label: 'Budget',
            data: props.yearsStat[props.currentPage - 1]
                ? [
                    props.yearsStat[props.currentPage - 1].budget - props.yearsStat[props.currentPage - 1].expenses,
                    props.yearsStat[props.currentPage - 1].expenses,
                ]
                : [0, 0],
            backgroundColor: ['#4CAF50', '#FF5252'],
        },
    ],
}))

const dataTraining = computed(() => ({
    labels: ['Training Planned', 'Training Done'],
    datasets: [
        {
            label: 'Training',
            data: props.yearsStat[props.currentPage - 1]
                ? [
                    props.yearsStat[props.currentPage - 1].trainingPlanned - props.yearsStat[props.currentPage - 1].trainingDone,
                    props.yearsStat[props.currentPage - 1].trainingDone,
                ]
                : [0, 0],
            backgroundColor: ['#2196F3', '#FFC107'],
        },
    ],
}))
</script>

<template>
    <div
        class="flex gap-6 max-w-80 -translate-x-1/2"
    >
        <div class="flex flex-col items-center">
            <h2>
                {{ $t('home.budget') }}
            </h2>

            <span>
                {{ props.yearsStat[props.currentPage - 1]?.expenses }} € / {{ props.yearsStat[props.currentPage - 1]?.budget }} €
            </span>

            <Pie
                :data="dataBudget"
                class="w-50"
            />
        </div>

        <div class="flex flex-col items-center">
            <h2>
                {{ $t('home.training') }}
            </h2>

            <span>
                {{ props.yearsStat[props.currentPage - 1]?.trainingDone }} {{ $t("home.chart.done") }} / {{ props.yearsStat[props.currentPage - 1]?.trainingPlanned }} {{ $t("home.chart.planned") }}
            </span>

            <Pie
                :data="dataTraining"
                class="w-50"
            />
        </div>
    </div>
</template>
