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
type TrainingData = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        total: number;
    };
};
const dataTraining = computed<TrainingData>(() => ({
    labels: ['Training Done', 'Training Delayed', 'Training Planned remaining'],
    datasets: {
        label: 'Training',
        data: props.yearsStat
            ? [
                doneTrainning.value,
                delayTrainning.value,
                plannedTrainning.value - doneTrainning.value - delayTrainning.value,
            ]
            : [0, 0],
        backgroundColor: ['#4CAF50', '#FF5252', '#FFC107'],
        total: plannedTrainning.value,
    },
}))
</script>

<template>
    <div
        class="flex flex-col gap-6 max-w-80"
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
                {{ doneTrainning }} {{ $t("home.chart.done") }} / {{ delayTrainning }} {{ $t("home.chart.delay") }} / {{ plannedTrainning }} {{ $t("home.chart.planned") }}
            </span>

            <HomeCustomBarChart :datasets="dataTraining" />
        </div>
    </div>
</template>
