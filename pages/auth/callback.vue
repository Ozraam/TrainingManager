<script setup lang="ts">
const sp = useSupabaseClient()
const user = useSupabaseUser()

if (!user.value) {
    navigateTo('/auth/login')
}

const route = useRoute()

if (!route.query.signup) {
    navigateTo('/')
}

sp.from('Authorization').insert({
    user_id: user.value?.id,
    is_allowed: false,
    email: user.value?.email
}).then(() => {
    navigateTo('/')
})
</script>

<template>
    <div class="min-h-screen">
        <PageHeader
            :title="$t('auth.callback.title')"
            title-link="/auth/callback"
        />

        <div class="flex justify-center items-center h-64">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">
                    {{ $t('auth.callback.title') }}
                </h1>

                <p class="text-gray-600 dark:text-gray-400">
                    {{ $t('auth.callback.description') }}
                </p>
            </div>
        </div>
    </div>
</template>
