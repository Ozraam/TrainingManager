<script setup lang="ts">
const sp = useSupabaseClient()

const route = useRoute()

const trainingId = ref(route.query.training)

if (!trainingId.value) {
    navigateTo('/')
}
const training = ref<Training>()

onMounted(async () => {
    const { data, error } = await sp.from('Training').select('*, Competences(*), Registration(*, Operators(*), State(*))').eq('id_train', trainingId.value).single()
    if (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        return
    }

    training.value = data
})
</script>

<template>
    <section class="m-3">
        <div
            v-if="training"
            class="gap-5"
        >
            <div class="mx-auto text-center">
                <h1 class="text-2xl">
                    {{ firstLetterToUpperCase(training.Competences.name) }}
                </h1>

                <h2>
                    {{ training.name }}
                </h2>
            </div>

            <div>
                <span class="text-xl">Opetators :</span>

                <ul class="flex flex-wrap">
                    <li
                        v-for="registration in training.Registration"
                        :key="registration.Operators.name"
                    >
                        <UCard>
                            <div
                                v-if="!registration.Operators.deleted"
                                class="flex gap-3"
                            >
                                <span>{{ registration.Operators.name }} {{ registration.Operators.surname }}</span>

                                <span>{{ registration.State.name }}</span>
                            </div>

                            <div
                                v-else
                                class="flex gap-3"
                            >
                                <span>Deleted operator</span>

                                <span>{{ registration.State.name }}</span>
                            </div>
                        </UCard>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>
