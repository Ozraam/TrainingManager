<script setup lang="ts">
defineProps<{
    yearsStat: YearData,
}>()

defineEmits(['update'])
</script>

<template>
    <section class="flex flex-col gap-2 w-full">
        <h2 class="text-center">
            {{ $t('home.recapTrainingList.title') }}
        </h2>

        <UAccordion :items="yearsStat.competences">
            <template #default="{ item, open }">
                <UButton
                    color="gray"
                    variant="ghost"
                    class="border-b border-gray-200 dark:border-gray-700"
                    :ui="{
                        rounded: 'rounded-none',
                        padding: { sm: 'p-3' }
                    }"
                >
                    <span class="truncate">{{ item.name }}</span>

                    <template #trailing>
                        <UIcon
                            name="i-heroicons-chevron-right-20-solid"
                            class="w-5 h-5 ms-auto transform transition-transform duration-200"
                            :class="[open && 'rotate-90']"
                        />
                    </template>
                </UButton>
            </template>

            <template #item="{ item }">
                <HomeSumupTraining
                    v-for="training in item.Training"
                    :key="training.name"
                    :training="training"
                    @update="$emit('update')"
                />
            </template>
        </UAccordion>
    </section>
</template>
