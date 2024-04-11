<script setup lang="ts">
const sp = useSupabaseClient()

const route = useRoute()

const trainingId = ref(route.query.training)

if (!trainingId.value) {
    navigateTo('/')
}
const training = ref<Training>()

const numberOfTrainingDone = ref(0)
const numberOfTrainingDelayed = ref(0)
const totalTraining = ref(0)

onMounted(async () => {
    const { data, error } = await sp.from('Training').select('*, Competences(*), Registration(*, Operators(*), State(*))').eq('id_train', trainingId.value).single()
    if (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        return
    }

    training.value = data

    numberOfTrainingDone.value = training.value.Registration.filter(registration => registration.State.name === 'done').length
    numberOfTrainingDelayed.value = training.value.Registration.filter(registration => registration.State.name === 'delayed').length
    totalTraining.value = training.value.Registration.length
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

                <div class="flex justify-center">
                    <div class="flex w-fit gap-3">
                        <div class="flex flex-col">
                            <span>Done</span>

                            <span>{{ numberOfTrainingDone }}</span>
                        </div>

                        <UDivider
                            orientation="vertical"
                            size="md"
                        />

                        <div class="flex flex-col">
                            <span>Delayed</span>

                            <span>{{ numberOfTrainingDelayed }}</span>
                        </div>

                        <UDivider
                            orientation="vertical"
                            size="md"
                        />

                        <div class="flex flex-col">
                            <span>Total</span>

                            <span>{{ totalTraining }}</span>
                        </div>
                    </div>
                </div>
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
