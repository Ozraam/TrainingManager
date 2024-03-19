<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
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
const sp = useSupabaseClient()
const loading = ref(false)
const state = reactive({
    nbday: 50
})

type State = {
    nbday: number
}

function validate(state:State): FormError[] {
    const errors: FormError[] = []
    if (state.nbday < 0) {
        errors.push({
            path: 'nbday',
            message: 'nbday must be greater than 0 and is required',
        })
    }

    if (isNaN(state.nbday)) {
        errors.push({
            path: 'nbday',
            message: 'nbday must be a number',
        })
    }
    return errors
}

const data = ref<StudyPlan[]>([])

async function test(nbday: number = 50) {
    console.log('nbday:', nbday)
    try {
        const tmp = await $fetch('/api/StudyPlanHelper', {
            method: 'POST',
            headers: useRequestHeaders(['cookie']),
            body: JSON.stringify({
                nbday
            }),
        }) as { data: StudyPlan[] }

        tmp.data.forEach((element) => {
            const { data } = sp.from('Training').select('*').eq('id_train', element.id_train)
        })

        if (tmp && tmp.data) {
            data.value = tmp.data
        } else {
            console.error('La réponse du serveur ne contient pas de données valides.')
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des données :", error)
    } finally {
        loading.value = false
    }
}

async function fetchStudyPlanValdiation(event: FormSubmitEvent<State>) {
    if (loading.value) { return }
    loading.value = true
    console.log(event.data.nbday)
    await test(event.data.nbday.toString() === '' ? 50 : event.data.nbday.valueOf())
}

function goToRegistration(data: StudyPlan) {
    console.log('data:', data)
    navigateTo('/training/add/registration?training=' + data.id_train + '&operator=' + data.id_op + '&date=' + data.date)
}

onMounted(async () => {
    await test()
})
</script>

<template>
    <UForm
        class="flex flex-col items-center justify-center mt-7"
        :loading="loading"
        :state="state"
        :validate="validate"
        @submit="fetchStudyPlanValdiation"
    >
        <UFormGroup
            name="nbday"
            label="nbday"
            type="number"
        >
            <UInput
                v-model="state.nbday"
                class="w-1/8 items-center"
            />
        </UFormGroup>

        <UButton
            label="Refresh"
            type="submit"
        />
    </UForm>

    <div
        v-for="Study in data"
        :key="Study.id_op"
        :data="data"
        class="flex flex-row items-center justify-center border-2 border-black p-5 m-9 ml-96 mr-96 rounded-lg"
    >
        <div class="bloc">
            <h1 class="text-2xl text-red-500">
                Alert !!
            </h1>

            <p>
                name: {{ Study.name_op + " " + Study.surname }}
            </p>

            <p>
                Position: {{ Study.name }}
            </p>

            <p>
                Date: {{ Study.date }}
            </p>

            <UButton
                label="i don't know"
                @click="goToRegistration(Study)"
            />
        </div>
    </div>
</template>
