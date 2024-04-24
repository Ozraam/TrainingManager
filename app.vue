<script setup>
// add class to body
useHead({
    bodyAttrs: {
        class: 'bg-gray-0 dark:bg-gray-900',
    },
})
</script>

<template>
    <section class="flex">
        <AppNavBar />

        <NuxtPage class="grow" />

        <UNotifications />
    </section>
</template>
