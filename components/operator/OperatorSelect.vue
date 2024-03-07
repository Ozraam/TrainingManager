<script setup lang="ts">
const sp = useSupabaseClient()

const props = defineProps({
    currentOperator: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['load-operator'])

const route = useRoute()

const selectedPosition = ref(
    route.query.position ? parseInt(route.query.position as string) : undefined
)

const { data } = await sp.from('Position').select('*')

const positions : {id_pos: number, name: string}[] | null = data

const currentOperatorUserFriendly = ref(props.currentOperator)

const selectedItem = ref<Array<number | undefined>>([selectedPosition.value, parseInt(props.currentOperator)])

function selectOperator(row: Array<number | undefined>) {
    selectedItem.value = row
    if (row[1]!.toString() === currentOperatorUserFriendly.value) {
        return
    }

    emit('load-operator')
    currentOperatorUserFriendly.value = row[1]!.toString()

    const position = row[0] ? `?position=${row[0]}` : ''

    navigateTo(`/operator/${row[1]}${position}`)
}

function firstLetterToUpperCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const { data: dataOp } = await sp.from('Operators').select('*')

const operators : {id_op: number, name: string, surname: String, id_pos: number}[] | null = dataOp

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
        label: 'Operator',
        items: operators!.map((operator) => {
            return {
                id: operator.id_op,
                name: operator.name + ' ' + operator.surname,
                filterIds: [operator.id_pos]
            }
        }),
        next: null
    }
}
</script>

<template>
    <section>
        <div class="flex h-full">
            <StageSelector
                :stages="stageSelectorObject"
                :selected="selectedItem"
                @select="selectOperator"
            />
        </div>
    </section>
</template>
