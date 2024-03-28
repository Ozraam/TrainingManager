<!-- eslint-disable no-console -->
<script setup lang="ts">
const sp = useSupabaseClient()
type Orga = {
    id_orga: number;
    name: string;
    Training: {
        name: string;
        id_train: number;
    }[]
}

async function fetchTraining() {
    const { data, error } = await sp.from('Training').select('id_train, name').order('name', { ascending: true })
    if (error) {
        console.error(error)
    } else {
        console.log(data)
        props.orga.Training = data
    }
}

const props = defineProps({
    orga: {
        type: Object as PropType<Orga>,
        required: true
    }
})

onMounted(fetchTraining)
</script>

<template>
    <template>
        <UCard>
            <!-- <TeacherEdit
                :teacher="teacher"
                :is-editing="isEditing"
                @close="toggleEdit"
                @update="$emit('deleted')"
            /> -->

            <template #header>
                <div class="flex">
                    <h2>{{ orga.name }}</h2>

                    <UButton
                        label="Delete"
                        size="2xs"
                        variant="ghost"
                        color="red"
                        icon="i-heroicons-trash-20-solid"
                    />

                    <UButton
                        label="Edit"
                        size="2xs"
                        variant="ghost"
                        icon="i-heroicons-pencil-20-solid"
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
                        >
                            {{ training.name }}
                        </UButton>
                    </li>
                </ul>
            </div>
        </UCard>
    </template>
</template>
