<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const props = defineProps({
    teacher: {
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

const emit = defineEmits(['update', 'close'])

const sp = useSupabaseClient()

type State = {
    name: string | undefined,
    surname: string | undefined,
}

const state = reactive({
    name: props.teacher.name,
    surname: props.teacher.surname,
})

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
        }
    ]

    const { error } = await sp.from('Teacher').update(insert as never).eq('id_teacher', props.teacher.id_teacher).select()

    if (error) {
        toast.add({
            title: 'Error',
            description: 'An error occurred while updating the teacher',
            color: 'red',
        })
    } else {
        toast.add({
            title: 'Success',
            description: 'The teacher has been updated',
        })
    }

    loading.value = false
    isOpen.value = false
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

                <UButton
                    :loading="loading"
                    type="submit"
                    label="Update"
                    color="leather"
                />
            </UForm>
        </UCard>
    </UModal>
</template>
