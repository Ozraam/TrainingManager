<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { StudyPlan } from '../../utils/types'
const prop = defineProps<{
    study: StudyPlan
}>()

const sp = useSupabaseClient()

const Training = (await sp.from('Training').select('*')).data
// const Pos = (await sp.from('Position').select('*')).data as Position[]
// const pos = Pos.filter(posf => posf.name === prop.study.name)[0]

const TrainOp = Training?.filter((training: Training) => new Date(training.date).getTime() > new Date().getTime() && prop.study.id_comp === training.id_comp) ?? [] as Training[]

const refSelectMenu = ref(TrainOp[0])

function goToRegistration(data: StudyPlan) {
    const date = new Date(refSelectMenu.value.date)
    // console.log('date: ' + date.getDate() + '/' + date.getMonth())
    navigateTo('/training/add/registration?training=' + refSelectMenu.value.id_train + '&operator=' + data.id_op + '&date=' + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear())
}
</script>

<template>
    <div class="bloc">
        <h1 class="text-3xl text-red-500 text-center mb-2">
            /!\ Alerte /!\
        </h1>

        <p>
            name: {{ prop.study.name_op + " " + prop.study.surname }}
        </p>

        <p>
            Position:
            <ULink
                to="/positions"
                class="text-blue-500 underline"
            >
                {{ firstLetterToUpperCase(prop.study.name) }}
            </ULink>
        </p>

        <p>
            Last training : {{ prop.study.date }}
        </p>

        <div class="mt-2 mb-4">
            <label for="training">Futur date training:</label>

            <USelectMenu
                v-if="TrainOp.length > 0"
                id="training"
                v-model="refSelectMenu"
                :options="TrainOp"
                option-attribute="date"
                by="id_train"
            />

            <p v-else>
                No training available
            </p>
        </div>

        <UButton
            label="Plan a new training"
            block
            @click="goToRegistration(prop.study)"
        />
    </div>
</template>
