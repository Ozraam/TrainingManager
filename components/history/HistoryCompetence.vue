<script setup lang="ts">
const props = defineProps({
    competence: {
        type: Object as PropType<{ value: number, label: string }>,
        required: true
    }
})

const sp = useSupabaseClient()
const toast = useToast()

async function fetchHistory() {
    const { data, error } = await sp.from('Competences').select('*, Training(*, Registration(*, Operators(*), State(*)))').eq('id_comp', props.competence.value) as any

    if (error) {
        toast.add({
            title: 'Error',
            description: error.message,
            color: 'red'
        })
        return
    }

    // process the data to have an object for each date of registration but I want training
    const history = data[0].Training.reduce((acc: any, training: any) => {
        return training.Registration.reduce((acc: any, reg: any) => {
            const date = new Date(reg.date)
            const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            if (!acc[key]) {
                acc[key] = []
            }
            acc[key].push({
                reg,
                training
            })
            return acc
        }, acc)
    }, {})

    return history
}

const competenceData : Ref<any> = ref(null)

fetchHistory().then((data) => {
    competenceData.value = data
})

watch(() => props.competence, async () => {
    competenceData.value = await fetchHistory()
})
</script>

<template>
    <div v-if="competenceData">
        <h2 class="text-xl">
            History of
            <UButton
                variant="link"
                size="xl"
                class="m-0 p-0 text-xl"
                :to="'/competence/' + competence.value"
            >
                {{ competence.label }}
            </UButton>
        </h2>

        <div
            v-if="Object.keys(competenceData).length"
            class="flex gap-3 flex-wrap mt-4"
        >
            <UCard
                v-for="[date, registrations] in Object.entries(competenceData).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())"
                :key="registrations[0].training.id_train + date"
            >
                <template #header>
                    <h3>
                        {{ new Date(date).toLocaleDateString() }}
                    </h3>
                </template>

                <div class="flex flex-col gap-2">
                    <div
                        v-for="registration in registrations"
                        :key="registration.reg.id_op + registration.training.id_train"
                        class="flex gap-1"
                    >
                        <UButton
                            :to="'/training/' + registration.training.id_train"
                            variant="link"
                            class="p-0 m-0"
                        >
                            {{ registration.training.name }}
                        </UButton>
                        |
                        <UButton
                            :to="'/operator/' + registration.reg.id_op"
                            variant="link"
                            class="p-0 m-0"
                        >
                            {{ registration.reg.Operators.name }} {{ registration.reg.Operators.surname }}
                        </UButton>
                        |
                        <p>
                            {{ registration.reg.State.name }}
                        </p>
                    </div>
                </div>
            </UCard>
        </div>

        <div v-else>
            <p>
                No history for this competence
            </p>
        </div>
    </div>
</template>
