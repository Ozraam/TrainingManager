<script setup lang="ts">
const props = defineProps({
    positions: {
        type: Object as PropType<{ value: number, label: string }[]>,
        required: true
    }
})

const sp = useSupabaseClient()
const toast = useToast()

async function fetchPositions() {
    const { data, error } = await sp.from('Position').select('*, Operators(*, Registration(*, Training(*), State(*)))').neq('id_pos', 0).eq('Operators.deleted', 0)

    if (error) {
        toast.add({
            title: 'Error',
            description: error.message,
            color: 'red'
        })
        return
    }

    // for each position, I want to have the history of the registration {position: 'name', history: {date: [registration]}}
    const history = data.filter((p: any) => props.positions.some(pos => pos.value === p.id_pos)).map((p: any) => {
        return {
            position: { id_pos: p.id_pos, name: p.name },
            history: p.Operators.reduce((acc: any, op: any) => {
                return op.Registration.reduce((acc: any, reg: any) => {
                    const date = new Date(reg.date)
                    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                    if (!acc[key]) {
                        acc[key] = []
                    }
                    acc[key].push({
                        reg,
                        training: reg.Training,
                        op
                    })
                    return acc
                }, acc)
            }, {})
        }
    })

    return history
}

const positionsData : Ref<any> = ref([])

fetchPositions().then((data) => {
    positionsData.value = data
})

watch(() => props.positions, async () => {
    positionsData.value = await fetchPositions()
})
</script>

<template>
    <div class="flex flex-col gap-5">
        <div
            v-for="history in positionsData"
            :key="history.position.id_pos"
        >
            <h2 class="text-xl">
                History of
                <UButton
                    variant="link"
                    size="xl"
                    class="m-0 p-0 text-xl"
                    :to="'/positions'"
                    color="leather"
                >
                    {{ history.position.name }}
                </UButton>
            </h2>

            <div
                v-if="Object.keys(history.history).length"
                class="flex gap-3 flex-wrap mt-4"
            >
                <UCard
                    v-for="[date, registrations] in Object.entries(history.history).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())"
                    :key="date"
                >
                    <template #header>
                        <h3>
                            {{ new Date(date).toLocaleDateString() }}
                        </h3>
                    </template>

                    <div class="flex flex-col gap-2">
                        <div
                            v-for="registration in (registrations as any)"
                            :key="registration.reg.id_op"
                        >
                            <div class="flex gap-1">
                                <UButton
                                    :to="'/training/' + registration.training.id_train"
                                    variant="link"
                                    class="p-0 m-0"
                                    color="leather"
                                >
                                    {{ registration.training.name }}
                                </UButton>
                                |
                                <UButton
                                    :to="'/operator/' + registration.op.id_op"
                                    variant="link"
                                    class="p-0 m-0"
                                    color="leather"
                                >
                                    {{ registration.op.name }} {{ registration.op.surname }}
                                </UButton>
                                |
                                <p>
                                    {{ registration.reg.State.name }}
                                </p>
                            </div>
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
    </div>
</template>
