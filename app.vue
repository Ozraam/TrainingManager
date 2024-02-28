<script setup>
// add class to body
useHead({
    bodyAttrs: {
        class: 'bg-gray-100 dark:bg-gray-900',
    },
})
</script>

<template>
    <section class="flex">
        <AppNavBar />

        <NuxtPage class="grow" />
    </section>
</template>
