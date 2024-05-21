<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import type { PropType } from 'vue'
type Operator = {
  name: string;
  id_op: number;
  id_pos: number;
  surname: string;
};

type Competence = {
  name: string;
  id_comp: number;
  tmp_validity: number;
};

type PositionComp = {
  id_pos: number;
  id_comp: number;
  mandatory: boolean;
  Competences: Competence;
};

type Position = {
  id_pos: number;
  name: string;
  Position_comp: PositionComp[];
  Operators: Operator[];
};

const props = defineProps({
    position: {
        type: Object as PropType<Position>,
        required: true,
    },
    isEditing: {
        type: Boolean,
        default: false,
    },
})
const isOpen = computed({
    get: () => props.isEditing,
    set: (value) => {
        if (!value) {
            emit('update')
            emit('close')
        }
    },
})

const emit = defineEmits(['update', 'close'])

const sp = useSupabaseClient()

type State = {
    name: string | undefined,
    competences: number[],
}

const { data: competences } = await sp.from('Competences').select('id_comp, name')

const state = reactive({
    name: props.position.name,
    competences: props.position.Position_comp.map(c => c.id_comp),
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

    const { error } = await sp.from('Position').update(insert as never).eq('id_pos', props.position.id_pos)

    if (error) {
        toast.add({
            title: 'Error updating position name',
            description: error.message,
            color: 'red',
            timeout: 2000,
        })
    } else {
        toast.add({
            title: 'Position name updated',
            description: `Position name has been updated to ${event.data.name}`,
            color: 'green',
        })
    }

    // update competences
    const toInsert = event.data.competences.map(c => ({
        id_pos: props.position.id_pos,
        id_comp: c,
        mandatory: props.position.Position_comp.find(pc => pc.id_comp === c)?.mandatory ?? false,
    }))

    await sp.from('Position_comp').delete().eq('id_pos', props.position.id_pos)
    const { error: error2 } = await sp.from('Position_comp').insert(toInsert as never)

    if (error2) {
        toast.add({
            title: 'Error updating competences',
            description: error2.message,
            color: 'red',
            timeout: 2000,
        })
    } else {
        toast.add({
            title: 'Competences updated',
            description: 'Position\'s Competences has been updated',
            color: 'green',
        })
    }

    loading.value = false
    isOpen.value = false
}
</script>

<template>
    <UModal
        v-model="isOpen"
    >
        <UCard class="overflow-y-auto">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Edit operator
                    </h3>

                    <UButton
                        color="gray"
                        variant="ghost"
                        icon="i-heroicons-x-mark-20-solid"
                        class="-my-1"
                        @click="isOpen = false"
                    />
                </div>
            </template>

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
                    label="Competences :"
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
                        searchable
                    />
                </UFormGroup>

                <UButton
                    :loading="loading"
                    type="submit"
                    label="Update"
                />
            </UForm>
        </UCard>
    </UModal>
</template>
