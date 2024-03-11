<!-- eslint-disable no-console -->
<script setup lang="ts">
const sp = useSupabaseClient()
const mail = ref('')
const password = ref('')
const erreur = ref(false)

async function login() {
    console.log(mail.value, password.value)
    const user = await sp.auth.signInWithPassword({
        email: mail.value,
        password: password.value,
    })

    if (user.error) {
        console.log(user.error)
        erreur.value = true
        return
    }

    console.log(user)
}
</script>

<template>
    <div class="min-h-screen">
        <div class="flex justify-center items-center">
            <form
                class="w-50"
                @submit.prevent="login"
            >
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

                <span
                    v-if="erreur"
                    class="text-red-500"
                >{{ $t('login.Error') }}
                </span>

                <br>

                <UButton
                    class="mt-3"
                    type="submit"
                    :label="$t('login.submit')"
                />
            </form>
        </div>
    </div>
</template>
