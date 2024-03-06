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
    route.query.position ? parseInt(route.query.position as string) : 0
)

const { data } = await sp.from('Position').select('*')

const positions : {id_pos: number, name: string}[] | null = data

positions?.unshift({ id_pos: 0, name: 'All' })

const currentOperatorUserFriendly = ref(props.currentOperator)

const UTableRoles = positions?.map((position) => {
    return {
        position: position.id_pos
    }
})

function selectRole(row: { position: number }) {
    selectedPosition.value = row.position
}

function selectOperator(row: { operator: number }) {
    if (row.operator.toString() === currentOperatorUserFriendly.value) {
        return
    }

    emit('load-operator')
    currentOperatorUserFriendly.value = row.operator.toString()
    navigateTo(`/operator/${row.operator}?position=${selectedPosition.value}`)
}

function firstLetterToUpperCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const { data: dataOp } = await sp.from('Operators').select('*')

const operators : {id_op: number, name: string, surname: String, id_pos: number}[] | null = dataOp

// const operator = operators?.find(operator => operator.id_pers.toString() === props.currentOperator)

const UTableOperators = operators?.map((operator) => {
    return {
        operator: operator.id_op
    }
})

const filteredOperators = computed(() => {
    if (selectedPosition.value === 0) {
        return UTableOperators
    }

    return UTableOperators?.filter((operatorT) => {
        return operators!.find(operator => operator.id_op === operatorT.operator)!.id_pos === selectedPosition.value
    })
})

function getOperatorFullName(operatorId: number) {
    return operators!.find(operator => operator.id_op === operatorId)!.name + ' ' + operators!.find(operator => operator.id_op === operatorId)!.surname
}
</script>

<template>
    <section>
        <div class="flex h-full">
            <UTable
                :rows="UTableRoles"
                label="Role"
                class="border-r-2 border-gray-200 dark:border-gray-800"
                @select="selectRole"
            >
                <template #position-data="{ row }">
                    <div
                        :class="{ 'text-primary': selectedPosition == row.position }"
                    >
                        {{ firstLetterToUpperCase(positions![row.position].name) }}
                    </div>
                </template>
            </UTable>

            <UTable
                :rows="filteredOperators"
                label="Role"
                class="border-r-2 border-gray-200 dark:border-gray-800"
                @select="selectOperator"
            >
                <template #operator-data="{ row }">
                    <div
                        :class="{ 'text-primary': currentOperatorUserFriendly == row.operator }"
                    >
                        {{ firstLetterToUpperCase(getOperatorFullName(row.operator)) }}
                    </div>
                </template>
            </UTable>
        </div>
    </section>
</template>
