<script setup lang="ts">
import type { DatePickerDate } from 'v-calendar/dist/types/src/use/datePicker'
import { format } from 'date-fns'
const props = defineProps({
    modelValue: {
        type: [Date, Object] as PropType<DatePickerDate | null>,
        required: true,
    },
})

const emit = defineEmits(['update:model-value'])

const date = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:model-value', value)
    }
})
</script>

<template>
    <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton
            icon="i-heroicons-calendar-days-20-solid"
            :label="date ? format(date, 'dd/MM/yyyy') : 'Select date'"
        />

        <template #panel="{ close }">
            <DatePicker
                v-model="date"
                is-required
                @close="close"
            />
        </template>
    </UPopover>
</template>
