<script setup lang="ts">
defineProps({
    training: {
        type: Object as PropType<{
            date: string,
            State: {
                name: string,
                id_state: number,
            },
            id_op: number,
            Training: {
                name: string,
                duration: number
            },
            id_state: number,
            id_train: number
        }>,
        required: true,
    },
})

function changeState() {
    // TODO : This is a placeholder for the real save
    alert('State changed - TODO')
}

function downloadCertificate() {
    // TODO : This is a placeholder for the real save
    alert('Certificate downloaded - TODO')
}
</script>

<template>
    <div>
        <div class="flex items-center">
            <p>
                <UButton
                    variant="link"
                    :to="`/training/${training.id_train}`"
                >
                    {{ training.Training.name }}
                </UButton> - {{ new Date(training.date).toLocaleDateString() }}&nbsp;
            </p>

            <p v-if="training.State.id_state !== 1">
                - {{ training.Training.duration }} hours
            </p>

            <UButton
                v-if="training.State.name !== 'done' && training.State.name != 'expired'"
                label="Change state"
                size="xs"
                class="ml-2"
                @click="changeState"
            />

            <UButton
                v-else
                label="Certificate"
                size="xs"
                class="ml-2"
                @click="downloadCertificate"
            />
        </div>
    </div>
</template>
