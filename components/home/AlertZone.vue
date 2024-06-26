<script setup lang="ts">
const sp = useSupabaseClient()

const validity = ref<any[]>([])
const expired = ref<any[]>([])

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
    expired.value = validity.value.filter((v: any) => {
        const now = new Date()
        const date = new Date(v.date)
        const diff = now.getTime() - date.getTime()
        const days = diff / (1000 * 3600 * 24)

        // tmp_validity is in days
        return days > v.Competence.Training[0].tmp_validity
    })

    // TODO: filter out near expiration (30 days) or select how many days
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
                    v-for="p in expired"
                    :key="p.id_pers"
                >
                    <div>
                        <UIcon
                            name="i-material-symbols-notifications-active"
                            class="text-red-500"
                        />

                        <UAlert
                            icon="i-heroicons-exclamation-triangle-16-solid"
                            type="error"
                            :title="p.Person.name + ' ' + p.Person.surname"
                            :description="$t('home.alertZone.expired', {
                                training: p.Competence.Training[0].name,
                                date: addDays(new Date(p.date), p.Competence.Training[0].tmp_validity).toLocaleDateString(),
                            })"
                        >
                            <template #description="{ description }">
                                <div class="flex justify-between items-center">
                                    <span
                                        class="text-center"
                                    >{{ description }}</span>

                                    <div class="flex gap-2">
                                        <UButton
                                            icon="i-heroicons-user-circle"
                                            :to="`/operator/${p.Person.id_pers}`"
                                        >
                                            {{ $t('home.alertZone.viewPerson') }}
                                        </UButton>

                                        <UButton
                                            icon="i-heroicons-arrow-path-20-solid"
                                            :label="$t('home.alertZone.renew')"
                                        />
                                    </div>
                                </div>
                            </template>
                        </UAlert>
                    </div>
                </li>
            </ul>
        </div>
    </UCard>
</template>
