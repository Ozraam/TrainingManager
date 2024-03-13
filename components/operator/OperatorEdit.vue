<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const props = defineProps({
    operator: {
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
            emit('update')
            emit('close')
        }
    },
})
const emit = defineEmits(['close', 'update'])

const sp = useSupabaseClient()

const { data: positions } = await sp.from('Position').select('id_pos, name')

const state = reactive({
    name: props.operator.name,
    surname: props.operator.surname,
    idPos: props.operator.id_pos,
})

type State = {
    name: string | undefined,
    surname: string | undefined,
    idPos: number | undefined
}

function validate(state: State): FormError[] {
    const errors: FormError[] = []

    if (state.name ? state.name.trim() === '' : true) {
        errors.push({
            path: 'name',
            message: 'Name is required',
        })
    }

    if (state.surname ? state.surname.trim() === '' : true) {
        errors.push({
            path: 'surname',
            message: 'Surname is required',
        })
    }

    if (state.idPos === undefined) {
        errors.push({
            path: 'idPos',
            message: 'Position is required',
        })
    }

    return errors
}

const toast = useToast()

const loading = ref(false)

async function onSubmit(event: FormSubmitEvent<State>) {
    if (loading.value) { return }
    loading.value = true
    const insert = [
        {
            name: event.data.name!,
            surname: event.data.surname!,
            id_pos: event.data.idPos!,
        }
    ]

    const { error } = await sp.from('Operators').update(insert as never).eq('id_op', props.operator.id_op).select('id_op')

    if (error) {
        loading.value = false
        // eslint-disable-next-line no-console
        console.error(error)
        toast.add({
            title: 'Error',
            description: 'An error occurred',
            icon: 'i-heroicons-face-frown-solid',
            color: 'red',
        })
    } else {
        loading.value = false
        toast.add({
            title: 'Operator updated',
            description: 'The operator has been updated',
            icon: 'i-icon-park-solid-success',
        })
        isOpen.value = false
    }
}
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
                    label="Name"
                    name="name"
                    required
                >
                    <UInput v-model="state.name" />
                </UFormGroup>

                <UFormGroup
                    required
                    label="Surname"
                    name="surname"
                >
                    <UInput v-model="state.surname" />
                </UFormGroup>

                <UFormGroup
                    label="Position"
                    name="idPos"
                    class="min-w-40"
                    required
                >
                    <USelectMenu
                        v-model="state.idPos"
                        :options="positions"
                        placeholder="Select a position"
                        option-attribute="name"
                        value-attribute="id_pos"
                        searchable
                    />
                </UFormGroup>

                <UButton
                    :loading="loading"
                    type="submit"
                    label="Update"
                />
            </UForm>
        </UCard>
    </UModal>
</template>
