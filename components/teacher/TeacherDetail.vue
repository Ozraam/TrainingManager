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

defineProps({
    teacher: {
        type: Object as PropType<Teacher>,
        required: true
    }
})
</script>

<template>
    <UCard>
        <template #header>
            <h2>{{ teacher.name }} {{ teacher.surname }}</h2>
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
                    >
                        {{ training.name }}
                    </UButton>
                </li>
            </ul>
        </div>
    </UCard>
</template>
