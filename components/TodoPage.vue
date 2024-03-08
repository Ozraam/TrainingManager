<script setup lang="ts">
defineProps({
    title: {
        type: String,
        required: true,
    },
})
</script>

<template>
    <div class="flex flex-col items-center justify-center">
        <h1 class="text-3xl">
            {{ title }}
        </h1>
        This page is under construction 🚧
    </div>
</template>
