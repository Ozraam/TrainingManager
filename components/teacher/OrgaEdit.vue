<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
const regexMail = /^[\p{L}\w-.]+@([\p{L}\w-]+.)+[\p{L}\w-]{2,4}$/i

const props = defineProps({
    orga: {
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
    phone: string | undefined,
    email: string | undefined,
}

const state = reactive({
    name: props.orga.name,
    phone: props.orga.phone_number ?? undefined,
    email: props.orga.email ?? undefined,
})

function validate(state: State): FormError[] {
    const errors: FormError[] = []

    if (state.name ? state.name.trim() === '' : true) {
        errors.push({
            path: 'name',
            message: 'Name is required',
        })
    }

    if ((state.phone === undefined || state.phone?.trim() === '') && (state.email === undefined || state.email?.trim() === '')) {
        errors.push({
            path: 'phone',
            message: 'Phone or email is required',
        }, {
            path: 'email',
            message: 'Phone or email is required',
        })
    }

    if (state.phone !== undefined && isNaN(Number(state.phone.toString().replaceAll(' ', '')))) {
        errors.push({
            path: 'phone',
            message: 'Phone must be a number',
        })
    }

    if (state.email !== undefined && regexMail.test(state.email) === false) {
        errors.push({
            path: 'email',
            message: 'Email must be valid',
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
            phone_number: event.data.phone,
            email: event.data.email,
        }
    ]

    const { error } = await sp.from('Organisation').update(insert as never).eq('id_orga', props.orga.id_orga).select()

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
                        Edit Organisation
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
                    label="Phone"
                    name="phone"
                >
                    <UInput v-model="state.phone" />
                </UFormGroup>

                <UFormGroup
                    label="Email"
                    name="email"
                >
                    <UInput v-model="state.email" />
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
