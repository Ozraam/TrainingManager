<!-- eslint-disable no-console -->
<script setup lang="ts">
const sp = useSupabaseClient()
const mail = ref('')
const password = ref('')

async function login() {
    console.log(mail.value, password.value)
    const user = await sp.auth.signInWithPassword({
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
                <label class="text-2xl font-bold">{{ $t('login.email') }}</label>

                <UInput
                    v-model="mail"
                    label="Email"
                    type="email"
                />

                <label class="text-2l text-gray-500">{{ $t('login.password') }}</label>

                <UInput
                    v-model="password"
                    label="Password"
                    type="password"
                />

                <UButton
                    class="mt-3"
                    :label="$t('login.submit')"
                    @click="login"
                />
            </div>
        </div>
    </div>
</template>
