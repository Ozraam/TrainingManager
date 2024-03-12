<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const sp = useSupabaseClient()

const state = reactive({
    name: undefined,
    surname: undefined
})

type State = {
    name: string | undefined,
    surname: string | undefined
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

    return errors
}

const toast = useToast()

const loading = ref(false)

function onSubmit(event: FormSubmitEvent<State>) {
    const insert = [
        {
            name: event.data.name!,
            surname: event.data.surname!,
        }
    ]

    sp.from('Teacher').insert(insert as never).then(({ error }) => {
        if (error) {
            loading.value = false
            toast.add({
                title: 'Error',
                description: 'An error occurred',
                icon: 'i-heroicons-face-frown-solid',
                color: 'red',
            })
        } else {
            toast.add({
                title: 'Teacher added',
                description: 'The teacher has been added',
                icon: 'i-icon-park-solid-success',
            })
            navigateTo('/teacher')
        }
    })
}
</script>

<template>
    <section>
        <PageHeader
            title="Teachers"
            title-link="/teacher"
            :other-links="[{
                label: 'Add new teacher',
                to: '/teacher/add'
            }]"
        />

        <div>
            <h2 class="text-xl text-center mb-5">
                Add new teacher
            </h2>

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
                    label="Add"
                />
            </UForm>
        </div>
    </section>
</template>
