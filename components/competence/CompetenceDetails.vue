<script setup lang="ts">
const props = defineProps({
    currentCompetence: {
        type: String,
        required: true,
    },
})

const sp = useSupabaseClient()

const { data } = await sp.from('Competences').select('*, Position_comp(*)').eq('id_comp', props.currentCompetence)

const competecence : Ref<{
    id_comp: number,
    name: string,
    tmp_validity: number,
    Position_comp: {
        id_comp: number,
        id_pos: number,
        mandatory: boolean
    }[]
} | null> = ref(data?.[0] ?? null)

const { data: data2 } = await sp.from('Position').select('*')

const positions : Ref<{ id_pos: number, name: string, check: boolean }[] | null> = ref(data2)

positions.value?.forEach((position) => {
    position.check = competecence.value?.Position_comp.some(comp => comp.id_pos === position.id_pos) ?? false
})

const initialPosition = positions.value?.map((position) => {
    return {
        id_pos: position.id_pos,
        check: position.check
    }
})

const isPositionChanged = computed(() => {
    return positions.value?.some((position, index) => {
        return position.check !== initialPosition?.[index].check
    })
})

function savePosition() {
    // TODO : This is a placeholder for the real save
}

// TODO : This lack of data for the full structure of the competence, this is a placeholder
const { data: trainings } = await sp.from('Training').select('cost, date, name, duration, Registration(Operators(name, surname, id_op)), Teacher(name, surname)').eq('id_comp', props.currentCompetence)

const items = ref(trainings.map((t) => {
    return {
        label: t.name,
        training: t
    }
}))
</script>

<template>
    <div
        v-if="competecence"
        class="m-3 grow"
    >
        <h2 class="text-2xl">
            {{ competecence!.name }}
        </h2>

        <div class="flex gap-10">
            <h3 class="gap-1">
                {{ $t('competence.frequency') }}: <UInput
                    v-model="competecence.tmp_validity"
                    type="number"
                >
                    <template #trailing>
                        <span class="text-gray-500 dark:text-gray-400 text-xs">{{ $t('competence.days') }}</span>
                    </template>
                </UInput>
            </h3>

            <div>
                <h4>{{ $t('competence.position.title') }}</h4>

                <ul>
                    <li
                        v-for="position in positions"
                        :key="position.id_pos"
                    >
                        <UCheckbox
                            v-model="position.check"
                            :name="position.name"
                            :label="position.name"
                        />
                    </li>
                </ul>

                <UButton
                    v-if="isPositionChanged"
                    :label="$t('competence.position.save')"
                    @click="savePosition"
                />
            </div>
        </div>

        <div class="mt-3">
            <h4>{{ $t('competence.training.title') }}</h4>

            <UAccordion :items="items" />
        </div>
    </div>

    <div v-else>
        Error
    </div>
</template>
