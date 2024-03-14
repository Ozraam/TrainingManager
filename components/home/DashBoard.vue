<script setup lang="ts">
// const sp = useSupabaseClient()

// const { data: yearsData, error } = await sp.from('Forecast').select('year, budget')

// if (error) {
//     console.log(error)
//     throw new Error('Error while fetching years' + error.message) // TODO: handle error
// }

const data : Ref<YearData[]> = ref([])
useFetch('/api/DataYears').then((res) => {
    if (res.error.value) {
        throw new Error('Error while fetching years' + res.error.value?.message) // TODO: handle error
    } else {
        data.value = res.data.value!.data as YearData[]

        years.value = data.value.map(d => d.year)

        currentPage.value = years.value.length - 1
    }
})

const years : Ref<number[]> = ref([])
// current page is set to the last year
const currentPage = ref(0)
</script>

<template>
    <section class="m-3 flex flex-col items-center">
        <h1 class="text-2xl font-bold">
            {{ $t('home.welcome') }}
        </h1>

        <div
            v-if="data.length > 0"
            class="flex flex-col items-center"
        >
            <HomeYearPagination
                v-model="currentPage"
                :years="years"
                class="mt-3"
            />

            <HomeChart
                :years-stat="data[currentPage]"
                class="mt-3"
            />

            <HomeRecapTrainingList
                :years-stat="data[currentPage]"
                class="mt-10"
            />
        </div>
    </section>
</template>
