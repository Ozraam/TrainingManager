<script setup lang="ts">
defineProps({
    training: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <UCard>
        <template #header>
            <div class="flex justify-between items-center">
                <h3>
                    {{ training.name }}
                </h3>

                <UButton
                    label="See Training"
                    :to="`/training/${training.id}`"
                    variant="link"
                />
            </div>
        </template>

        <div class="flex flex-col gap-2">
            <div
                v-for="operator in training.Operators"
                :key="operator.name"
                class="flex items-center gap-3 justify-between"
            >
                <p>{{ operator.name }} : {{ operator.status }}</p>

                <div class="flex gap-2">
                    <UButton
                        v-if="operator.status !== 'Done'"
                        label="Mark as done"
                        icon="i-heroicons-check"
                    />

                    <UButton
                        label="View profile"
                        icon="i-heroicons-user-circle"
                        :to="`/operator/${operator.id}`"
                    />
                </div>
            </div>
        </div>
    </UCard>
</template>
