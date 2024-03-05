<script setup lang="ts">
// const sp = useSupabaseClient()

// const { data: yearsData, error } = await sp.from('Forecast').select('year, budget')

// if (error) {
//     console.log(error)
//     throw new Error('Error while fetching years' + error.message) // TODO: handle error
// }

const data = ref([
    {
        year: 2021,
        budget: 1000,
        competences: [
            {
                name: 'welding',
                trainings: [
                    {
                        name: 'welding 101',
                        cost: 100,
                        duration: 10,
                        date: '2021-01-01',
                        operators: [
                            { name: 'John Doe', status: 'Done' },
                            { name: 'Jane Doe', status: 'Planned' }
                        ]
                    },
                    {
                        name: 'welding 102',
                        cost: 200,
                        duration: 20,
                        date: '2021-02-01',
                        operators: [
                            { name: 'John Doe', status: 'Delayed' },
                            { name: 'Jane Doe', status: 'Planned' }
                        ]
                    }
                ]
            },
            {
                name: 'plumbing',
                trainings: [
                    {
                        name: 'plumbing 101',
                        cost: 100,
                        duration: 10,
                        date: '2021-01-01',
                        operators: [
                            { name: 'John Doe', status: 'Done' },
                            { name: 'Jane Doe', status: 'Planned' }
                        ]
                    },
                    {
                        name: 'plumbing 102',
                        cost: 200,
                        duration: 20,
                        date: '2021-02-01',
                        operators: [
                            { name: 'John Doe', status: 'Delayed' },
                            { name: 'Jane Doe', status: 'Planned' }
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
                name: 'welding',
                trainings: [
                    {
                        name: 'welding 101',
                        cost: 100,
                        duration: 10,
                        date: '2022-01-01',
                        operators: [
                            { name: 'John Doe', status: 'Delayed' },
                            { name: 'Jane Doe', status: 'Planned' }
                        ]
                    },
                    {
                        name: 'welding 102',
                        cost: 200,
                        duration: 20,
                        date: '2022-02-01',
                        operators: [
                            { name: 'John Doe', status: 'Delayed' },
                            { name: 'Jane Doe', status: 'Planned' }
                        ]
                    }
                ]
            },
            {
                name: 'plumbing',
                trainings: [
                    {
                        name: 'plumbing 101',
                        cost: 100,
                        duration: 10,
                        date: '2022-01-01',
                        operators: [
                            { name: 'John Doe', status: 'Done' },
                            { name: 'Jane Doe', status: 'Planned' }
                        ]
                    },
                    {
                        name: 'plumbing 102',
                        cost: 200,
                        duration: 20,
                        date: '2022-02-01',
                        operators: [
                            { name: 'John Doe', status: 'Delayed' },
                            { name: 'Jane Doe', status: 'Planned' }
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
            :years-stat="data"
            :current-page="currentPage"
            class="mt-3"
        />

        <HomeRecapTrainingList
            :years-stat="data"
            :current-page="currentPage"
            class="mt-10"
        />
    </section>
</template>
