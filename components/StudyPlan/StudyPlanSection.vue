<!-- eslint-disable no-console -->
<script setup lang="ts">
type StudyPlan = {
    date: string
    id_op: number
    id_comp: number
    id_train: number
    name: string
    name_op: string
    name_state: string
    name_train: string
    surname: string
    propositionTrain: Training[]
}

const prop = defineProps<{
    study: StudyPlan
}>()
const refSelectMenu = ref(prop.study.propositionTrain[0])

function goToRegistration(data: StudyPlan) {
    console.log('data:', refSelectMenu)
    const date = new Date(refSelectMenu.value.date)
    console.log('date:', date)
    console.log(date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear())
    navigateTo('/training/add/registration?training=' + refSelectMenu.value.id_train + '&operator=' + data.id_op + '&date=' + date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear())
}
</script>

<template>
    <div class="bloc">
        <h1 class="text-2xl text-red-500">
            Alert !!
        </h1>

        <p>
            name: {{ prop.study.name_op + " " + prop.study.surname }}
        </p>

        <p>
            Position: {{ prop.study.name }}
        </p>

        <p>
            Last training : {{ prop.study.date }}
        </p>

        <div>
            <label for="training">Futur date training:</label>

            <USelectMenu
                v-if="prop.study.propositionTrain.length > 0"
                id="training"
                v-model="refSelectMenu"
                :options="prop.study.propositionTrain"
                option-attribute="date"
                by="id_train"
            />

            <p v-else>
                No training available
            </p>
        </div>

        <UButton
            label="i don't know"
            @click="goToRegistration(prop.study)"
        />
    </div>
</template>
