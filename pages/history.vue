<script setup lang="ts">
const historyChoices = ref([
    { label: 'Operator', value: 1 },
    { label: 'Competence', value: 2 },
    { label: 'Positions', value: 3 },
])
const operators = ref([])
const selectedOperator: Ref<{value: number, label: string, id_op: number, name: string, surname: string }> = ref({
    value: 0,
    label: '',
    id_op: 0,
    name: '',
    surname: ''
})

const competence = ref([])
const selectedCompetence = ref({})

const positions = ref([])
const selectedPosition = ref({})

const sp = useSupabaseClient()

async function fetchHistory() {
    const { data: operatorsData } = await sp.from('Operators').select('id_op, name, surname') as any

    const { data: competenceData } = await sp.from('Competences').select('id_comp, name') as any

    const { data: positionsData } = await sp.from('Position').select('id_pos, name') as any

    operators.value = operatorsData.map((o: any) => ({
        label: `${o.name} ${o.surname}`,
        value: o.id_op
    }))
    selectedOperator.value = operators.value[0]

    competence.value = competenceData.map((c: any) => ({
        label: c.name,
        value: c.id_comp
    }))
    selectedCompetence.value = competence.value[0]

    positions.value = positionsData.map((p: any) => ({
        label: p.name,
        value: p.id_pos,
        ...p
    }))
    selectedPosition.value = positions.value[0]
}

onMounted(fetchHistory)

const selected = ref(1)
</script>

<template>
    <section>
        <PageHeader
            title="History"
            title-link="/history"
        />

        <div class="m-3">
            <div class="flex gap-5">
                <URadio
                    v-for="choice in historyChoices"
                    :key="choice.value"
                    v-model="selected"
                    v-bind="choice"
                    class="flex items-center"
                >
                    <template #label>
                        <USelectMenu
                            v-if="choice.value === 1"
                            v-model="selectedOperator"
                            placeholder="Select an option"
                            :options="operators"
                        />

                        <USelectMenu
                            v-if="choice.value === 2"
                            v-model="selectedCompetence"
                            placeholder="Select an option"
                            :options="competence"
                        />

                        <USelectMenu
                            v-if="choice.value === 3"
                            v-model="selectedPosition"
                            placeholder="Select an option"
                            :options="positions"
                        />
                    </template>
                </URadio>
            </div>

            <div class="mt-5">
                <HistoryOperator
                    v-if="selected === 1"
                    :operator="selectedOperator"
                />
            </div>
        </div>
    </section>
</template>
