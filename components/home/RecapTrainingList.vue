<script setup lang="ts">
const competences = [
    {
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
                        name: 'John Doe',
                        status: 'Done',
                    },
                    {
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
                        name: 'John Doe',
                        status: 'Planified',
                    },
                    {
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
                        name: 'John Doe',
                        status: 'Planified',
                    },
                    {
                        name: 'John Doe',
                        status: 'Planified',
                    },
                ],
            },
        ],
    }
]
</script>

<template>
    <h2>
        Training list
    </h2>

    <UCard
        v-for="competence in competences"
        :key="competence.name"
    >
        <template #header>
            <div class="flex justify-between items-center">
                <h3>
                    {{ competence.name }}
                </h3>
            </div>
        </template>

        <h3>
            Trainings
        </h3>

        <UCard
            v-for="training in competence.Training"
            :key="training.name"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <h3>
                        {{ training.name }}
                    </h3>
                </div>
            </template>

            <div
                v-for="operator in training.Operators"
                :key="operator.name"
            >
                {{ operator.name }} : {{ operator.status }}
            </div>
        </UCard>
    </UCard>
</template>
