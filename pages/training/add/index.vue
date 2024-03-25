<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const route = useRoute()
const sp = useSupabaseClient()

type State = {
    name: string | undefined,
    date: string | undefined,
    duration: number | undefined,
    cost: number | undefined,
    id_teacher: number | undefined,
    id_comp: number | undefined,
    id_conf: number | undefined,
    id_type_training: number | undefined,
    topic: string | undefined,
}

const state = reactive({
    name: undefined,
    date: undefined,
    duration: undefined,
    cost: undefined,
    id_teacher: undefined,
    id_comp: undefined,
    id_conf: undefined,
    id_type_training: undefined,
    topic: undefined,
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

    if (state.name ? state.name.trim() === '' : true) {
        errors.push({
            path: 'name',
            message: 'Name is required',
        })
    }

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

    if (state.duration === undefined) {
        errors.push({
            path: 'duration',
            message: 'Duration is required',
        })
    }

    if (state.cost === undefined) {
        errors.push({
            path: 'cost',
            message: 'Cost is required',
        })
    }

    if (state.id_teacher === undefined) {
        errors.push({
            path: 'id_teacher',
            message: 'Teacher is required',
        })
    }

    if (state.id_comp === undefined) {
        errors.push({
            path: 'id_comp',
            message: 'Competence is required',
        })
    }

    if (state.id_conf === undefined) {
        errors.push({
            path: 'id_conf',
            message: 'Conference is required',
        })
    }

    if (state.id_type_training === undefined) {
        errors.push({
            path: 'id_type_training',
            message: 'Type of training is required',
        })
    }

    if (state.topic ? state.topic.trim() === '' : true) {
        errors.push({
            path: 'topic',
            message: 'Topic is required',
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
            name: event.data.name!,
            date: event.data.date!.split('/').reverse().join('-'),
            duration: event.data.duration!,
            cost: event.data.cost!,
            id_teacher: event.data.id_teacher!,
            id_comp: event.data.id_comp!,
            id_conf: event.data.id_conf!,
            id_type_train: event.data.id_type_training!,
            topic: event.data.topic!,
        }
    ]

    const { error, data } = await sp.from('Training').insert(insert as never).select('id_train')

    if (error) {
        loading.value = false
        toast.add({
            title: 'Error',
            description: 'An error occurred while adding the training',
            color: 'red',
        })
    } else {
        toast.add({
            title: 'Success',
            description: 'Training added successfully',
            color: 'green',
        })
        console.log(route.query.operator)

        if (route.query.operator !== undefined) {
            console.log(route.query.operator)
            navigateTo('/training/add/registration?training=' + data![0].id_train + '&operator=' + route.query.operator + '&date=' + event.data.date!)
        } else { navigateTo('/training/' + data![0].id_train) }
    }
}

const { data: teachers } = await sp.from('Teacher').select('id_teacher, name, surname')
const { data: competences } = await sp.from('Competences').select('id_comp, name')
const { data: confirmation } = await sp.from('Type_confirmation').select('id_conf, name')
const { data: typeTraining } = await sp.from('Type_training').select('id_type_train, name')
</script>

<template>
    <section>
        <PageHeader
            title="Training"
            title-link="/training/1"
            :other-links="[{
                label: 'Add new training',
                to: '/training/add'
            }]"
        />

        <div>
            <h2 class="text-xl text-center mb-5">
                Add new training
            </h2>

            <UForm
                class="space-y-4 flex flex-col items-center"
                :state="state"
                :validate="validate"
                @submit="onSubmit"
            >
                <UFormGroup
                    label="Name"
                    name="name"
                    required
                >
                    <UInput v-model="state.name" />
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
                    label="Duration (hours)"
                    name="duration"
                    required
                >
                    <UInput
                        v-model="state.duration"
                        type="number"
                    />
                </UFormGroup>

                <UFormGroup
                    label="Cost (€)"
                    name="cost"
                    required
                >
                    <UInput
                        v-model="state.cost"
                        type="number"
                    />
                </UFormGroup>

                <UFormGroup
                    label="Teacher"
                    name="id_teacher"
                    class="min-w-40"
                    required
                >
                    <USelectMenu
                        v-model="state.id_teacher"
                        :options="teachers?.map((t) => {
                            return {
                                id_teacher: t.id_teacher,
                                name: t.name + ' ' + t.surname,
                            }
                        })"
                        placeholder="Select a teacher"
                        option-attribute="name"
                        value-attribute="id_teacher"
                        searchable
                    />
                </UFormGroup>

                <UFormGroup
                    label="Competence"
                    name="id_comp"
                    class="min-w-40"
                    required
                >
                    <USelectMenu
                        v-model="state.id_comp"
                        :options="competences"
                        placeholder="Select a competence"
                        option-attribute="name"
                        value-attribute="id_comp"
                        searchable
                    />
                </UFormGroup>

                <UFormGroup
                    label="Confirmation type"
                    name="id_conf"
                    class="min-w-40"
                    required
                >
                    <USelectMenu
                        v-model="state.id_conf"
                        :options="confirmation"
                        placeholder="Select a confirmation type"
                        option-attribute="name"
                        value-attribute="id_conf"
                        searchable
                    />
                </UFormGroup>

                <UFormGroup
                    label="Type of training"
                    name="id_type_training"
                    class="min-w-40"
                    required
                >
                    <USelectMenu
                        v-model="state.id_type_training"
                        :options="typeTraining"
                        placeholder="Select a type of training"
                        option-attribute="name"
                        value-attribute="id_type_train"
                        searchable
                    />
                </UFormGroup>

                <UFormGroup
                    label="Topic"
                    name="topic"
                    required
                >
                    <UTextarea v-model="state.topic" />
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
