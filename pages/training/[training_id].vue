<script setup lang="ts">
const route = useRoute()

const trainingId = route.params.training_id.toString()
</script>

<template>
    <main class="h-screen flex flex-col">
        <PageHeader
            title="Training"
            :title-link="`/training/${trainingId}`"
            :actions="[
                {
                    label: $t('training.add'),
                    callBack: () => navigateTo('/training/add')
                },
            ]"
        />

        <div class="flex grow">
            <TrainingSelect :current-training="trainingId" />

            <!-- <CompetenceDetails :current-competence="trainingId" /> -->
        </div>
    </main>
</template>
