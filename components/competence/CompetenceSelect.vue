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
    route.query.position ? parseInt(route.query.position as string) : 0
)

const { data } = await sp.from('Position').select('*')

const positions : {id_pos: number, name: string}[] | null = data

positions?.unshift({ id_pos: 0, name: 'All' })

const currentCompetenceUserFriendly = ref(props.currentCompetence)

const UTableRoles = positions?.map((position) => {
    return {
        position: position.id_pos
    }
})

function selectRole(row: { position: number }) {
    selectedRole.value = row.position
}

function selectCompetence(row: { competence: number }) {
    currentCompetenceUserFriendly.value = row.competence.toString()
    navigateTo(`/competence/${row.competence}?position=${selectedRole.value}`)
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
        return competences!.find(competence => competence.id_comp === competenceT.competence)!.Position_comp.some(
            position => position.id_pos === selectedRole.value
        )
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
                <template #position-data="{ row }">
                    <div
                        :class="{ 'text-primary': selectedRole == row.position }"
                    >
                        {{ firstLetterToUpperCase(positions![row.position].name) }}
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
