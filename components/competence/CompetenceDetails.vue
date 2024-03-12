<script setup lang="ts">
const props = defineProps({
    currentCompetence: {
        type: String,
        required: true,
    },
})

const sp = useSupabaseClient()

const { data } = await sp.from('Competences').select('*, Position_comp(*)').eq('id_comp', props.currentCompetence)

const competecence : Ref<{
    id_comp: number,
    name: string,
    tmp_validity: number,
    Position_comp: {
        id_comp: number,
        id_pos: number,
        mandatory: boolean
    }[]
} | null> = ref(data?.[0] ?? null)

const { data: data2 } = await sp.from('Position').select('*')

const positions : Ref<{ id_pos: number, name: string, check: boolean }[] | null> = ref(data2)

positions.value?.forEach((position) => {
    position.check = competecence.value?.Position_comp.some(comp => comp.id_pos === position.id_pos) ?? false
})

const initialPosition = ref(positions.value?.map((position) => {
    return {
        id_pos: position.id_pos,
        check: position.check
    }
}))

const isPositionChanged = computed(() => {
    return positions.value?.some((position, index) => {
        return position.check !== initialPosition.value![index].check
    })
})

const positionChangeLoading = ref(false)

async function savePosition() {
    if (positionChangeLoading.value) { return }
    positionChangeLoading.value = true

    const oldPositions = competecence.value?.Position_comp.filter(c => positions.value?.some(p => p.id_pos === c.id_pos && p.check) ?? false) ?? []

    await sp.from('Position_comp').delete().eq('id_comp', competecence.value?.id_comp as never).select('*')
    await sp.from('Position_comp').insert(oldPositions.map((p) => {
        return {
            id_comp: competecence.value?.id_comp,
            id_pos: p.id_pos,
            mandatory: p.mandatory
        }
    }) as never)

    const { error } = await sp.from('Position_comp').insert(positions.value?.filter(p => p.check && !oldPositions.some(op => op.id_pos === p.id_pos)).map((p) => {
        return {
            id_comp: competecence.value?.id_comp,
            id_pos: p.id_pos,
            mandatory: false
        }
    }) as never)

    if (!error) {
        useToast().add({
            title: 'success',
            description: 'Position saved',
        })

        initialPosition.value!.forEach((position, index) => {
            position.check = positions.value![index].check
        })

        positionChangeLoading.value = false
    } else {
        useToast().add({
            title: 'error',
            description: 'An error occurred while saving the position',
        })

        positionChangeLoading.value = false
    }
}

const { data: trainings, error } = await sp.from('Training').select('id_train, cost, date, name, duration, Registration(Operators(name, surname, id_op), State(name)), Teacher(name, surname, id_teacher)').eq('id_comp', props.currentCompetence)

if (error) {
    throw error // TODO : Handle error
}

const toast = useToast()

const items = ref(trainings.map((t) => {
    return {
        label: t.name,
        training: t
    }
}))

function deleteCompetence() {
    // delete competence, you need to delete Position_comp first, Training, registration of the training and then the competence

    const deleteTraining = async (idTraining: number) => {
        const { error } = await sp.from('Registration').delete().eq('id_train', idTraining).select('*')
        if (error) {
            toast.add({
                title: 'Error',
                description: 'An error occurred while deleting the training',
                color: 'red',
            })
        } else {
            const { error } = await sp.from('Training').delete().eq('id_train', idTraining).select('*')
            if (error) {
                toast.add({
                    title: 'Error',
                    description: 'An error occurred while deleting the training',
                    color: 'red',
                })
            }
        }
    }

    sp.from('Position_comp').delete().eq('id_comp', props.currentCompetence).then(async ({ error }) => {
        if (error) {
            toast.add({
                title: 'Error',
                description: 'An error occurred while deleting the competence',
                color: 'red',
            })
        } else {
            for (const training of trainings!) {
                await deleteTraining(training.id_train)
            }

            sp.from('Competences').delete().eq('id_comp', props.currentCompetence).then(({ error }) => {
                if (error) {
                    toast.add({
                        title: 'Error',
                        description: 'An error occurred while deleting the competence',
                        color: 'red',
                    })
                } else {
                    toast.add({
                        title: 'Success',
                        description: 'The competence has been deleted',
                    })
                    navigateTo('/competence')
                }
            })
        }
    })
}

const confirmationId = ref<string | null>(null)

function askConfirmation() {
    const actions = [
        {
            label: 'Delete competence',
            click: () => deleteCompetence()
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
</script>

<template>
    <div
        v-if="competecence"
        class="m-3 grow"
    >
        <div class="flex">
            <h2 class="text-2xl">
                {{ competecence!.name }}
            </h2>

            <UButton
                label="Delete"
                size="2xs"
                variant="ghost"
                color="red"
                icon="i-heroicons-trash-20-solid"
                @click="askConfirmation"
            />
        </div>

        <div class="flex gap-10">
            <h3 class="gap-1">
                {{ $t('competence.frequency') }}: <UInput
                    v-model="competecence.tmp_validity"
                    type="number"
                >
                    <template #trailing>
                        <span class="text-gray-500 dark:text-gray-400 text-xs">{{ $t('competence.days') }}</span>
                    </template>
                </UInput>
            </h3>

            <div>
                <h4>{{ $t('competence.position.title') }}</h4>

                <ul>
                    <li
                        v-for="position in positions"
                        :key="position.id_pos"
                    >
                        <UCheckbox
                            v-model="position.check"
                            :name="position.name"
                            :label="position.name"
                        />
                    </li>
                </ul>

                <UButton
                    v-if="isPositionChanged"
                    :label="$t('competence.position.save')"
                    :loading="positionChangeLoading"
                    @click="savePosition"
                />
            </div>
        </div>

        <div class="mt-3">
            <h4>{{ $t('competence.training.title') }}</h4>

            <UAccordion :items="items">
                <template #item="{ item }">
                    <div>
                        <h5 class="text-xl">
                            {{ $t('competence.training.info') }}
                        </h5>

                        <div class="flex gap-5 items-center">
                            <p>
                                <strong>{{ $t('competence.training.instructor') }}</strong>

                                : <UButton
                                    :to="`/teacher?search=${item.training.Teacher.name} ${item.training.Teacher.surname}`"
                                    variant="link"
                                >
                                    {{ item.training.Teacher.name }} {{ item.training.Teacher.surname }}
                                </UButton>
                            </p>

                            <p>
                                <strong>{{ $t('competence.training.date') }}</strong> : {{ item.training.date }}
                            </p>

                            <p>
                                <strong>{{ $t('competence.training.duration') }}</strong> : {{ item.training.duration }} {{ $t('competence.training.hours') }}
                            </p>

                            <p>
                                <strong>{{ $t('competence.training.cost') }}</strong> : {{ item.training.cost }} €
                            </p>
                        </div>
                    </div>

                    <div>
                        <h5 class="text-xl">
                            {{ $t('competence.training.operators') }}
                        </h5>

                        <ul v-if="item.training.Registration.length > 0">
                            <li
                                v-for="operator in item.training.Registration"
                                :key="operator.id_op"
                            >
                                {{ operator.Operators.name }} {{ operator.Operators.surname }} - {{ operator.State.name }}
                            </li>
                        </ul>

                        <p v-else>
                            {{ $t('competence.training.noOperators') }}
                        </p>
                    </div>

                    <UButton
                        :label="$t('competence.training.edit')"
                        :to="`/training/${item.training.id_training}`"
                        variant="link"
                    />
                </template>
            </UAccordion>
        </div>
    </div>

    <div v-else>
        Error
    </div>
</template>
