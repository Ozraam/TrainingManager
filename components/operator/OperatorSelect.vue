<script setup lang="ts">
const sp = useSupabaseClient()

const props = defineProps({
    currentOperator: {
        type: String,
        required: true,
    },
})

const route = useRoute()

const selectedRole = ref(
    route.query.role ? parseInt(route.query.role as string) : 0
)

const { data } = await sp.from('Role').select('*')

const roles : {id_role: number, name: string}[] | null = data

roles?.unshift({ id_role: 0, name: 'All' })

const currentOperatorUserFriendly = ref(props.currentOperator)

const UTableRoles = roles?.map((role) => {
    return {
        role: role.id_role
    }
})

function selectRole(row: { role: number }) {
    selectedRole.value = row.role
}

function selectOperator(row: { operator: number }) {
    currentOperatorUserFriendly.value = row.operator.toString()
    navigateTo(`/operator/${row.operator}?role=${selectedRole.value}`)
}

function firstLetterToUpperCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const { data: dataOp } = await sp.from('Person').select('*')

const operators : {id_pers: number, name: string, surname: String, id_role: number}[] | null = dataOp

// const operator = operators?.find(operator => operator.id_pers.toString() === props.currentOperator)

const UTableOperators = operators?.map((operator) => {
    return {
        operator: operator.id_pers
    }
})

const filteredOperators = computed(() => {
    if (selectedRole.value === 0) {
        return UTableOperators
    }

    return UTableOperators?.filter((operatorT) => {
        return operators!.find(operator => operator.id_pers === operatorT.operator)!.id_role === selectedRole.value
    })
})

function getOperatorFullName(operatorId: number) {
    return operators!.find(operator => operator.id_pers === operatorId)!.name + ' ' + operators!.find(operator => operator.id_pers === operatorId)!.surname
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
                <template #role-data="{ row }">
                    <div
                        :class="{ 'text-primary': selectedRole == row.role }"
                    >
                        {{ firstLetterToUpperCase(roles![row.role].name) }}
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
