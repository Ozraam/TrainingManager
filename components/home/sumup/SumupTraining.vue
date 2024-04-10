<script setup lang="ts">
const props = defineProps({
    training: {
        type: Object as PropType<Training>,
        required: true
    }
})

defineEmits(['update'])

const numberOfTrainingDone = ref(props.training.Registration.filter(registration => registration.State.name === 'done').length)
const numberOfTrainingDelayed = ref(props.training.Registration.filter(registration => registration.State.name === 'delayed').length)
</script>

<template>
    <div>
        <div class="flex justify-between items-center gap-4">
            <UButton
                :to="`/training/${training.id_train}`"
                variant="link"
            >
                {{ training.name }}
            </UButton>

            <div>
                <span class="text-gray-500 dark:text-gray-400 flex text-center">
                    <div class="flex flex-col">
                        <span>
                            Done
                        </span>

                        <span>
                            {{ numberOfTrainingDone }}
                        </span>
                    </div>

                    <UDivider
                        orientation="vertical"
                        size="md"
                    />

                    <div class="flex flex-col">
                        <span>
                            Delayed
                        </span>

                        <span>
                            {{ numberOfTrainingDelayed }}
                        </span>
                    </div>

                    <UDivider
                        orientation="vertical"
                        size="md"
                    />

                    <div>
                        <span>
                            Total
                        </span>

                        <span>
                            {{ training.Registration.length }}
                        </span>
                    </div>

                </span>
            </div>

            <div>
                Date: {{ new Date(training.date).toLocaleDateString() }}
            </div>

            <UButton
                label="See more detail"
                :to="`/dashboard-detail?training=${training.id_train}`"
                variant="link"
            />
        </div>
    </div>
</template>
