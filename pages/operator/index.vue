<script setup lang="ts">
const sp = useSupabaseClient()
onMounted(() => {
    sp.from('Operators').select('id_op').eq('deleted', 0).order('name').then(({ data }) => {
        if (!data || (data && data.length)) {
            navigateTo('/operator/add')
        }

        navigateTo(`/operator/${data![0].id_op}`)
    })
})
</script>

<template>
    <div>
        Looking for operator, please wait
    </div>
</template>
