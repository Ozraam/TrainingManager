<!-- eslint-disable indent -->
<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

// const sp = useSupabaseClient()
const loading = ref(false)

function datePlusDays(date: Date, days: number) {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

const state = reactive({
    date: datePlusDays(new Date(), 60),
})

type State = {
    date: Date,
}

function validate(state:State): FormError[] {
    const errors: FormError[] = []

    if (state.date < new Date()) {
        errors.push({
            path: 'nbday',
            message: 'Date must be in the future',
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
    console.log(event.data.date)
    // get the number of day between the date and now
    const diffTime = Math.abs(event.data.date.getTime() - new Date().getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    await fetchStudyPlan(diffDays)
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
            label="Date until which the study plan will cover for competences expiration"
            type="number"
            class="flex flex-col items-center"
        >
            <DatePickerPopover v-model="state.date" />
        </UFormGroup>

        <UButton
            label="Refresh"
            type="submit"
            class="mt-5 w-1/8 items-center justify-center"
            color="leather"
        />

        <UButton
            label="Download Excel"
            class="mt-5 w-1/8 items-center justify-center"
            to="/studyplan/download"
            color="leather"
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
