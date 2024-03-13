<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const sp = useSupabaseClient()
const loading = ref(false)
const error = ref(false)

const state = reactive({
    mail: undefined,
    password: undefined,
    confirmPassword: undefined
})

type State = {
    mail: string | undefined,
    password: string | undefined,
    confirmPassword: string | undefined
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

    if (state.confirmPassword ? state.confirmPassword.trim() === '' : true) {
        errors.push({
            path: 'confirmPassword',
            message: 'Password is required',
        })
    }

    if (state.password !== state.confirmPassword) {
        errors.push({
            path: 'confirmPassword',
            message: 'Passwords do not match',
        })
    }

    if (state.password && state.password.length < 8) {
        errors.push({
            path: 'password',
            message: 'Password must be at least 8 characters long',
        })
    }

    return errors
}

async function signup(event: FormSubmitEvent<State>) {
    if (loading.value) { return }
    loading.value = true

    const user = await sp.auth.signUp({
        email: event.data.mail!,
        password: event.data.password!,
    })

    if (user.error) {
        console.log(user.error)
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
            :loading="loading"
            :state="state"
            :validate="validate"
            @submit="signup"
        >
            <UFormGroup
                name="mail"
                label="Mail"
                type="mail"
                required
            >
                <UInput v-model="state.mail" />
            </UFormGroup>

            <UFormGroup
                name="password"
                label="Password"
                required
            >
                <UInput
                    v-model="state.password"
                    type="password"
                />
            </UFormGroup>

            <UFormGroup
                name="confirmPassword"
                label="Confirm Password"
                required
            >
                <UInput
                    v-model="state.confirmPassword"
                    type="password"
                />
            </UFormGroup>

            <UError
                v-if="error"
                class="mt-3 text-red-500"
            >
                {{ $t('signup.Error') }}
            </UError>

            <UButton
                class="mt-3"
                :label="$t('signup.submit')"
                type="submit"
            />
        </UForm>
    </div>
</template>
