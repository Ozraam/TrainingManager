<script setup lang="ts">
const route = useRoute()

const competenceId = route.params.competence_id.toString()
</script>

<template>
    <main class="h-screen flex flex-col">
        <PageHeader
            title="Competence"
            :title-link="`/competence/${competenceId}`"
            :actions="[
                {
                    label: $t('competence.add'),
                    callBack: () => navigateTo('/competence/add')
                },
            ]"
        />

        <div class="flex grow">
            <CompetenceSelect :current-competence="competenceId" />

            <!-- <CompetenceDetails :current-competence="competenceId" /> -->
        </div>
    </main>
</template>
