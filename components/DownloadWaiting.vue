<script setup lang="ts">
defineEmits(['download'])
</script>

<template>
    <div>
        <p>
            Wait a moment while we process the data...
        </p>

        <UProgress animation="carousel" />

        <p>
            The download will start automatically.
        </p>

        <p>
            If it doesn't, click the button below.
        </p>

        <UButton
            class="mt-5"
            @click="$emit('download')"
        >
            Download
        </UButton>
    </div>
</template>
