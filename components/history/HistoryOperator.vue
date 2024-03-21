<script setup lang="ts">
const props = defineProps({
    operator: {
        type: Object as PropType<{ value: number, label: string, id_op: number, name: string, surname: string }>,
        required: true
    }
})

const sp = useSupabaseClient()
const toast = useToast()

async function fetchHistory() {
    const { data, error } = await sp.from('Operators').select('*, Registration(*, Training(*, Competences(*)), State(*)), Position(*)').eq('id_op', props.operator.value) as any

    if (error) {
        toast.add({
            title: 'Error',
            description: error.message,
            color: 'red'
        })
        return
    }

    // process the data to have an object for each date
    const history = data[0].Registration.reduce((acc: any, reg: any) => {
        const date = new Date(reg.date)
        const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(reg)
        return acc
    }, {})

    return history
}

const operatorData = ref({})

fetchHistory().then((data) => {
    operatorData.value = data
})

watch(() => props.operator, async () => {
    operatorData.value = await fetchHistory()
})
</script>

<template>
    <div>
        <h2 class="text-xl">
            History of
            <UButton
                variant="link"
                size="xl"
                class="m-0 p-0 text-xl"
                :to="'/operator/' + operator.value"
            >
                {{ operator.label }}
            </UButton>
        </h2>

        <div
            v-if="Object.keys(operatorData).length"
            class="flex gap-3 flex-wrap mt-4"
        >
            <UCard
                v-for="[date, registrations] in Object.entries(operatorData).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())"
                :key="date"
            >
                <template #header>
                    <h3>
                        {{ new Date(date).toLocaleDateString() }}
                    </h3>
                </template>

                <div class="flex flex-col gap-2">
                    <div
                        v-for="registration in registrations"
                        :key="registration.id_train"
                    >
                        <span>
                            <UButton
                                variant="link"
                                class="m-0 p-0"
                                :to="'/training/' + registration.Training.id_train"
                            >
                                {{ registration.Training.name }}
                            </UButton>
                            - {{ registration.State.name }}
                        </span>
                    </div>
                </div>
            </UCard>
        </div>

        <div v-else>
            <p>
                No history for this operator
            </p>
        </div>
    </div>
</template>
