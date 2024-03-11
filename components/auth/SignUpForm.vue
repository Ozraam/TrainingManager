<!-- eslint-disable no-console -->
<script setup lang="ts">
const sp = useSupabaseClient()
const mail = ref('')
const password = ref('')
const confirmPassword = ref('')

async function signup() {
    console.log(mail.value, password.value, confirmPassword.value)
    const user = await sp.auth.signUp({
        email: mail.value,
        password: password.value,
    })

    console.log(user)
}
</script>

<template>
    <div class="min-h-screen">
        <div class="flex justify-center items-center">
            <div class="w-50">
                <label class="text-2xl font-bold">{{ $t('signup.email') }}</label>

                <UInput
                    v-model="mail"
                    label="Email"
                    type="email"
                />

                <label class="text-2l text-gray-500">{{ $t('signup.password') }}</label>

                <UInput
                    v-model="password"
                    label="Password"
                    type="password"
                />

                <label class="text-2l text-gray-500">{{ $t('signup.confirmPassword') }}</label>

                <UInput
                    v-model="confirmPassword"
                    label="Confirm Password"
                    type="password"
                />

                <UButton
                    class="mt-3"
                    :label="$t('signup.submit')"
                    @click="signup"
                />
            </div>
        </div>
    </div>
</template>
