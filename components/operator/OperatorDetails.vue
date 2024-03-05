<script setup lang="ts">
const props = defineProps({
    currentOperator: {
        type: String,
        required: true,
    },
})

const sp = useSupabaseClient()

// Todo: All the logic to fetch the data and display it
</script>

<template>
    <section class="flex justify-center items-center w-full">
        <TodoPage
            :title="`Operator`"
        />
    </section>
</template>
