<script setup lang="ts">
// import { fetchSupabaseData } from '../utils/function'
const sp = useSupabaseClient()

// TODO : Replace with proper login form, this is just for testing and development
sp.auth.signInWithPassword({
    email: 'lhgrillepain@gmail.com',
    password: 'salutlafamille'
})

const dataR : Ref<any | null> = ref(null)

async function a() {
    const data = await $fetch('/api/StudyPlanHelper', {
        method: 'POST',
        headers: useRequestHeaders(['cookie']),
        // body: JSON.stringify({
        //     nbday: 50,
        // })
    })

    dataR.value = data
}
</script>

<template>
    <div>
        <UButton
            label="Request"
            @click="a"
        />

        <pre>
            {{ dataR }}
        </pre>
    </div>
</template>
