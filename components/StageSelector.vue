<script setup lang="ts">
import type { StageSelector } from '#build/components'

type SelectorStage = {
    label: string;
    items: { id: number, name: string, filterIds: number[] }[],
    next: SelectorStage | null,
}

const props = defineProps({
    stages: {
        type: Object as PropType<SelectorStage>,
        required: true,
    },
    filterId: {
        type: Number,
        required: false,
        default: null,
    },
    selected: {
        type: Array as PropType<(number | undefined)[]>,
        required: false,
        default: () => [undefined],
    },
})

const next : Ref<InstanceType<typeof StageSelector> | null> = ref(null)

const emit = defineEmits(['select'])

function selectStage(row: { item: number | undefined }) {
    let selectedList = [row.item]

    if (next.value) {
        selectedList = selectedList.concat(next.value.getSelected())
    }

    emit('select', selectedList)
}

function getSelected() {
    let selectedList = [props.selected[0]]

    if (next.value) {
        selectedList = selectedList.concat(next.value.getSelected())
    }

    return selectedList
}

defineExpose({ getSelected })

const rows = computed(() => {
    const table : { item: number | undefined }[] = props.stages.items
        .filter(item => item.filterIds.includes(props.filterId) || props.filterId === undefined || props.filterId === null)
        .map((item) => {
            return {
                item: item.id,
            }
        })

    if (props.stages.next) {
        table.unshift({
            item: undefined,
        })
    }

    return table
})

function childSelectStage(selected: (number | undefined)[]) {
    selected.unshift(props.selected[0])
    emit('select', selected)
}
</script>

<template>
    <section class="flex h-full">
        <UTable
            :rows="rows"
            class="border-r-2 border-gray-200 dark:border-gray-800"
            @select="selectStage"
        >
            <template #item-header>
                <span>
                    {{ props.stages.label }}
                </span>
            </template>

            <template #item-data="{ row }">
                <span :class="{ 'text-primary': row.item === selected[0] }">
                    {{ row.item == undefined ? 'All' : props.stages.items.find(item => item.id === row.item)?.name }}
                </span>
            </template>
        </UTable>

        <StageSelector
            v-if="props.stages.next"
            ref="next"
            :stages="props.stages.next"
            :filter-id="selected[0]"
            :selected="selected.slice(1)"
            @select="childSelectStage"
        />
    </section>
</template>
