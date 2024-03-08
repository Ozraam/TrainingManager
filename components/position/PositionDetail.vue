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
  madatory: boolean;
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

const UTableCompetences = props.position.Position_comp.map((positionComp: PositionComp) => {
    return {
        Competence: positionComp.Competences.id_comp,
        Mandatory: positionComp.madatory ? 'Yes' : 'No',
    }
})

const UTableOperators = props.position.Operators.map((operator: Operator) => {
    return {
        Operator: operator.id_op,
    }
})
</script>

<template>
    <UCard>
        <template #header>
            <h2>{{ position.name }}</h2>
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
                        >
                            {{ position.Operators.find((op: Operator) => op.id_op === row.Operator)?.name }}
                        </UButton>
                    </template>
                </UTable>
            </div>
        </div>
    </UCard>
</template>
