<script setup lang="ts">
const props = defineProps({
    currentOperator: {
        type: String,
        required: true,
    },
})

const sp = useSupabaseClient()

const { data } = await sp.from('Operators').select('*, Position(*, Position_comp(Competences(*))), Registration(*, State(*), Training(name))').eq('id_op', props.currentOperator)

const operator : Ref<{
    id_op: number,
    name: string,
    surname: string,
    Position: {
        id_pos: number,
        name: string,
        Position_comp: {
            Competences: {
                id_comp: number,
                name: string,
                tmp_validity: number
            }
        }[]
    },
    Registration: {
        date: any;
        id_reg: number,
        State: {
            id_state: number,
            name: string
        },
        Training: {
            name: string
        }
    }[]
} | null> = ref(data![0] ?? null)

const { data: dataPositions } = await sp.from('Position').select('*')

const positions : Ref<{ id_pos: number, name: string }[] | null> = ref(dataPositions)

const positionsSelect = positions.value?.map((position) => {
    return {
        label: position.name,
        id: position.id_pos
    }
})

const initialPosition = positionsSelect?.find((position) => {
    return position.id === operator.value?.Position.id_pos
})

const selectedPosition = ref(initialPosition)

const isPositionChanged = computed(() => {
    return selectedPosition.value?.id !== initialPosition?.id
})

function savePosition() {
    // TODO : This is a placeholder for the real save
}

const trainingDone = computed(() => {
    return operator.value?.Registration.filter((registration) => {
        return registration.State.name === 'done'
    })
})

const trainingInProgress = computed(() => {
    return operator.value?.Registration.filter((registration) => {
        return registration.State.name === 'in progress'
    })
})

const trainingPlanned = computed(() => {
    return operator.value?.Registration.filter((registration) => {
        return registration.State.name === 'planned'
    })
})

const trainingDelayed = computed(() => {
    return operator.value?.Registration.filter((registration) => {
        return registration.State.name === 'delayed'
    })
})
</script>

<template>
    <section class="m-3">
        <div v-if="operator">
            <h1 class="text-2xl font-bold">
                {{ operator.name }} {{ operator.surname }}
            </h1>

            <h2 class="flex gap-2">
                <USelectMenu
                    v-model="selectedPosition"
                    :options="positionsSelect"
                />

                <UButton
                    v-if="isPositionChanged"
                    label="Save"
                    @click="savePosition"
                />
            </h2>

            <div>
                <h3>
                    Competences
                </h3>

                <ul>
                    <li
                        v-for="competence in operator.Position.Position_comp"
                        :key="competence.Competences.id_comp"
                    >
                        <OperatorCompetence
                            :competence="competence.Competences"
                        />
                    </li>
                </ul>

                <h3>
                    Trainings
                </h3>

                <div>
                    <h4 class="text-green-500">
                        Done
                    </h4>

                    <ul class="ml-5">
                        <li
                            v-for="training in trainingDone"
                            :key="training.id_reg"
                        >
                            {{ training.Training.name }}
                        </li>
                    </ul>

                    <h4 class="text-blue-500">
                        In progress
                    </h4>

                    <ul class="ml-5">
                        <li
                            v-for="training in trainingInProgress"
                            :key="training.id_reg"
                        >
                            {{ training.Training.name }} {{ training.date }}
                        </li>
                    </ul>

                    <h4 class="text-green-500">
                        Planned
                    </h4>

                    <ul class="ml-5">
                        <li
                            v-for="training in trainingPlanned"
                            :key="training.id_reg"
                        >
                            {{ training.Training.name }}
                        </li>
                    </ul>

                    <h4 class="text-red-500">
                        Delayed
                    </h4>

                    <ul class="ml-5">
                        <li
                            v-for="training in trainingDelayed"
                            :key="training.id_reg"
                        >
                            {{ training.Training.name }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div v-else>
            <h1 class="text-2xl font-bold">
                Operator not found
            </h1>
        </div>
    </section>
</template>
