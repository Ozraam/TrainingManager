<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const props = defineProps({
    registration: {
        type: Object,
        required: true,
    },
    isEditing: {
        type: Boolean,
        default: false,
    },
})
const isOpen = computed({
    get: () => props.isEditing,
    set: (value) => {
        if (!value) {
            state.file = ''
            emit('update')
            emit('close')
            loading.value = false
        }
    },
})

const emit = defineEmits(['update', 'close'])

const sp = useSupabaseClient()

type State = {
    id_train: number | undefined,
    id_op: number | undefined,
    date: string | undefined,
    state: number | undefined,
    file: string,
}

const state = reactive<State>({
    id_train: props.registration.id_train,
    id_op: props.registration.id_op,
    date: new Date(props.registration.date).toLocaleDateString(),
    state: props.registration.id_state,
    file: '',
})

// check if date is valid
// date format: dd/mm/yyyy or dd-mm-yyyy
// example: 01/01/2024 or 01-01-2024
// return true if date is valid
function isDateValid(date: string | undefined) {
    return date !== undefined && /^(3[01]|[12][0-9]|0?[1-9])(\/|-)(1[0-2]|0?[1-9])\2[0-9]{4}$/g.test(date)
}

function validate(state: State): FormError[] {
    const errors: FormError[] = []

    if (state.date ? state.date.trim() === '' : true) {
        errors.push({
            path: 'date',
            message: 'Date is required',
        })
    }

    if (!isDateValid(state.date)) {
        errors.push({
            path: 'date',
            message: 'Date format is invalid',
        })
    }

    if (state.state === undefined) {
        errors.push({
            path: 'state',
            message: 'State is required',
        })
    }

    if (state.id_op === undefined) {
        errors.push({
            path: 'id_op',
            message: 'Operator is required',
        })
    }

    if (state.id_train === undefined) {
        errors.push({
            path: 'id_train',
            message: 'Training is required',
        })
    }

    if ((state.state === 5 || state.state === 4) && (state.file === '' && props.registration.filename === '')) {
        errors.push({
            path: 'filename',
            message: 'File is required',
        })
    }

    return errors
}

const toast = useToast()

const loading = ref(false)

const inputFile = ref(null)

async function onSubmit(event: FormSubmitEvent<State>) {
    if (loading.value) { return }
    loading.value = true
    const filen = inputFile.value.input.files[0]

    const insert = [
        {
            date: event.data.date!.split('/').reverse().join('-'),
            id_state: event.data.state!,
            filename: filen?.name ?? props.registration.filename,
        }
    ] as never[]

    const date = event.data.date!.split('/').reverse().join('-')

    if (filen) {
        sp.storage.from('Registration_certificate').upload(`registration/${state.id_train}/${state.id_op}/${date}/${filen.name}`, filen, { upsert: true })
    }

    const { error } = await sp.from('Registration').update(insert as never).eq('id_train', props.registration.id_train).eq('id_op', props.registration.id_op).eq('date', props.registration.date).select('id_train')

    if (error) {
        loading.value = false
        toast.add({
            title: 'Error',
            description: 'An error occurred while updating the registration',
            color: 'red',
        })
    } else {
        toast.add({
            title: 'Success',
            description: 'The registration has been updated',
        })
        isOpen.value = false
    }
}

const { data: training } = await sp.from('Training').select('id_train, name')
const { data: operators } = await sp.from('Operators').select('id_op, name, surname').eq('deleted', 0)
const { data: states } = await sp.from('State').select('name, id_state')
</script>

<template>
    <UModal v-model="isOpen">
        <UCard>
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Edit operator
                    </h3>

                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark-20-solid"
                        class="-my-1"
                        @click="isOpen = false"
                    />
                </div>
            </template>

            <UForm
                class="space-y-4 flex flex-col items-center"
                :state="state"
                :validate="validate"
                @submit="onSubmit"
            >
                <UFormGroup
                    label="Training"
                    name="id_train"
                    class="min-w-44"
                    required
                >
                    <USelectMenu
                        v-model="state.id_train"
                        disabled
                        :options="training"
                        value-attribute="id_train"
                        option-attribute="name"
                        placeholder="Select training"
                        searchable
                    />
                </UFormGroup>

                <UFormGroup
                    label="Operator"
                    name="id_op"
                    class="min-w-44"
                    required
                >
                    <USelectMenu
                        v-model="state.id_op"
                        disabled
                        :options="operators?.map((o) => {
                            return {
                                id_op: o.id_op,
                                name: o.name + ' ' + o.surname,
                            }
                        })"
                        value-attribute="id_op"
                        option-attribute="name"
                        placeholder="Select operator"
                        searchable
                    />
                </UFormGroup>

                <UFormGroup
                    label="Date"
                    name="date"
                    required
                    hint="Days/Month/Year"
                >
                    <UInput
                        v-model="state.date"
                        placeholder="01/01/2024"
                    />
                </UFormGroup>

                <UFormGroup
                    label="State"
                    name="state"
                    required
                    class="min-w-44"
                >
                    <USelectMenu
                        v-model="state.state"
                        :options="states"
                        value-attribute="id_state"
                        option-attribute="name"
                        placeholder="Select state"
                    />
                </UFormGroup>

                <UFormGroup
                    label="Certificate file"
                    name="filename"
                    :hint="state.state === 5 || state.state === 4 ? 'File is required' : 'Optional'"
                    :description="registration.filename ? `Current file: ${registration.filename}` : 'No file uploaded'"
                    required
                >
                    <UInput
                        ref="inputFile"
                        v-model="state.file"
                        type="file"
                    />
                </UFormGroup>

                <UButton
                    :loading="loading"
                    type="submit"
                    label="Add"
                    color="leather"
                />
            </UForm>
        </UCard>
    </UModal>
</template>
