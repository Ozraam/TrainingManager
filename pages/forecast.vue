<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const sp = useSupabaseClient()

const yearsBudget: Ref<{ year: number, budget: number }[] | undefined> = ref(undefined)

function fetchYearsBudget() {
    sp.from('Forecast').select('year, budget').then(({ data, error }) => {
        if (error) {
            // eslint-disable-next-line no-console
            console.error(error)
            return
        }

        yearsBudget.value = data

        state.budget = yearsBudget.value?.find(y => y.year === state.year)?.budget ?? 0
    })
}

const currentYear = new Date().getFullYear()

const state = reactive({
    year: currentYear,
    budget: 0,
})

fetchYearsBudget()

type State = {
    year: number | undefined,
    budget: number | undefined,
}

function validate(state: State): FormError[] {
    const errors: FormError[] = []

    if (!state.year) {
        errors.push({
            path: 'year',
            message: 'Year is required',
        })
    }

    if (state.budget ? state.budget < 0 : true) {
        errors.push({
            path: 'budget',
            message: 'Budget must be greater than 0 and is required',
        })
    }

    return errors
}

const toast = useToast()

function addBudget(event: FormSubmitEvent<State>) {
    const insert = [
        {
            year: event.data.year,
            budget: event.data.budget,
        }
    ]

    sp.from('Forecast').upsert(insert as never).then(({ error }) => {
        if (error) {
            // eslint-disable-next-line no-console
            console.error(error)
            toast.add({
                title: 'Error',
                description: 'Failed to add budget',
                color: 'red',
                timeout: 1000,
            })
            return
        }

        toast.add({
            title: 'Success',
            description: 'Budget added',
            color: 'green',
            timeout: 1000,
        })
        fetchYearsBudget()
    })
}
</script>

<template>
    <section>
        <PageHeader
            :title="`Forecast`"
            :title-link="`/forecast`"
        />

        <div class="m-3">
            <!-- this page is meant to input the budget of every year -->
            <div class="flex flex-col justify-center items-center">
                <h2 class="text-xl my-4">
                    Add Budget
                </h2>

                <UForm
                    class="space-y-4 flex items-center flex-col"
                    :state="state"
                    :validate="validate"
                    @submit="addBudget"
                >
                    <UFormGroup
                        label="Year"
                        required
                        name="year"
                    >
                        <UInput
                            v-model="state.year"
                            type="number"
                            placeholder="Year"
                        />
                    </UFormGroup>

                    <UFormGroup
                        label="Budget"
                        required
                        name="budget"
                    >
                        <UInput
                            v-model="state.budget"
                            type="number"
                            placeholder="Budget"
                        />
                    </UFormGroup>

                    <UButton
                        type="submit"
                        label="Add Budget"
                    />
                </UForm>
            </div>

            <div class="mt-5">
                <h4>
                    All budgets for all years
                </h4>

                <div class="flex gap-3">
                    <UCard
                        v-for="yearBudget in yearsBudget"
                        :key="yearBudget.year"
                    >
                        <template #header>
                            <h3>
                                {{ yearBudget.year }}
                            </h3>
                        </template>

                        <p>
                            Budget: {{ yearBudget.budget }} €
                        </p>
                    </UCard>
                </div>
            </div>
        </div>
    </section>
</template>
