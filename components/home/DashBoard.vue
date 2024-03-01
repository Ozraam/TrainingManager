<script setup lang="ts">
const years = ref([2021, 2022, 2023, 2024, 2025, 2026])
const currentPage = ref(1)

const yearsStat = ref(years.value.map((year) => {
    const budget = Math.floor(Math.random() * 10000)
    const trainingPlanned = Math.floor(Math.random() * 30)

    return {
        year,
        budget,
        expenses: Math.floor(Math.random() * budget),
        trainingPlanned,
        trainingDone: Math.floor(Math.random() * trainingPlanned),
    }
}))
</script>

<template>
    <section class="m-3 flex flex-col items-center">
        <h1 class="text-2xl font-bold">
            {{ $t('home.welcome') }}
        </h1>

        <UPagination
            v-model="currentPage"
            :max="5"
            :total="years.length"
            :page-count="1"
        /> <!-- TODO : create custom pagination to show year -->

        <HomeChart
            :years-stat="yearsStat"
            :current-page="currentPage"
            class="mt-3"
        />

        <HomeRecapTrainingList
            :years-stat="yearsStat"
            :current-page="currentPage"
            class="mt-10"
        />
    </section>
</template>
