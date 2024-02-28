<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    titleLink: {
        type: String,
        default: '/',
    },
})

const links = [
    { label: props.title, to: props.titleLink, icon: '' },
]
</script>

<template>
    <UHorizontalNavigation
        :links="links"
        class="border-b border-gray-200 dark:border-gray-800"
    />
</template>
