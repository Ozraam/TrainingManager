<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const sp = useSupabaseClient()

const { data: positions } = await sp.from('Position').select('id_pos, name')

const state = reactive({
    name: undefined,
    surname: undefined,
    idPos: undefined,
})

type State = {
    name: string | undefined,
    surname: string | undefined,
    idPos: number | undefined
}

function validate(state: State): FormError[] {
    const errors: FormError[] = []

    if (state.name ? state.name.trim() === '' : true) {
        errors.push({
            path: 'name',
            message: 'Name is required',
        })
    }

    if (state.surname ? state.surname.trim() === '' : true) {
        errors.push({
            path: 'surname',
            message: 'Surname is required',
        })
    }

    if (state.idPos === undefined) {
        errors.push({
            path: 'idPos',
            message: 'Position is required',
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
            surname: event.data.surname!,
            id_pos: event.data.idPos!,
        }
    ]

    const { data, error } = await sp.from('Operators').insert(insert as never).select('id_op')

    if (error) {
        loading.value = false
        console.error(error)
        toast.add({
            title: 'Error',
            description: 'An error occurred',
            icon: 'i-heroicons-face-frown-solid',
            color: 'red',
        })
    } else {
        toast.add({
            title: 'Operator added',
            description: 'The operator has been added',
            icon: 'i-icon-park-solid-success',
        })
        navigateTo('/operator/' + data![0].id_op)
    }
}
</script>

<template>
    <section>
        <PageHeader
            title="Opetators"
            title-link="/operator/1"
            :other-links="[{
                label: 'Add new operator',
                to: '/operator/add'
            }]"
        />

        <div>
            <h2 class="text-xl text-center mb-5">
                Add new competence
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
                    required
                    label="Surname"
                    name="surname"
                >
                    <UInput v-model="state.surname" />
                </UFormGroup>

                <UFormGroup
                    label="Position"
                    name="idPos"
                    class="min-w-40"
                    required
                >
                    <USelectMenu
                        v-model="state.idPos"
                        :options="positions"
                        placeholder="Select a position"
                        option-attribute="name"
                        value-attribute="id_pos"
                        searchable
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
