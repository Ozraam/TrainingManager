<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const props = defineProps({
    competence: {
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
    tmp_validity: number | undefined,
}

const state = reactive({
    name: props.competence.name,
    tmp_validity: props.competence.tmp_validity,
})

function validate(state: State): FormError[] {
    const errors: FormError[] = []

    if (state.name ? state.name.trim() === '' : true) {
        errors.push({
            path: 'name',
            message: 'Name is required',
        })
    }

    if (state.tmp_validity ? state.tmp_validity < 1 : true) {
        errors.push({
            path: 'tmp_validity',
            message: 'Validity must be greater than 0',
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
            tmp_validity: event.data.tmp_validity!,
        }
    ]

    const { error } = await sp.from('Competences').update(insert as never).eq('id_comp', props.competence.id_comp)

    if (error) {
        toast.add({
            title: 'Error',
            description: error.message,
            color: 'red',
        })
    } else {
        toast.add({
            title: 'Success',
            description: 'Competence updated',
            color: 'green',
        })
        isOpen.value = false
        loading.value = false
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
                    label="Validity in days"
                    name="tmp_validity"
                >
                    <UInput
                        v-model="state.tmp_validity"
                        type="number"
                    />
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
