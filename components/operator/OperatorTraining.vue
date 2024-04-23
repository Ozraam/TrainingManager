<script setup lang="ts">
const props = defineProps({
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
            id_train: number,
            filename: string,
        }>,
        required: true,
    },
})

const loadingDownload = ref(false)

const sp = useSupabaseClient()

defineEmits(['update'])

const toast = useToast()

function downloadCertificate() {
    if (loadingDownload.value) { return }
    loadingDownload.value = true
    const filepath = `registration/${props.training.id_train}/${props.training.id_op}/${props.training.date}/${props.training.filename}`

    sp.storage.from('Registration_certificate').download(filepath).then(({ data, error }) => {
        if (error) {
            toast.add({
                title: 'Error',
                description: 'An error occurred while downloading the certificate',
                color: 'red',
            })
        } else {
            const url = URL.createObjectURL(data)
            const a = document.createElement('a')
            a.href = url
            a.download = props.training.filename
            a.click()
            URL.revokeObjectURL(url)
        }
        loadingDownload.value = false
    })
}

const isRegistrationEditing: Ref<boolean> = ref(false)
function toggleRegistrationEdit() {
    isRegistrationEditing.value = !isRegistrationEditing.value
}
</script>

<template>
    <div>
        <div class="flex items-center">
            <RegistrationChangeState
                :registration="training"
                :is-editing="isRegistrationEditing"
                @close="toggleRegistrationEdit"
                @update="$emit('update')"
            />

            <p>
                <UButton
                    variant="link"
                    :to="`/training/${training.id_train}`"
                    color="leather"
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
                color="leather"
                @click="toggleRegistrationEdit"
            />

            <UButton
                v-else
                label="Certificate"
                size="xs"
                class="ml-2"
                :loading="loadingDownload"
                color="leather"
                @click="downloadCertificate"
            />
        </div>
    </div>
</template>
