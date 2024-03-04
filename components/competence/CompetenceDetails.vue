<script setup lang="ts">
const props = defineProps({
    currentCompetence: {
        type: String,
        required: true,
    },
})

const sp = useSupabaseClient()

const { data } = await sp.from('Competence').select('*').eq('id_comp', props.currentCompetence)

// TODO : Change this File when new data structure is available

const competecence : Ref<{ id_comp: number, name: string, id_role: number, frequency: number } | null> = ref(data?.[0] ?? null)

const { data: data2 } = await sp.from('Role').select('*')

const roles : Ref<{ id_role: number, name: string, check: boolean }[] | null> = ref(data2)

roles.value?.forEach((role) => {
    role.check = competecence.value?.id_role === role.id_role
})

// TODO : This lack of data for the full structure of the competence, this is a placeholder
const { data: data3 } = await sp.from('Training').select('*').eq('id_comp', props.currentCompetence)

const trainings : Ref<{ id_train: number, name: string }[] | null> = ref(data3)

competecence.value!.frequency = 365
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
                    v-model="competecence.frequency"
                    type="number"
                >
                    <template #trailing>
                        <span class="text-gray-500 dark:text-gray-400 text-xs">{{ $t('competence.days') }}</span>
                    </template>
                </UInput>
            </h3>

            <div>
                <h4>{{ $t('competence.position') }}</h4>

                <ul>
                    <li
                        v-for="role in roles"
                        :key="role.id_role"
                    >
                        <UCheckbox
                            v-model="role.check"
                            :name="role.name"
                            :label="role.name"
                        />
                    </li>
                </ul>
            </div>
        </div>

        <div class="mt-3">
            <h4>{{ $t('competence.training.title') }}</h4>

            <ul>
                <li
                    v-for="training in trainings"
                    :key="training.id_train"
                >
                    <UCard class="flex gap-5">
                        <div class="flex gap-5">
                            <p>{{ training.name }}</p>

                            <UButton
                                :label="$t('competence.training.edit')"
                                :to="`/training/${training.id_train}`"
                                variant="link"
                            />
                        </div>
                    </UCard>
                </li>
            </ul>
        </div>
    </div>

    <div v-else>
        Error
    </div>
</template>
