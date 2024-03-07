<script setup lang="ts">
const sp = useSupabaseClient()

// TODO : Replace with proper login form, this is just for testing and development
sp.auth.signInWithPassword({
    email: 'lhgrillepain@gmail.com',
    password: 'salutlafamille'
})

const dataR : Ref<any | null> = ref(null)

async function a() {
    const { data } = await $fetch('/api/DashBordHelper', {
        method: 'GET',
        headers: useRequestHeaders(['cookie']),
        // body: JSON.stringify({
        //     id_op: 1
        // })
    })

    dataR.value = data
    // eslint-disable-next-line no-console
    console.log(data)
}
a()
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
