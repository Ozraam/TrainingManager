<script setup lang="ts">
type TrainingData = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        total: number;
    };
};
const props = defineProps({
    datasets: {
        type: Object as PropType<TrainingData>,
        required: true,
    },
})
</script>

<template>
    <div class="w-full">
        <div class="mb-2">
            <ul>
                <li
                    v-for="(label, i) in datasets.labels"
                    :key="label"
                    class="legend flex flex-row-reverse gap-1 items-center w-fit"
                    :style="{ '--bar-color': datasets.datasets.backgroundColor[i] }"
                >
                    <span class="text-xs">{{ label }}</span>
                </li>
            </ul>
        </div>

        <ul class="bar">
            <li
                v-for="(data, i) in datasets.datasets.data"
                :key="i"
                class="bar-item"
                :style="{
                    '--bar-width': data / datasets.datasets.total * 100 + '%',
                    '--bar-color': datasets.datasets.backgroundColor[i],
                }"
            >
                <UTooltip
                    :text="datasets.labels[i] + ' ' + data + ' / ' + datasets.datasets.total"
                    class="w-full h-full"
                >
                    <div class="w-full h-full">
                    <!--  -->
                    </div>
                </UTooltip>
            </li>
        </ul>
    </div>
</template>

<style lang="scss">
.bar {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    height: 40px;
    width: 100%;
    border: 1px solid #000;
}

.bar-item {
    height: 100%;
    background-color: var(--bar-color);
    width: var(--bar-width);
    border-right: 1px solid #000;
    transition: transform 0.1s, border 0.1s, width 0.5s;
}

.bar-item:last-child {
    border-right: none;
}

.bar-item:hover {
    transform: scale(1.1);
    border: 1px solid #000;
}

.legend::after {
    content: '';
    display: inline-block;
    width: 30px;
    height: 10px;
    background-color: var(--bar-color);
    margin-left: 5px;
    border: #000 1px solid;
}
</style>
