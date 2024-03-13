<script setup lang="ts">
const sp = useSupabaseClient()

onMounted(async () => {
    const { data } = await sp.from('Competences').select('id_comp').order('name')

    if (data!.length === 0) {
        navigateTo('/competence/add')
    }

    navigateTo(`/competence/${data![0].id_comp}`)
})
</script>

<template>
    <div>
        Looking for competence, please wait
    </div>
</template>
