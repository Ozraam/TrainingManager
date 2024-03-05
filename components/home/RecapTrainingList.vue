<script setup lang="ts">
defineProps<{
    yearsStat: YearData[],
    currentPage: number
}>()

const competences = [
    {
        year: 2021,
        competences: [
            {
                id: 1,
                name: 'Welder',
                Training: [
                    {
                        name: 'Welding 101',
                        date: '2021-01-01',
                        duration: 2,
                        cost: 100,
                        location: 'Paris',
                        trainer: 'John Doe',
                        Operators: [
                            {
                                id: 1,
                                name: 'John Doe',
                                status: 'Done',
                            },
                            {
                                id: 2,
                                name: 'John Doe',
                                status: 'Done',
                            },
                        ],
                    },
                    {
                        name: 'Welding 102',
                        date: '2021-01-01',
                        duration: 2,
                        cost: 100,
                        location: 'Paris',
                        trainer: 'John Doe',
                        Operators: [
                            {
                                id: 1,
                                name: 'John Doe',
                                status: 'Planified',
                            },
                            {
                                id: 2,
                                name: 'John Doe',
                                status: 'Delayed',
                            },
                        ],
                    },
                    {
                        name: 'Welding 103',
                        date: '2021-01-01',
                        duration: 2,
                        cost: 100,
                        location: 'Paris',
                        trainer: 'John Doe',
                        Operators: [
                            {
                                id: 1,
                                name: 'John Doe',
                                status: 'Planified',
                            },
                            {
                                id: 2,
                                name: 'John Doe',
                                status: 'Planified',
                            },
                        ],
                    },
                ],
            }
        ]
    },
    {
        year: 2022,
        competences: [
            {
                id: 1,
                name: 'Welder',
                Training: [
                    {
                        name: 'Welding 101',
                        date: '2021-01-01',
                        duration: 2,
                        cost: 100,
                        location: 'Paris',
                        trainer: 'John Doe',
                        Operators: [
                            {
                                id: 1,
                                name: 'John Doe',
                                status: 'Done',
                            },
                            {
                                id: 2,
                                name: 'John Doe',
                                status: 'Done',
                            },
                        ],
                    },
                    {
                        name: 'Welding 102',
                        date: '2021-01-01',
                        duration: 2,
                        cost: 100,
                        location: 'Paris',
                        trainer: 'John Doe',
                        Operators: [
                            {
                                id: 1,
                                name: 'John Doe',
                                status: 'Planified',
                            },
                            {
                                id: 2,
                                name: 'John Doe',
                                status: 'Delayed',
                            },
                        ],
                    },
                    {
                        name: 'Welding 103',
                        date: '2021-01-01',
                        duration: 2,
                        cost: 100,
                        location: 'Paris',
                        trainer: 'John Doe',
                        Operators: [
                            {
                                id: 1,
                                name: 'John Doe',
                                status: 'Delayed',
                            },
                            {
                                id: 2,
                                name: 'John Doe',
                                status: 'Done',
                            },
                        ],
                    },
                ],
            }
        ]
    }
]
</script>

<template>
    <section>
        <h2 class="text-center">
            {{ $t('home.recapTrainingList.title') }}
        </h2>

        <HomeSumupCompetence
            v-for="competence in competences[currentPage].competences"
            :key="competence.name"
            :competence="competence"
        />
    </section>
</template>
