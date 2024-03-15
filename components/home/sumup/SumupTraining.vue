<script setup lang="ts">
import RegistrationSumup from './RegistrationSumup.vue'
defineProps({
    training: {
        type: Object as PropType<Training>,
        required: true
    }
})

defineEmits(['update'])
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
            <RegistrationSumup
                v-for="registration in training.Registration"
                :key="registration.id_op"
                :registration="registration"
                @update="$emit('update')"
            />
        </div>
    </UCard>
</template>
