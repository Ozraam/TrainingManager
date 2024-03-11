<script setup lang="ts">

</script>

<template>
    <div class="min-h-screen">
        <PageHeader
            :title="$t('login.title')"
            title-link="/auth/login"
        />

        <AuthLoginForm />
    </div>
</template>
