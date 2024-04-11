<script setup lang="ts">
const user = useSupabaseUser()

if (user.value) {
    navigateTo('/')
}
</script>

<template>
    <div class="min-h-screen">
        <PageHeader
            :title="$t('signup.title')"
            title-link="/auth/signup"
        />

        <AuthSignUpForm />
    </div>
</template>
