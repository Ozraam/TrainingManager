<!-- eslint-disable no-console -->
<script setup lang="ts">
const sp = useSupabaseClient()
const mail = ref('')
const password = ref('')
const confirmPassword = ref('')
const erreur = ref({ confirmPassword: false, password: false, lenght: false })

async function signup() {
    console.log(mail.value, password.value, confirmPassword.value)
    erreur.value = { confirmPassword: false, password: false, lenght: false }
    if (password.value !== confirmPassword.value) {
        erreur.value.confirmPassword = true
        return
    }

    if (password.value.length < 8) {
        erreur.value.lenght = true
        return
    }

    const user = await sp.auth.signUp({
        email: mail.value,
        password: password.value,
    })

    if (user.error) {
        console.log(user.error)
        erreur.value.password = true
        return
    } else {
        location.href = '/'
    }

    console.log(user)
}
</script>

<template>
    <div class="min-h-screen">
        <div class="flex justify-center items-center">
            <form
                class="w-50"
                @submit.prevent="signup"
            >
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

                <span
                    v-if="erreur.confirmPassword"
                    class="text-red-500"
                >{{ $t('signup.ConfirmError') }}
                </span>

                <span
                    v-if="erreur.password"
                    class="text-red-500"
                >{{ $t('signup.Error') }}
                </span>

                <span
                    v-if="erreur.lenght"
                    class="text-red-500"
                >{{ $t('signup.LenghtError') }}
                </span>

                <br>

                <UButton
                    class="mt-3"
                    :label="$t('signup.submit')"
                    type="submit"
                />
            </form>
        </div>
    </div>
</template>
