<!-- eslint-disable indent -->
<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

// const sp = useSupabaseClient()
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

const data = ref<StudyPlan[]>()

async function fetchStudyPlan(nbday: number = 50) {
    try {
        const tmp = await $fetch('/api/StudyPlanHelper', {
            method: 'POST',
            headers: useRequestHeaders(['cookie']),
            body: JSON.stringify({
                nbday
            }),
        }) as { data: StudyPlan[] }

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
    await fetchStudyPlan(event.data.nbday.toString() === '' ? 50 : event.data.nbday.valueOf())
}

onMounted(async () => {
    await fetchStudyPlan()
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
            class="mt-5 w-1/8 items-center justify-center"
        />

        <UButton
            label="Download Pdf"
            class="mt-5 w-1/8 items-center justify-center"
            @click="navigateTo('/studyplan/pdf')"
        />
    </UForm>

    <div
        v-if="data"
        class="flex flex-wrap items-center justify-center"
    >
        <div
            v-for="Study in data"
            :key="Study.id_op"
            :data="data"
            class="border-2 border-black p-5 m-9 w-96 rounded-xl"
        >
            <StudyPlanSection :study="Study" />
        </div>
    </div>

    <div
        v-if="!data"
        class="flex flex-row items-center justify-center border-2 border-black p-5 m-9 ml-96 mr-96 rounded-lg"
    >
        <p>no operator need training</p>
    </div>
</template>
