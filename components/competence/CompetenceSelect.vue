<script setup lang="ts">
const sp = useSupabaseClient()

const props = defineProps({
    currentCompetence: {
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

console.log(roles)

const currentCompetenceUserFriendly = ref(props.currentCompetence)

const UTableRoles = roles?.map((role) => {
    return {
        role: role.id_role
    }
})

function selectRole(row: { role: number }) {
    selectedRole.value = row.role
}

function selectCompetence(row: { competence: number }) {
    currentCompetenceUserFriendly.value = row.competence.toString()
    navigateTo(`/competence/${row.competence}?role=${selectedRole.value}`)
}

function firstLetterToUpperCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const { data: dataCo } = await sp.from('Competence').select('*')

const competences : {id_comp: number, name: string, id_role: number}[] | null = dataCo

// const operator = operators?.find(operator => operator.id_pers.toString() === props.currentOperator)

const UTableCompetence = competences?.map((competence) => {
    return {
        competence: competence.id_comp
    }
})

const filteredCompetence = computed(() => {
    if (selectedRole.value === 0) {
        return UTableCompetence
    }

    return UTableCompetence?.filter((competenceT) => {
        return competences!.find(competence => competence.id_comp === competenceT.competence)!.id_role === selectedRole.value
    })
})
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
                :rows="filteredCompetence"
                label="Role"
                class="border-r-2 border-gray-200 dark:border-gray-800"
                @select="selectCompetence"
            >
                <template #competence-data="{ row }">
                    <div
                        :class="{ 'text-primary': currentCompetenceUserFriendly == row.competence }"
                    >
                        {{ firstLetterToUpperCase(competences!.find(competence => competence.id_comp === row.competence)!.name) }}
                    </div>
                </template>
            </UTable>
        </div>
    </section>
</template>
