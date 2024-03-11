<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const sp = useSupabaseClient()

type State = {
    id_train: number | undefined,
    id_op: number | undefined,
    date: string | undefined,
    state: number | undefined,
}

const state = reactive<State>({
    id_train: undefined,
    id_op: undefined,
    date: undefined,
    state: undefined,
})

// check if date is valid
// date format: dd/mm/yyyy or dd-mm-yyyy
// example: 01/01/2024 or 01-01-2024
// return true if date is valid
function isDateValid(date: string | undefined) {
    return date !== undefined && /^(3[01]|[12][0-9]|0?[1-9])(\/|-)(1[0-2]|0?[1-9])\2[0-9]{4}$/g.test(date)
}

function validate(state: State): FormError[] {
    const errors: FormError[] = []

    if (state.date ? state.date.trim() === '' : true) {
        errors.push({
            path: 'date',
            message: 'Date is required',
        })
    }

    if (!isDateValid(state.date)) {
        errors.push({
            path: 'date',
            message: 'Date format is invalid',
        })
    }

    if (state.state === undefined) {
        errors.push({
            path: 'state',
            message: 'State is required',
        })
    }

    if (state.id_op === undefined) {
        errors.push({
            path: 'id_op',
            message: 'Operator is required',
        })
    }

    if (state.id_train === undefined) {
        errors.push({
            path: 'id_train',
            message: 'Training is required',
        })
    }

    return errors
}

const toast = useToast()

const loading = ref(false)

async function onSubmit(event: FormSubmitEvent<State>) {
    if (loading.value) { return }
    loading.value = true
    const insert = [
        {
            id_train: event.data.id_train!,
            id_op: event.data.id_op!,
            date: event.data.date!,
            state: event.data.state!,
        }
    ] as never[]

    const { error, data } = await sp.from('Registration').insert(insert).select('id_train')

    if (error) {
        loading.value = false
        toast.add({
            title: 'Error',
            description: 'An error occurred while adding the registration',
            color: 'red',
        })
    } else {
        toast.add({
            title: 'Success',
            description: 'The registration has been added',
        })
        navigateTo('/training/' + data![0].id_train)
    }
}

const { data: training } = await sp.from('Training').select('id_train, name')
const { data: operators } = await sp.from('Operators').select('id_op, name, surname')
const { data: states } = await sp.from('State').select('name, id_state')

const route = useRoute()

if (route.query.training) {
    state.id_train = parseInt(route.query.training as string)
}

if (route.query.operator) {
    state.id_op = parseInt(route.query.operator as string)
}

if (route.query.date) {
    state.date = route.query.date as string
}

if (route.query.state) {
    state.state = parseInt(route.query.state as string)
}
</script>

<template>
    <section>
        <PageHeader
            title="Training"
            title-link="/training/1"
            :other-links="[
                {
                    label: 'Add new training',
                    to: '/training/add'
                },
                {
                    label: 'Add new registration',
                    to: '/training/add/registration'
                }
            ]"
        />

        <div>
            <h2 class="text-xl text-center mb-5">
                Add new Registration
            </h2>

            <UForm
                class="space-y-4 flex flex-col items-center"
                :state="state"
                :validate="validate"
                @submit="onSubmit"
            >
                <UFormGroup
                    label="Training"
                    name="id_train"
                    class="min-w-44"
                    required
                >
                    <USelectMenu
                        v-model="state.id_train"
                        :options="training"
                        value-attribute="id_train"
                        option-attribute="name"
                        placeholder="Select training"
                        searchable
                    />
                </UFormGroup>

                <UFormGroup
                    label="Operator"
                    name="id_op"
                    class="min-w-44"
                    required
                >
                    <USelectMenu
                        v-model="state.id_op"
                        :options="operators?.map((o) => {
                            return {
                                id_op: o.id_op,
                                name: o.name + ' ' + o.surname,
                            }
                        })"
                        value-attribute="id_op"
                        option-attribute="name"
                        placeholder="Select operator"
                        searchable
                    />
                </UFormGroup>

                <UFormGroup
                    label="Date"
                    name="date"
                    required
                    hint="Days/Month/Year"
                >
                    <UInput
                        v-model="state.date"
                        placeholder="01/01/2024"
                    />
                </UFormGroup>

                <UFormGroup
                    label="State"
                    name="state"
                    required
                    class="min-w-44"
                >
                    <USelectMenu
                        v-model="state.state"
                        :options="states"
                        value-attribute="id_state"
                        option-attribute="name"
                        placeholder="Select state"
                    />
                </UFormGroup>

                <UButton
                    :loading="loading"
                    type="submit"
                    label="Add"
                />
            </UForm>
        </div>
    </section>
</template>
