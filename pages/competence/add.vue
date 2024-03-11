<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const sp = useSupabaseClient()

type State = {
    name: string | undefined,
    tmp_validity: number | undefined,
    position: boolean[],
}

const { data: positions } = await sp.from('Position').select('id_pos, name')

const state = reactive({
    name: undefined,
    tmp_validity: 365,
    position: positions!.map(() => false),
})

function validate(state: State): FormError[] {
    const errors: FormError[] = []

    if (state.name ? state.name.trim() === '' : true) {
        errors.push({
            path: 'name',
            message: 'Name is required',
        })
    }

    if (state.tmp_validity ? state.tmp_validity < 1 : true) {
        errors.push({
            path: 'tmp_validity',
            message: 'Validity must be greater than 0',
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
            tmp_validity: event.data.tmp_validity!,
        }
    ]

    const { data, error } = await sp.from('Competences').insert(insert as never).select('id_comp')

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
        const idComp = data?.[0]?.id_comp
        if (idComp) {
            const insert = positions!.filter((_, i) => event.data.position[i]).map(pos => ({
                id_comp: idComp,
                id_pos: pos.id_pos,
                mandatory: false,
            }))

            const { error } = await sp.from('Position_comp').insert(insert as never).select()

            if (error) {
                loading.value = false
                sp.from('Competences').delete().eq('id_comp', idComp).then(() => {})
                console.error(error)
                toast.add({
                    title: 'Error',
                    description: 'An error occurred',
                    icon: 'i-heroicons-face-frown-solid',
                    color: 'red',
                })
            } else {
                toast.add({
                    title: 'Competence added',
                    description: 'The competence has been added',
                    icon: 'i-icon-park-solid-success',
                })
                navigateTo('/competence/' + idComp)
            }
        }
    }
}
</script>

<template>
    <section>
        <PageHeader
            title="Competences"
            title-link="/competence/1"
            :other-links="[{
                label: 'Add new competence',
                to: '/competence/add'
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
                    label="Validity in days"
                    name="tmp_validity"
                >
                    <UInput
                        v-model="state.tmp_validity"
                        type="number"
                    />
                </UFormGroup>

                <UFormGroup
                    label="Position"
                    name="position"
                >
                    <UCheckbox
                        v-for="(position, i) in positions"
                        :key="position.id_pos"
                        v-model="state.position[i]"
                        :label="firstLetterToUpperCase(position.name)"
                        :name="position.name"
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
