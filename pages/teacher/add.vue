<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const sp = useSupabaseClient()

const regexMail = /^[\p{Latin}\p{Marks}\p{Cyrillic}\p{IsBasicLatin}\w-.]+@([\p{Latin}\p{Marks}\p{Cyrillic}\p{IsBasicLatin}\w-]+.)+[\p{Latin}\p{Marks}\p{Cyrillic}\p{IsBasicLatin}\w-]{2,4}$/i

const state = reactive({
    name: undefined,
    surname: undefined,
    phone: undefined,
    email: undefined,
})

type State = {
    name: string | undefined,
    surname: string | undefined,
    phone: string | undefined,
    email: string | undefined,
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

function onSubmit(event: FormSubmitEvent<State>) {
    const insert = [
        {
            name: event.data.name!,
            surname: event.data.surname!,
            phone_number: event.data.phone!,
            email: event.data.email!,
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
            title="Teachers/Organisation"
            title-link="/teacher"
            :other-links="[{
                               label: 'Add new teacher',
                               to: '/teacher/add'
                           },
                           {
                               label: 'Add new organisation',
                               to: '/teacher/addOrga'
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
                    label="Add"
                    color="leather"
                />
            </UForm>
        </div>
    </section>
</template>
