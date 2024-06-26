<!-- eslint-disable no-console -->
<script setup lang="ts">
const props = defineProps({
    currentTraining: {
        type: String,
        required: true,
    },
})

const sp = useSupabaseClient()

const training = ref<{
    id_train: number,
    name: string,
    cost: number,
    date: string,
    duration: number,
    topic: string,
    Registration: {
        Operators: {
            name: string,
            surname: string,
            id_op: number,
        }[],
        State: {
            name: string,
        },
        date: string,
        filename: string,
    }[],
    Type_training: {
        name: string,
    },
    Type_confirmation: {
        name: string,
    },
    Teacher: {
        name: string,
        surname: string,
        id_teacher: number,
        deleted: boolean,
    },
    Competences: {
        id_comp: number,
        name: string,
    },
    Organisation: {
        id_orga: number,
        name: string,
        deleted: boolean,
    },
} | null>(null)

async function fetchTraining() {
    const { data } = await sp.from('Training').select('*, Registration(*, State(*), Operators(*)), Competences(*), Type_confirmation(*), Type_training(*), Teacher(*), Organisation(*)').eq('id_train', props.currentTraining)

    training.value = data?.[0] ?? null

    console.log(training.value)
    if (training.value) {
        isRegistrationEditing.value = Array(training.value.Registration.length).fill(false)
    }
}

onMounted(fetchTraining)

const loadingDownload = ref(false)

function downloadCertificate(reg: Registration, i: number) {
    if (loadingDownload.value) { return }
    loadingDownload.value = true
    const filepath = `registration/${reg.id_train}/${reg.id_op}/${reg.date}/${reg.filename}`

    sp.storage.from('Registration_certificate').download(filepath).then(({ data, error }) => {
        if (error) {
            toast.add({
                title: 'Error',
                description: 'An error occurred while downloading the certificate.\nPlease check if the file exists.',
                color: 'red',
            })
            toggleRegistrationEdit(i)
        } else {
            const url = URL.createObjectURL(data)
            const a = document.createElement('a')
            a.href = url
            a.download = reg.filename
            a.click()
            URL.revokeObjectURL(url)
        }
        loadingDownload.value = false
    })
}

const toast = useToast()

function deleteTraining() {
    // TODO: Not sure if this will stay
    sp.from('Registration').delete().eq('id_train', props.currentTraining).then(({ error }) => {
        if (error) {
            toast.add({
                title: 'Error',
                description: 'An error occurred while deleting the operator',
                color: 'red',
            })
        } else {
            sp.from('Training').delete().eq('id_train', props.currentTraining).then(({ error }) => {
                if (error) {
                    toast.add({
                        title: 'Error',
                        description: 'An error occurred while deleting the operator',
                        color: 'red',
                    })
                } else {
                    toast.add({
                        title: 'Success',
                        description: 'The training has been deleted',
                    })
                    navigateTo('/training')
                }
            })
        }
    })
}

const confirmationId = ref<string | null>(null)

function askConfirmation() {
    const actions = [
        {
            label: 'Delete training',
            click: () => deleteTraining()
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

const isRegistrationEditing: Ref<boolean[]> = ref([])
function toggleRegistrationEdit(index: number) {
    isRegistrationEditing.value[index] = !isRegistrationEditing.value[index]
}
</script>

<template>
    <div
        v-if="training"
        class="m-3"
    >
        <TrainingEdit
            :training="training"
            :is-editing="isEditing"
            @close="toggleEdit"
            @update="fetchTraining"
        />

        <div class="flex">
            <h2 class="text-2xl underline">
                {{ firstLetterToUpperCase(training?.name) }}
            </h2>

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
                color="indigo"
                @click="toggleEdit"
            />
        </div>

        <div class="flex justify-between gap-20">
            <div>
                <p>
                    <span class="font-bold">Competence:</span> {{ training?.Competences.name }}
                </p>

                <p v-if="training?.Teacher">
                    <span class="font-bold">Teacher:</span>

                    <UButton
                        v-if="training?.Teacher"
                        variant="link"
                        color="leather"
                        :to="'/teacher?search=' + training?.Teacher.name + ' ' + training?.Teacher.surname"
                    >
                        {{ training?.Teacher.name }} {{ training?.Teacher.surname }}
                    </UButton>
                </p>

                <p v-if="training?.Organisation">
                    <span class="font-bold">Organisation:</span>

                    <UButton
                        variant="link"
                        :to="'/teacher?search=' + training?.Organisation.name"
                        color="leather"
                    >
                        {{ training?.Organisation.name }}
                    </UButton>
                </p>

                <p>
                    <span class="font-bold">Duration:</span> {{ training?.duration }} hours
                </p>

                <p>
                    <span class="font-bold">Cost:</span> {{ training?.cost }} €
                </p>

                <p>
                    <span class="font-bold">Type:</span> {{ training?.Type_training.name }}
                </p>

                <p>
                    <span class="font-bold">Confirmation:</span> {{ training?.Type_confirmation.name }}
                </p>

                <p>
                    <span class="font-bold">Topic:</span> {{ training?.topic }}
                </p>
            </div>

            <div>
                <div class="flex gap-4">
                    <h3 class="text-xl">
                        Registrations
                    </h3>

                    <UButton
                        label="Add new registration"
                        color="leather"
                        variant="link"
                        :to="`/training/add/registration?training=${training?.id_train}`"
                    />
                </div>

                <UTable
                    :rows="training?.Registration.map((r) => {
                        return {
                            Operators: r.Operators,
                            State: r.State.name,
                            Date: new Date(r.date).toLocaleDateString(),
                            action: r
                        }
                    })"
                >
                    <template #Operators-data="{ row }">
                        <UButton
                            variant="link"
                            :to="`/operator/${row.Operators.id_op}`"
                            class="p-0"
                            color="leather"
                        >
                            {{ row.Operators.name }} {{ row.Operators.surname }}
                        </UButton>
                    </template>

                    <template #action-data="{ row, index }">
                        <RegistrationChangeState
                            :registration="row.action"
                            :is-editing="isRegistrationEditing[index]"
                            @close="() => toggleRegistrationEdit(index)"
                            @update="fetchTraining"
                        />

                        <UButton
                            v-if="(row.State !== 'done' && row.State !== 'expired') || !row.action.filename"
                            :label="(row.State !== 'done' && row.State !== 'expired') ? 'Change state' : 'Add a file'"
                            size="xs"
                            class="ml-2"
                            color="leather"
                            @click="() => toggleRegistrationEdit(index)"
                        />

                        <UButton
                            v-else-if="row.action.filename"
                            label="Certificate"
                            size="xs"
                            class="ml-2"
                            :loading="loadingDownload"
                            color="leather"
                            @click="() => downloadCertificate(row.action, index)"
                        />
                    </template>
                </UTable>
            </div>
        </div>
    </div>

    <div v-else>
        <p>Loading...</p>
    </div>
</template>
