<script setup lang="ts">
// const sp = useSupabaseClient()

// const { data: yearsData, error } = await sp.from('Forecast').select('year, budget')

// if (error) {
//     console.log(error)
//     throw new Error('Error while fetching years' + error.message) // TODO: handle error
// }

const data : Ref<YearData[]> = ref([
    {
        year: 2021,
        budget: 1000,
        competences: [
            {
                id: 1,
                name: 'welding',
                trainings: [
                    {
                        id: 1,
                        name: 'welding 101',
                        cost: 100,
                        duration: 10,
                        date: '2021-01-01',
                        operators: [
                            { name: 'John Doe', status: 'Done', id: 1 },
                            { name: 'Jane Doe', status: 'Planned', id: 2 }
                        ]
                    },
                    {
                        id: 2,
                        name: 'welding 102',
                        cost: 200,
                        duration: 20,
                        date: '2021-02-01',
                        operators: [
                            { name: 'John Doe', status: 'Delayed', id: 1 },
                            { name: 'Jane Doe', status: 'Planned', id: 2 }
                        ]
                    }
                ]
            },
            {
                id: 2,
                name: 'plumbing',
                trainings: [
                    {
                        id: 3,
                        name: 'plumbing 101',
                        cost: 100,
                        duration: 10,
                        date: '2021-01-01',
                        operators: [
                            { name: 'John Doe', status: 'Done', id: 1 },
                            { name: 'Jane Doe', status: 'Planned', id: 2 }
                        ]
                    },
                    {
                        id: 4,
                        name: 'plumbing 102',
                        cost: 200,
                        duration: 20,
                        date: '2021-02-01',
                        operators: [
                            { name: 'John Doe', status: 'Delayed', id: 1 },
                            { name: 'Jane Doe', status: 'Planned', id: 2 }
                        ]
                    }
                ]
            }
        ]
    },
    {
        year: 2022,
        budget: 2000,
        competences: [
            {
                id: 1,
                name: 'welding',
                trainings: [
                    {
                        id: 1,
                        name: 'welding 101',
                        cost: 100,
                        duration: 10,
                        date: '2022-01-01',
                        operators: [
                            { name: 'John Doe', status: 'Delayed', id: 1 },
                            { name: 'Jane Doe', status: 'Planned', id: 2 }
                        ]
                    },
                    {
                        id: 2,
                        name: 'welding 102',
                        cost: 200,
                        duration: 20,
                        date: '2022-02-01',
                        operators: [
                            { name: 'John Doe', status: 'Delayed', id: 1 },
                            { name: 'Jane Doe', status: 'Planned', id: 2 }
                        ]
                    }
                ]
            },
            {
                id: 2,
                name: 'plumbing',
                trainings: [
                    {
                        id: 3,
                        name: 'plumbing 101',
                        cost: 100,
                        duration: 10,
                        date: '2022-01-01',
                        operators: [
                            { name: 'John Doe', status: 'Done', id: 1 },
                            { name: 'Jane Doe', status: 'Planned', id: 2 }
                        ]
                    },
                    {
                        id: 4,
                        name: 'plumbing 102',
                        cost: 200,
                        duration: 20,
                        date: '2022-02-01',
                        operators: [
                            { name: 'John Doe', status: 'Delayed', id: 1 },
                            { name: 'Jane Doe', status: 'Planned', id: 2 }
                        ]
                    }
                ]
            }
        ]
    }
])

const years = ref(data.value.map(d => d.year))
// current page is set to the last year
const currentPage = ref(years.value.length - 1)
</script>

<template>
    <section class="m-3 flex flex-col items-center">
        <h1 class="text-2xl font-bold">
            {{ $t('home.welcome') }}
        </h1>

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
    </section>
</template>
