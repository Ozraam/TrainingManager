<script setup lang="ts">
const sp = useSupabaseClient()

const validity = ref<any[]>([])

onMounted(async () => {
    const { data, error } = await sp.from('Validity').select('*, Person (*), Competence (*, Training (*))')

    if (error) {
        validity.value = [
            {
                id_pers: 1,
                id_comp: 1,
                verified: false,
                date: new Date('2021-01-01T00:00:00.000Z'),
                Person: {
                    id: 1,
                    name: 'John',
                    surname: 'Doe',
                    id_role: 1,
                },
                Competence: {
                    id_comp: 1,
                    name: 'painting',
                    id_role: 1,
                    Training: {
                        id_train: 1,
                        name: 'painting',
                        tmp_validity: 365,
                        id_comp: 1,
                    },
                }
            }
        ]
    } else {
        validity.value = data
    }

    // filter out not expired
    validity.value = validity.value.filter((v: any) => {
        const now = new Date()
        const date = new Date(v.date)
        const diff = now.getTime() - date.getTime()
        const days = diff / (1000 * 3600 * 24)

        // tmp_validity is in days
        return days > v.Competence.Training[0].tmp_validity
    })
})

function addDays(date: Date, days: number) {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}
</script>

<template>
    <UCard
        :ui="{ rounded: '' }"
    >
        <template #header>
            <h2 class="text-lg font-semibold">
                {{ $t('home.alertZone.title') }}
            </h2>

            <h3>{{ $t('home.alertZone.description') }}</h3>
        </template>

        <div>
            <ul class="gap-2 flex flex-col">
                <li
                    v-for="v in validity"
                    :key="v.id_pers"
                >
                    <div>
                        <UIcon
                            name="i-material-symbols-notifications-active"
                            class="text-red-500"
                        />

                        <UAlert
                            type="error"
                            :title="v.Person.name + ' ' + v.Person.surname"
                            :description="$t('home.alertZone.expired', {
                                training: v.Competence.Training[0].name,
                                date: addDays(new Date(v.date), v.Competence.Training[0].tmp_validity).toLocaleDateString(),
                            })"
                        >
                            <template #description="{ description }">
                                <div class="flex justify-between">
                                    <span
                                        class="text-center"
                                    >{{ description }}</span>

                                    <UButton
                                        :label="$t('home.alertZone.renew')"
                                    />
                                </div>
                            </template>
                        </UAlert>
                    </div>
                </li>
            </ul>
        </div>
    </UCard>
</template>
