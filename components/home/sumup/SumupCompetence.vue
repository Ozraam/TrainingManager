<script setup lang="ts">
defineProps({
    competence: {
        type: Object as PropType<Competence>,
        required: true
    },
})
</script>

<template>
    <UCard>
        <template #header>
            <div class="flex justify-between items-center">
                <h3>
                    {{ competence.name }}
                </h3>

                <UButton
                    label="See Competence"
                    variant="link"
                    :to="`/competence/${competence.id}`"
                />
            </div>
        </template>

        <h3>
            {{ $t('home.recapTrainingList.training') }}
        </h3>

        <div class="flex flex-col gap-2">
            <HomeSumupTraining
                v-for="training in competence.trainings"
                :key="training.name"
                :training="training"
            />
        </div>
    </UCard>
</template>
