<script setup lang="ts">
defineProps<{
    yearsStat: YearData,
}>()

defineEmits(['update'])
</script>

<template>
    <section class="flex flex-col gap-2">
        <h2 class="text-center">
            {{ $t('home.recapTrainingList.title') }}
        </h2>

        <HomeSumupCompetence
            v-for="competence in yearsStat.competences"
            :key="competence.name"
            :competence="competence"
            @update="$emit('update')"
        />
    </section>
</template>
