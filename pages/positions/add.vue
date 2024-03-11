<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const sp = useSupabaseClient()

type State = {
    name: string | undefined,
    competences: number[],
}

const { data: competences } = await sp.from('Competences').select('id_comp, name')

const state = reactive({
    name: undefined,
    competences: [],
})

function validate(state: State): FormError[] {
    const errors: FormError[] = []

    if (state.name ? state.name.trim() === '' : true) {
        errors.push({
            path: 'name',
            message: 'Name is required',
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
        }
    ]

    const { data, error } = await sp.from('Position').insert(insert as never).select('id_pos')

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
        // link competences
        const idPos = data![0].id_pos
        const insert = event.data.competences.map((idComp: number) => {
            return {
                id_pos: idPos,
                id_comp: idComp,
                mandatory: true,
            }
        })

        const { error } = await sp.from('Position_comp').insert(insert as never)

        if (error) {
            loading.value = false
            console.error(error)
            sp.from('Position').delete().eq('id_pos', idPos).then(() => {})
            toast.add({
                title: 'Error',
                description: 'An error occurred',
                icon: 'i-heroicons-face-frown-solid',
                color: 'red',
            })
        } else {
            toast.add({
                title: 'Position added',
                description: 'The position has been added',
                icon: 'i-icon-park-solid-success',
            })
            navigateTo('/positions')
        }
    }
}
</script>

<template>
    <section>
        <PageHeader
            title="Positions"
            title-link="/positions"
            :other-links="[{
                label: 'Add new position',
                to: '/positions/add'
            }]"
        />

        <div>
            <h2 class="text-xl text-center mb-5">
                Add new position
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
                    label="Position"
                    name="position"
                    class="min-w-40"
                    hint="Optional"
                >
                    <USelectMenu
                        v-model="state.competences"
                        :options="competences"
                        placeholder="Select a competence"
                        option-attribute="name"
                        value-attribute="id_comp"
                        multiple
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
