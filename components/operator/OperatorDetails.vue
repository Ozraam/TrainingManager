<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { StudyPlan } from '../../utils/types'
const props = defineProps({
    currentOperator: {
        type: String,
        required: true,
    },
})

const sp = useSupabaseClient()

const toast = useToast()

const studyPlanOp = ref<StudyPlan[]>([])

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
} | null> = ref(null)

async function fetchOperator() {
    const { data } = await sp.from('Operators').select('*, Position(*, Position_comp(Competences(*))), Registration(*, State(*), Training(name, duration))').eq('id_op', props.currentOperator)
    operator.value = data?.[0] ?? null

    const studyPlan = (await $fetch('/api/StudyPlanHelper', {
        method: 'POST',
        headers: useRequestHeaders(['cookie'])
    }) as { data: StudyPlan[] }).data

    studyPlanOp.value = studyPlan.filter(studyPlan => operator.value?.id_op === studyPlan.id_op) ?? []

    accordeon.value = stateData?.map((state) => {
        const o = {
            label: state.name,
            items: operator.value?.Registration.filter(reg => reg.State.id_state === state.id_state) ?? [],
            defaultOpen: false
        }

        o.defaultOpen = o.items.length > 0 && state.name !== 'expired'

        return o
    }) ?? []
}

onMounted(fetchOperator)

const { data: stateData } = await sp.from('State').select('name, id_state')

const accordeon : Ref<any> = ref([])

function downloadPDF() {
    // TODO : This is a placeholder for the real save
    // toast.add({
    //     title: 'PDF downloaded - TODO',
    //     timeout: 2000,
    //     icon: 'i-heroicons-face-frown-16-solid'
    // })
    navigateTo('/operator/pdf/?id_op=' + operator.value?.id_op)
}

function deleteOperator() {
    // TODO modify the delete function to annonymize the operator instead of deleting it
    // maybe not the right way for deleting an Operators but we are intern
    sp.from('Operators').update({ deleted: true, name: 'deleted', surname: 'deleted' } as never).eq('id_op', props.currentOperator).then(() => {
        toast.add({
            title: 'Operator deleted',
            timeout: 2000,
            icon: 'i-heroicons-trash-20-solid'
        })
        navigateTo('/operator')
    })
}

const confirmationId = ref<string | null>(null)

function askConfirmation() {
    const actions = [
        {
            label: 'Delete operator',
            click: () => deleteOperator()
        }, {
            label: 'Cancel',
            click: () => toast.remove(confirmationId.value!)
        }
    ]
    confirmationId.value = toast.add({
        title: 'Are you sure?',
        description: 'This action cannot be undone',
        actions,
        color: 'red',
    }).id
}
const isEditing = ref(false)
function toggleEdit() {
    isEditing.value = !isEditing.value
}
</script>

<template>
    <section class="m-3 w-full">
        <div
            v-if="operator"
            class="flex justify-between"
        >
            <OperatorEdit
                :operator="operator"
                :is-editing="isEditing"
                @close="toggleEdit"
                @update="fetchOperator"
            />

            <div>
                <div class="flex">
                    <h1 class="text-2xl font-bold">
                        {{ operator.name }} {{ operator.surname }}
                    </h1>

                    <UButton
                        label="Delete"
                        size="2xs"
                        variant="ghost"
                        color="red"
                        icon="i-heroicons-trash-20-solid"
                        @click="askConfirmation"
                    />

                    <UButton
                        label="Edit"
                        size="2xs"
                        variant="ghost"
                        icon="i-heroicons-pencil-20-solid"
                        @click="toggleEdit"
                    />
                </div>

                <h2 class="mb-4">
                    {{ operator.Position.name }}
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
                                                @update="fetchOperator"
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

                <div
                    v-for="op in studyPlanOp"
                    :key="op.id_op"
                    class="md-5 mt-3 pl-3"
                >
                    <StudyPlanSection :study="op" />
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
