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

    actions: {
        type: Array as PropType<{ label: string, callBack: () => void }[]>,
        default: () => [],
    },
})

const links = [
    { label: props.title, to: props.titleLink, icon: '' },
]

links.push(...props.actions.map((action) => {
    return {
        label: action.label,
        to: '',
        icon: '',
        callBack: action.callBack,
    }
}))
</script>

<template>
    <UHorizontalNavigation
        :links="links"
        class="border-b border-gray-200 dark:border-gray-800"
    />
</template>
