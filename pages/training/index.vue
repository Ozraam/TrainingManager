<script setup lang="ts">
const sp = useSupabaseClient()

const { data } = await sp.from('Training').select('id_train').order('name')

if (data!.length === 0) {
    navigateTo('/training/add')
}

navigateTo(`/training/${data![0].id_train}`)
</script>

<template>
    <div>
        Looking for training, please wait
    </div>
</template>
