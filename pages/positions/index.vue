<script setup lang="ts">
const sp = useSupabaseClient()

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

const positions : Ref<Position[]> = ref([])
const fetchPositions = async () => {
    const { data, error } = await sp.from('Position').select('*, Position_comp(*, Competences(*)), Operators(*)').order('id_pos')
    if (error) {
        // eslint-disable-next-line no-console
        console.error(error)
    } else {
        positions.value = data
    }
}

onMounted(fetchPositions)
</script>

<template>
    <section class="">
        <PageHeader
            title="Positions"
            title-link="/positions"
            :other-links="[
                {
                    label: 'Add new position',
                    to: '/positions/add'
                }
            ]"
        />

        <div class="flex flex-wrap gap-3 m-3">
            <PositionDetail
                v-for="position in positions"
                :key="position.id_pos"
                :position="position"
                @deleted="fetchPositions"
            />
        </div>
    </section>
</template>
