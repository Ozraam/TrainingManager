<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, registerables } from 'chart.js'
ChartJS.register(...registerables)

const props = defineProps<{
    yearsStat: YearData,
}>()

const expenses = computed(() => {
    const year = props.yearsStat
    return year.competences.reduce((acc, competence) => {
        return acc + competence.Training.reduce((acc, training) => {
            return acc + training.cost * training.Registration.length
        }, 0)
    }, 0)
})

const plannedTrainning = computed(() => {
    const year = props.yearsStat
    return year.competences.reduce((acc, competence) => {
        return acc + competence.Training.reduce((acc, training) => {
            return acc + training.Registration.length
        }, 0)
    }, 0)
})

const doneTrainning = computed(() => {
    const year = props.yearsStat
    return year.competences.reduce((acc, competence) => {
        return acc + competence.Training.reduce((acc, training) => {
            return acc + training.Registration.filter(reg => reg.State.name === 'done' || reg.State.name === 'expired').length
        }, 0)
    }, 0)
})

const delayTrainning = computed(() => {
    const year = props.yearsStat
    return year.competences.reduce((acc, competence) => {
        return acc + competence.Training.reduce((acc, training) => {
            return acc + training.Registration.filter(reg => reg.State.name === 'delayed').length
        }, 0)
    }, 0)
})

const dataBudget = computed(() => ({
    labels: ['Budget Remaining', 'Expenses'],
    datasets: [
        {
            label: 'Budget',
            data: props.yearsStat
                ? [
                    props.yearsStat.budget - expenses.value,
                    expenses.value,
                ]
                : [0, 0],
            backgroundColor: ['#4CAF50', '#FF5252'],
        },
    ],
}))

const dataTraining = computed(() => ({
    labels: ['Training Planned', 'Training Done', 'Training Delayed'],
    datasets: [
        {
            label: 'Training',
            data: props.yearsStat
                ? [
                    plannedTrainning.value - doneTrainning.value - delayTrainning.value,
                    doneTrainning.value,
                    delayTrainning.value,
                ]
                : [0, 0],
            backgroundColor: ['#2196F3', '#FFC107', '#FF5252'],
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
                {{ expenses }} € / {{ props.yearsStat?.budget }} €
            </span>

            <Pie
                :data="dataBudget"
                class="w-50 tracking-normal"
            />
        </div>

        <div class="flex flex-col items-center">
            <h2>
                {{ $t('home.training') }}
            </h2>

            <span>
                {{ doneTrainning }} {{ $t("home.chart.done") }} / {{ plannedTrainning }} {{ $t("home.chart.planned") }}
            </span>

            <Pie
                :data="dataTraining"
                class="w-50 tracking-normal"
            />
        </div>
    </div>
</template>
