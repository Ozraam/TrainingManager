<script setup lang="ts">
const sp = useSupabaseClient()
const loading = ref(false)
async function logout() {
    loading.value = true
    await sp.auth.signOut()
    location.href = '/'
}
</script>

<template>
    <div class="min-h-screen">
        <PageHeader
            title="Log out"
            title-link="/auth/logout"
        />

        <div class="flex flex-col items-center w-50 m-7">
            <p class="text-center text-2xl mb-5">
                Are you sure you want to log out ?
            </p>

            <UButton
                class="mt-5"
                :loading="loading"
                color="leather"
                @click="logout"
            >
                Logout
            </UButton>
        </div>
    </div>
</template>
