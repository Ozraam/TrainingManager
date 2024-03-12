<script setup lang="ts">
defineProps({
    competence: {
        type: Object as PropType<{
            id_comp: number;
            name: string;
            tmp_validity: number;
        }>,
        required: true,
    },
})

// TODO : This is a placeholder for when the backend will be ready
</script>

<template>
    <div class="m-3">
        <h4 class="font-bold">
            {{ competence.name }}
        </h4>

        <div class="text-sm flex gap-4">
            <p>
                Validity: {{ competence.tmp_validity }} years
            </p>

            <p>
                Valid <!-- TODO : check validity-->
            </p>
        </div>
    </div>
</template>
