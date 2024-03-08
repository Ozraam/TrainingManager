<script setup lang="ts">
const sp = useSupabaseClient()

const props = defineProps({
    currentTraining: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['load-operator'])

const route = useRoute()

const selectedPosition = ref(
    route.query.position ? parseInt(route.query.position as string) : undefined
)

const selectedCompetence = ref(
    route.query.competence ? parseInt(route.query.competence as string) : undefined
)

const { data } = await sp.from('Position').select('*')

const positions : {id_pos: number, name: string}[] | null = data
const selectedItem = ref<Array<number | undefined>>([selectedPosition.value, selectedCompetence.value, parseInt(props.currentTraining)])
const currentTrainingUserFriendly = ref(props.currentTraining)

function selectTraining(row: Array<number | undefined>) {
    selectedItem.value = row

    if (row[2]!.toString() === currentTrainingUserFriendly.value) {
        return
    }

    emit('load-operator')
    currentTrainingUserFriendly.value = row[2]!.toString()

    const position = row[0] ? `position=${row[0]}` : ''
    const competence = row[1] ? `competence=${row[1]}` : ''

    const query = position && competence ? `?${position}&${competence}` : position || competence ? `?${position || competence}` : ''

    navigateTo(`/training/${row[2]}${query}`)
}

function firstLetterToUpperCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const { data: dataCo } = await sp.from('Competences').select('*, Position_comp(*)')

// TODO : Refactor this to have TS types
const competences : {
    id_comp: number,
    name: string,
    tmp_validity: number,
    Position_comp: {
        id_comp: number,
        id_pos: number,
        mandatory: boolean
    }[]
}[] | null = dataCo

const { data: dataTr } = await sp.from('Training').select('*, Competences(*)')

const trainings : {
    id_train: number,
    name: string,
    Competences: {
        id_comp: number,
        name: string,
        tmp_validity: number,
    }
}[] | null = dataTr

const stageSelectorObject = {
    label: 'Position',
    items: positions!.map((position) => {
        return {
            id: position.id_pos,
            name: firstLetterToUpperCase(position.name),
            filterIds: [0]
        }
    }),
    next: {
        label: 'Competence',
        items: competences!.map((competence) => {
            return {
                id: competence.id_comp,
                name: competence.name,
                filterIds: competence.Position_comp.map(position => position.id_pos)
            }
        }),
        next: {
            label: 'Training',
            items: trainings!.map((training) => {
                return {
                    id: training.id_train,
                    name: training.name,
                    filterIds: [training.Competences.id_comp]
                }
            }),
            next: null
        }
    }
}
</script>

<template>
    <StageSelector
        :stages="stageSelectorObject"
        :selected="selectedItem"
        @select="selectTraining"
    />
</template>
