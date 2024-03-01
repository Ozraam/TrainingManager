<script setup lang="ts">
defineProps<{
    years: number[]
}>()

function nextYear() {
    current.value++
}

function previousYear() {
    current.value--
}

const current = defineModel({ type: Number, required: true })
</script>

<template>
    <div class="flex items-center gap-3">
        <UButton
            icon="i-heroicons-chevron-left"
            variant="ghost"
            :disabled="current === 0"
            @click="previousYear"
        />

        <span>
            {{ years[current] }}
        </span>

        <UButton
            icon="i-heroicons-chevron-right"
            variant="ghost"
            :disabled="current === years.length - 1"
            @click="nextYear"
        />
    </div>
</template>
