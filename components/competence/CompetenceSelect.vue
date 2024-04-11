<script setup lang="ts">
const sp = useSupabaseClient()

const props = defineProps({
    currentCompetence: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['load-operator'])

const route = useRoute()

const selectedPosition = ref(
    route.query.position ? parseInt(route.query.position as string) : undefined
)

const { data } = await sp.from('Position').select('*').neq('id_pos', 0)

const positions : {id_pos: number, name: string}[] | null = data
const selectedItem = ref<Array<number | undefined>>([selectedPosition.value, parseInt(props.currentCompetence)])
const currentCompetenceUserFriendly = ref(props.currentCompetence)

function selectCompetence(row: Array<number | undefined>) {
    selectedItem.value = row
    if (row[1]!.toString() === currentCompetenceUserFriendly.value) {
        return
    }

    emit('load-operator')
    currentCompetenceUserFriendly.value = row[1]!.toString()

    const position = row[0] ? `?position=${row[0]}` : ''

    navigateTo(`/competence/${row[1]}${position}`)
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
        next: null
    }
}
</script>

<template>
    <StageSelector
        :stages="stageSelectorObject"
        :selected="selectedItem"
        @select="selectCompetence"
    />
</template>
