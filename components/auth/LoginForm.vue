<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const sp = useSupabaseClient()

const loading = ref(false)
const error = ref(false)

const state = reactive({
    mail: undefined,
    password: undefined,
})

type State = {
    mail: string | undefined,
    password: string | undefined,
}

function validate(state: State): FormError[] {
    const errors: FormError[] = []

    if (state.mail ? state.mail.trim() === '' : true) {
        errors.push({
            path: 'mail',
            message: 'Mail is required',
        })
    }

    if (state.password ? state.password.trim() === '' : true) {
        errors.push({
            path: 'password',
            message: 'Password is required',
        })
    }

    return errors
}

async function login(event: FormSubmitEvent<State>) {
    if (loading.value) { return }
    loading.value = true
    error.value = false

    const user = await sp.auth.signInWithPassword({
        email: event.data.mail!,
        password: event.data.password!,
    })
    //

    if (user.error) {
        //
        loading.value = false
        error.value = true
    } else {
        location.href = '/'
    }
}
</script>

<template>
    <div class="min-h-screen">
        <UForm
            class="flex flex-col items-center w-50 m-7"
            :state="state"
            :validate="validate"
            @submit="login"
        >
            <UFormGroup
                class="font-30"
                name="mail"
                label="Email"
                type="email"
                required
            >
                <UInput v-model="state.mail" />
            </UFormGroup>

            <UFormGroup
                name="password"
                label="Password"
                type="password"
                required
            >
                <UInput
                    v-model="state.password"
                    type="password"
                />
            </UFormGroup>

            <UError
                v-if="error"
                class="mt-3 text-red-500"
            >
                {{ $t('login.Error') }}
            </UError>

            <UButton
                class="mt-3"
                type="submit"
                :label="$t('login.submit')"
                :loading="loading"
            />
        </UForm>
    </div>
</template>
