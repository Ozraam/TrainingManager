<script setup lang="ts">
const props = defineProps({
    currentOperator: {
        type: String,
        required: true,
    },
})

const sp = useSupabaseClient()

const toast = useToast()

const { data } = await sp.from('Operators').select('*, Position(*, Position_comp(Competences(*))), Registration(*, State(*), Training(name, duration))').eq('id_op', props.currentOperator)

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
            name: string,
            duration: number
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
    sp.from('Operators').update({ id_pos: selectedPosition.value?.id } as never).eq('id_op', operator.value?.id_op as never).then(({ error }) => {
        if (error) {
            toast.add({
                title: 'Error',
                description: 'An error occurred while saving the position',
                color: 'red',
            })
        } else {
            toast.add({
                title: 'Success',
                description: 'The position has been saved',
            })
            reloadNuxtApp()
        }
    })
}

const { data: stateData } = await sp.from('State').select('name, id_state')

const accordeon = ref(stateData?.map((state) => {
    const o = {
        label: state.name,
        items: operator.value?.Registration.filter(reg => reg.State.id_state === state.id_state) ?? [],
        defaultOpen: false
    }

    o.defaultOpen = o.items.length > 0 && state.name !== 'expired'

    return o
}))

function downloadPDF() {
    // TODO : This is a placeholder for the real save
    toast.add({
        title: 'PDF downloaded - TODO',
        timeout: 2000,
        icon: 'i-heroicons-face-frown-16-solid'
    })
}
</script>

<template>
    <section class="m-3 w-full">
        <div
            v-if="operator"
            class="flex justify-between"
        >
            <div>
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
                        <UAccordion
                            :items="accordeon"
                            multiple
                        >
                            <template #default="{ item, open }">
                                <UButton
                                    color="gray"
                                    variant="ghost"
                                    class="my-1 border-b-2 border-gray-200 dark:border-gray-800"
                                    :ui="{ rounded: 'rounded-none' }"
                                >
                                    <template #leading>
                                        <UIcon
                                            name="i-heroicons-chevron-right-20-solid"
                                            class="w-5 h-5 transform transition-transform duration-200"
                                            :class="[open && 'rotate-90']"
                                        />
                                    </template>

                                    <span class="truncate">{{ item.label }}</span>

                                    <template #trailing>
                                        <span class="ms-auto">{{ item.items.length }}</span>
                                    </template>
                                </UButton>
                            </template>

                            <template #item="{ item }">
                                <div>
                                    <ul v-if="item.items.length > 0">
                                        <li
                                            v-for="training in item.items"
                                            :key="training.id_reg"
                                        >
                                            <OperatorTraining
                                                :training="training"
                                            />
                                        </li>
                                    </ul>

                                    <div v-else>
                                        <p>
                                            No trainings found
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </UAccordion>
                    </div>
                </div>
            </div>

            <div>
                <div class="flex gap-3 items-center">
                    <h2 class="">
                        Study plan
                    </h2>

                    <UButton
                        label="Download as PDF"
                        size="xs"
                        variant="ghost"
                        @click="downloadPDF"
                    />
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
