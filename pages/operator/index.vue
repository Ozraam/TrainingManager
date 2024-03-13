<script setup lang="ts">
const sp = useSupabaseClient()

const { data } = await sp.from('Operators').select('id_op').order('name')

if (data!.length === 0) {
    navigateTo('/operator/add')
}

navigateTo(`/operator/${data![0].id_op}`)
</script>

<template>
    <div>
        Looking for operator, please wait
    </div>
</template>
