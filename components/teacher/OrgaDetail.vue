<!-- eslint-disable no-console -->
<script setup lang="ts">
import OrgaEdit from '~/components/teacher/OrgaEdit.vue'
type Orga = {
    id_orga: number;
    name: string;
    deleted: boolean;
    Training: {
        name: string;
        id_train: number;
    }[]
}

const props = defineProps({
    orga: {
        type: Object as PropType<Orga>,
        required: true
    }
})

const sp = useSupabaseClient()
const toast = useToast()
const emit = defineEmits(['deleted'])

async function deleteOrga() {
    // const deleteTraining = async (idTraining: number) => {
    //     const { error } = await sp.from('Registration').delete().eq('id_train', idTraining).select('*')
    //     if (error) {
    //         toast.add({
    //             title: 'Error',
    //             description: 'An error occurred while deleting the training',
    //             color: 'red',
    //         })
    //     } else {
    //         const { error } = await sp.from('Training').delete().eq('id_train', idTraining).select('*')
    //         if (error) {
    //             toast.add({
    //                 title: 'Error',
    //                 description: 'An error occurred while deleting the training',
    //                 color: 'red',
    //             })
    //         }
    //     }
    // }

    // for (const training of props.orga.Training) {
    //     await deleteTraining(training.id_train)
    // }

    const { error } = await sp.from('Organisation').update({ name: 'deleted', deleted: true } as never).eq('id_orga', props.orga.id_orga).select()

    if (error) {
        toast.add({
            title: 'Error',
            description: 'An error occurred while deleting the organisation',
            color: 'red',
        })
    } else {
        toast.add({
            title: 'Success',
            description: 'The organisation has been deleted',
        })
        emit('deleted')
    }
}

const confirmationId = ref<string | null>(null)

function askConfirmation() {
    const actions = [
        {
            label: 'Yes',
            onClick: deleteOrga
        },
        {
            label: 'No',
            onClick: () => toast.remove(confirmationId.value!)
        }
    ]
    confirmationId.value = toast.add({
        title: 'Are you sure?',
        description: 'This action cannot be undone, all the trainings will be deleted too.',
        actions,
        color: 'red',
    }).id
}
const isEditing = ref(false)
function toggleEdit() {
    isEditing.value = !isEditing.value
}
</script>

<template>
    <UCard>
        <OrgaEdit
            :orga="orga"
            :is-editing="isEditing"
            @close="toggleEdit"
            @update="$emit('deleted')"
        />

        <template #header>
            <div class="flex">
                <h2>{{ orga.name }}</h2>

                <UButton
                    label="Delete"
                    size="2xs"
                    variant="ghost"
                    color="red"
                    icon="i-heroicons-trash-20-solid"
                    @click="askConfirmation()"
                />

                <UButton
                    label="Edit"
                    size="2xs"
                    variant="ghost"
                    color="indigo"
                    icon="i-heroicons-pencil-20-solid"
                    @click="toggleEdit"
                />
            </div>
        </template>

        <div>
            <h3>
                Trainings
            </h3>

            <ul>
                <li
                    v-for="training in orga.Training"
                    :key="training.id_train"
                >
                    <UButton
                        variant="link"
                        :to="`/training/${training.id_train}`"
                        color="leather"
                    >
                        {{ training.name }}
                    </UButton>
                </li>
            </ul>
        </div>
    </UCard>
</template>
