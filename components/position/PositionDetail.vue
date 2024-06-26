<script setup lang="ts">
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
        required: true
    }
})

const UTableCompetences = computed(() => {
    return props.position.Position_comp.map((positionComp: PositionComp) => {
        return {
            Competence: positionComp.Competences.id_comp,
            Mandatory: positionComp.mandatory ? 'Yes' : 'No',
        }
    })
})

const UTableOperators = props.position.Operators.map((operator: Operator) => {
    return {
        Operator: operator.id_op,
    }
})

const sp = useSupabaseClient()
const toast = useToast()

const emit = defineEmits(['deleted'])

async function deletePosition() {
    // TODO : Maybe don't delete if there are operators assigned to this position
    const { data } = await sp.from('Operators').select('id_op').eq('id_pos', props.position.id_pos)
    if (data?.length) {
        toast.add({
            title: 'Error',
            description: 'There are operators assigned to this position',
            color: 'red',
        })
        return
    }
    sp.from('Position_comp').delete().eq('id_pos', props.position.id_pos).then(({ error }) => {
        if (error) {
            toast.add({
                title: 'Error',
                description: 'An error occurred while deleting the position',
                color: 'red',
            })
        } else {
            sp.from('Position').delete().eq('id_pos', props.position.id_pos).then(({ error }) => {
                if (error) {
                    toast.add({
                        title: 'Error',
                        description: 'An error occurred while deleting the position',
                        color: 'red',
                    })
                } else {
                    toast.add({
                        title: 'Success',
                        description: 'The position has been deleted',
                    })
                    emit('deleted')
                }
            })
        }
    })
}

const confirmationId = ref<string | null>(null)

function askConfirmation() {
    const actions = [
        {
            label: 'Delete Position',
            click: () => deletePosition()
        }, {
            label: 'Cancel',
            click: () => toast.remove(confirmationId.value!)
        }
    ]
    confirmationId.value = toast.add({
        title: 'Are you sure?',
        description: 'This action cannot be undone',
        actions,
        color: 'red',
    }).id
}
const isEditing = ref(false)
function toggleEdit() {
    isEditing.value = !isEditing.value
}
</script>

<template>
    <UCard>
        <PositionEdit
            :position="position"
            :is-editing="isEditing"
            @close="toggleEdit"
            @update="$emit('deleted')"
        />

        <template
            #header
        >
            <div class="flex">
                <h2>{{ position.name }}</h2>

                <UButton
                    label="Delete"
                    size="2xs"
                    variant="ghost"
                    color="red"
                    icon="i-heroicons-trash-20-solid"
                    @click="askConfirmation"
                />

                <UButton
                    label="Edit"
                    size="2xs"
                    variant="ghost"
                    icon="i-heroicons-pencil-20-solid"
                    color="indigo"
                    @click="toggleEdit"
                />
            </div>
        </template>

        <div class="flex gap-3">
            <div>
                <h3>
                    Competences
                </h3>

                <UTable
                    :rows="UTableCompetences"
                >
                    <template #Competence-data="{ row }">
                        <UButton
                            variant="link"
                            :to="`/competence/${row.Competence}`"
                            color="leather"
                        >
                            {{ position.Position_comp.find((pc: PositionComp) => pc.id_comp === row.Competence)?.Competences.name }}
                        </UButton>
                    </template>
                </UTable>
            </div>

            <UDivider orientation="vertical" />

            <div>
                <h3>
                    Operators
                </h3>

                <UTable
                    :rows="UTableOperators"
                >
                    <template #Operator-data="{ row }">
                        <UButton
                            variant="link"
                            :to="`/operator/${row.Operator}`"
                            color="leather"
                        >
                            {{ position.Operators.find((op: Operator) => op.id_op === row.Operator)?.name }}
                        </UButton>
                    </template>
                </UTable>
            </div>
        </div>
    </UCard>
</template>
