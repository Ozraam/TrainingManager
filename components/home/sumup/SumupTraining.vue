<script setup lang="ts">
const props = defineProps({
    training: {
        type: Object as PropType<Training>,
        required: true
    }
})
console.log(props.training)
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
                    :to="`/training/${training.id_train}`"
                    variant="link"
                />
            </div>
        </template>

        <div class="flex flex-col gap-2">
            <div
                v-for="registration in training.Registration"
                :key="registration.Operators.name"
                class="flex items-center gap-3 justify-between"
            >
                <p>{{ registration.Operators.name }} : {{ registration.Operators.status }}</p>

                <div class="flex gap-2">
                    <UButton
                        v-if="registration.Operators.status !== 'done'"
                        label="Mark as done"
                        icon="i-heroicons-check"
                    />

                    <UButton
                        label="View profile"
                        icon="i-heroicons-user-circle"
                        :to="`/operator/${registration.Operators.id_op}`"
                    />
                </div>
            </div>
        </div>
    </UCard>
</template>
