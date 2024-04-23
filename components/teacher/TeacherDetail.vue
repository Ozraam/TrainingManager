<script setup lang="ts">
type Teacher = {
    id_teacher: number;
    name: string;
    surname: string;
    Training: {
        name: string;
        id_train: number;
    }[]
}

const props = defineProps({
    teacher: {
        type: Object as PropType<Teacher>,
        required: true
    }
})
const sp = useSupabaseClient()
const toast = useToast()

const emit = defineEmits(['deleted'])

async function deleteTeacher() {
    const deleteTraining = async (idTraining: number) => {
        const { error } = await sp.from('Registration').delete().eq('id_train', idTraining).select('*')
        if (error) {
            toast.add({
                title: 'Error',
                description: 'An error occurred while deleting the training',
                color: 'red',
            })
        } else {
            const { error } = await sp.from('Training').delete().eq('id_train', idTraining).select('*')
            if (error) {
                toast.add({
                    title: 'Error',
                    description: 'An error occurred while deleting the training',
                    color: 'red',
                })
            }
        }
    }

    for (const training of props.teacher.Training) {
        await deleteTraining(training.id_train)
    }

    const { error } = await sp.from('Teacher').delete().eq('id_teacher', props.teacher.id_teacher).select()

    if (error) {
        toast.add({
            title: 'Error',
            description: 'An error occurred while deleting the teacher',
            color: 'red',
        })
    } else {
        toast.add({
            title: 'Success',
            description: 'The teacher has been deleted',
        })
        emit('deleted')
    }
}

const confirmationId = ref<string | null>(null)

function askConfirmation() {
    const actions = [
        {
            label: 'Delete operator',
            click: () => deleteTeacher()
        }, {
            label: 'Cancel',
            click: () => toast.remove(confirmationId.value!)
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
        <TeacherEdit
            :teacher="teacher"
            :is-editing="isEditing"
            @close="toggleEdit"
            @update="$emit('deleted')"
        />

        <template #header>
            <div class="flex">
                <h2>{{ teacher.name }} {{ teacher.surname }}</h2>

                <UButton
                    label="Delete"
                    size="2xs"
                    variant="ghost"
                    color="red"
                    icon="i-heroicons-trash-20-solid"
                    @click="askConfirmation"
                />

                <UButton
                    label="Edit"
                    size="2xs"
                    color="indigo"
                    variant="ghost"
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
                    v-for="training in teacher.Training"
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
