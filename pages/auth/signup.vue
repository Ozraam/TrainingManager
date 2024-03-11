<script setup lang="ts">

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
