<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as excel from 'exceljs'
import type { StudyPlan } from '../../utils/types'
const tmp = ref<{ data: StudyPlan[] }>()
const page = ref<HTMLElement>()
const comp = ref<StudyPlan[][]>([])
async function fetchData() {
    try {
        tmp.value = await $fetch('/api/StudyPlanHelper', {
            method: 'POST',
            headers: useRequestHeaders(['cookie']),
            body: JSON.stringify({
                nbday: 50
            }),
        })

        if (tmp.value && tmp.value.data) {
            tmp.value.data.forEach((item) => {
                const i = comp.value.findIndex((el:StudyPlan[]) => el[0].id_comp === item.id_comp)
                if (i === -1) {
                    comp.value.push([item])
                } else {
                    comp.value[i].push(item)
                }
            })
        } else {
            // eslint-disable-next-line no-console
            console.error('Server response does not contain valid data.')
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error occured while fetching data:', error)
    }
}

function download() {
    const worksheet = new excel.Workbook()

    comp.value.forEach((items) => {
        const sheet = worksheet.addWorksheet(items[0].name)
        sheet.columns = [
            { header: 'Operator', key: 'operator', width: 24 },
            { header: 'Training of previous training', key: 'training', width: 24 },
            { header: 'Date of previous training', key: 'date', width: 24 },
            { header: 'State of previous training', key: 'state', width: 24 }
        ]
        const rows : any = []
        items.forEach((item) => {
            console.log(item.name_op + ' ' + item.surname)

            rows.push({
                operator: item.name_op.trim() + ' ' + item.surname,
                training: item.name_train ?? 'No previous training',
                date: item.date ?? '',
                state: item.name_state ?? ''
            })
        })
        sheet.addRows(rows)
        console.log(sheet.rowCount)
    })

    worksheet.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'study-plan.xlsx'
        a.click()
        URL.revokeObjectURL(url)

        setTimeout(() => {
            navigateTo('/study-plan')
        }, 1000)
    })
}

onMounted(async () => {
    await fetchData()
})
</script>

<template>
    <div
        class="flex justify-center gap-5 p-8"
    >
        <div
            ref="page"
            class="page text-black relative"
        >
            <h1 class="text-2xl font-bold text-center mb-10">
                Study Plan
            </h1>

            <div
                v-for="items in comp"
                :key="items[0].id_comp"
                class="flex justify-center gap-5 mb-5"
            >
                <div
                    class="flex flex-col gap-5 border border-black p-5 w-3/4"
                >
                    <h2 class="text-2xl font-bold text-center">
                        Comptence: {{ items[0].name }}
                    </h2>

                    <div
                        v-for="item in items"
                        :key="item.id_op"
                    >
                        <p class="text-xl">
                            Name: {{ item.name_op + ' ' + item.surname }}
                        </p>

                        <p>
                            Name of the last Training: {{ item.name_train }}
                        </p>

                        <p>
                            Date of the last Training: {{ item.date }}
                        </p>

                        <p>
                            State: {{ item.name_state }}
                        </p>
                    </div>
                </div>
            </div>

            <button
                ref="downloadButton"
                class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center button-download font-bold"
                @click="download"
            >
                <UIcon
                    name="i-material-symbols-download"
                />
                Download
            </button>
        </div>
    </div>
</template>

<style scoped>
.page {
    padding: 20px;
    background-color: white;
    width: 595px;
}

.button-download:hover {
        opacity: 1;
}

.button-download {
    opacity: 0;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    transition: opacity 0.3s;
}
</style>
