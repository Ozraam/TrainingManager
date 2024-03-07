<script setup lang="ts">
const sp = useSupabaseClient()

// TODO : Replace with proper login form, this is just for testing and development
sp.auth.signInWithPassword({
    email: 'lhgrillepain@gmail.com',
    password: 'salutlafamille'
})
</script>

<template>
    <div class="min-h-screen">
        <PageHeader :title="$t('home.title')" />

        <HomeDashBoard />
    </div>
</template>
