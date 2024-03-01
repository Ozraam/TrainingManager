<script setup lang="ts">
defineProps<{
    yearsStat: {
        year: number
        budget: number
        expenses: number
        trainingPlanned: number
        trainingDone: number
    }[],
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

        <UCard
            v-for="competence in competences[currentPage]?.competences"
            :key="competence.name"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <h3>
                        {{ competence.name }}
                    </h3>

                    <UButton
                        label="See Competence"
                        variant="link"
                        :to="`/competence/${competence.id}`"
                    />
                </div>
            </template>

            <h3>
                {{ $t('home.recapTrainingList.training') }}
            </h3>

            <div class="flex flex-col gap-2">
                <UCard
                    v-for="training in competence.Training"
                    :key="training.name"
                >
                    <template #header>
                        <div class="flex justify-between items-center">
                            <h3>
                                {{ training.name }}
                            </h3>

                            <UButton
                                label="See Training"
                                :to="`/training/${training.id}`"
                                variant="link"
                            />
                        </div>
                    </template>

                    <div class="flex flex-col gap-2">
                        <div
                            v-for="operator in training.Operators"
                            :key="operator.name"
                            class="flex items-center gap-3 justify-between"
                        >
                            <p>{{ operator.name }} : {{ operator.status }}</p>

                            <div class="flex gap-2">
                                <UButton
                                    v-if="operator.status !== 'Done'"
                                    label="Mark as done"
                                    icon="i-heroicons-check"
                                />

                                <UButton
                                    label="View profile"
                                    icon="i-heroicons-user-circle"
                                    :to="`/operator/${operator.id}`"
                                />
                            </div>
                        </div>
                    </div>
                </UCard>
            </div>
        </UCard>
    </section>
</template>
