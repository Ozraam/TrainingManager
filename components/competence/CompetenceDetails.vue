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

const { data: trainings, error } = await sp.from('Training').select('cost, date, name, duration, Registration(Operators(name, surname, id_op), State(name)), Teacher(name, surname, id_teacher)').eq('id_comp', props.currentCompetence)

if (error) {
    throw error // TODO : Handle error
}

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

            <UAccordion :items="items">
                <template #item="{ item }">
                    <div>
                        <h5 class="text-xl">
                            {{ $t('competence.training.info') }}
                        </h5>

                        <div class="flex gap-5 items-center">
                            <p>
                                <strong>{{ $t('competence.training.instructor') }}</strong>

                                : <UButton
                                    :to="`/teacher/${item.training.Teacher.id_teacher}`"
                                    variant="link"
                                >
                                    {{ item.training.Teacher.name }} {{ item.training.Teacher.surname }}
                                </UButton>
                            </p>

                            <p>
                                <strong>{{ $t('competence.training.date') }}</strong> : {{ item.training.date }}
                            </p>

                            <p>
                                <strong>{{ $t('competence.training.duration') }}</strong> : {{ item.training.duration }} {{ $t('competence.training.hours') }}
                            </p>

                            <p>
                                <strong>{{ $t('competence.training.cost') }}</strong> : {{ item.training.cost }} €
                            </p>
                        </div>
                    </div>

                    <div>
                        <h5 class="text-xl">
                            {{ $t('competence.training.operators') }}
                        </h5>

                        <ul v-if="item.training.Registration.length > 0">
                            <li
                                v-for="operator in item.training.Registration"
                                :key="operator.id_op"
                            >
                                {{ operator.Operators.name }} {{ operator.Operators.surname }} - {{ operator.State.name }}
                            </li>
                        </ul>

                        <p v-else>
                            {{ $t('competence.training.noOperators') }}
                        </p>
                    </div>

                    <UButton
                        :label="$t('competence.training.edit')"
                        :to="`/training/${item.training.id_training}`"
                        variant="link"
                    />
                </template>
            </UAccordion>
        </div>
    </div>

    <div v-else>
        Error
    </div>
</template>
