<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as excel from 'exceljs'
import type { StudyPlan } from '../../utils/types'
const tmp = ref<{ data: StudyPlan[] }>()
const page = ref<HTMLElement>()
const Operators = ref<{
    trainings: Training[],
    operator: {
        id_op: number,
        name_op: string,
        surname: string,
    }
}[]>([])
const sp = useSupabaseClient()

const trainings = ref<Training[]>()

async function fetchData() {
    try {
        tmp.value = await $fetch('/api/StudyPlanHelper', {
            method: 'POST',
            headers: useRequestHeaders(['cookie']),
            body: JSON.stringify({
                nbday: 50
                // id_op: route.query.id_op
            }),
        }) as { data: StudyPlan[] }

        console.log(tmp.value.data.some(study => study.id_op === 0))

        trainings.value = (await sp.from('Training').select('*, Competences(name, tmp_validity)')).data ?? []
        const operators = (await sp.from('Operators').select('*')).data ?? []
        const comp = (await sp.from('Competences').select('*')).data ?? []

        trainings.value = trainings.value.filter(item => item.date > new Date().toISOString().split('T')[0] && tmp.value?.data.some(study => study.id_comp === item.id_comp))
        tmp.value.data.forEach((item) => {
            const operator = operators.find(operator => operator.id_op === item.id_op)

            const operatorIndex = Operators.value.findIndex(operator => operator.operator.id_op === item.id_op)
            if (operatorIndex === -1) {
                const newTrain = trainings.value.filter(training => training.id_comp === item.id_comp)
                if (newTrain.length === 0) {
                    newTrain.push({
                        id_train: 0,
                        name: 'No training available',
                        date: '',
                        cost: 0,
                        duration: 0,
                        topic: 'This competence need to be trained by the operator',
                        Competences: {
                            id_comp: item.id_comp,
                            name: comp.find(comp => comp.id_comp === item.id_comp)?.name ?? '',
                        }
                    })
                }
                Operators.value.push({
                    trainings: newTrain,
                    operator: {
                        id_op: operator?.id_op ?? 0,
                        name_op: operator?.name ?? '',
                        surname: operator?.surname ?? ''
                    }
                })
            } else {
                const newTrain = trainings.value.filter(training => training.id_comp === item.id_comp)
                if (newTrain.length === 0) {
                    newTrain.push({
                        id_train: 0,
                        name: 'No training available',
                        date: '',
                        cost: 0,
                        duration: 0,
                        topic: 'This competence need to be trained by the operator',
                        Competences: {
                            id_comp: item.id_comp,
                            name: comp.find(comp => comp.id_comp === item.id_comp)?.name ?? '',
                        }
                    })
                }
                Operators.value[operatorIndex].trainings.push(...newTrain)
            }
        })
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Une erreur s'est produite lors de la récupération des données :", error)
    }
}

function download() {
    const worksheet = new excel.Workbook()
    console.log(Operators.value)

    Operators.value.forEach((items) => {
        if (worksheet.getWorksheet(items.operator.name_op + ' ' + items.operator.surname) || items.operator.name_op === 'deleted') {
            return
        }
        const sheet = worksheet.addWorksheet(items.operator.name_op + ' ' + items.operator.surname)
        sheet.columns = [
            { header: 'Training', key: 'training', width: 24 },
            { header: 'Date Training', key: 'date', width: 24 },
            { header: 'Price', key: 'cost', width: 24 },
            { header: 'Duration', key: 'duration', width: 24 },
            { header: 'Topic', key: 'topic', width: 24 },
            { header: 'Competence', key: 'competence', width: 24 }
        ]

        items.trainings.forEach((item) => {
            sheet.addRow({
                training: item.name,
                date: item.date,
                cost: item.cost,
                duration: item.duration,
                topic: item.topic,
                competence: item.Competences.name
            })
        })
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
                v-for="items in Operators.filter(item => item.length > 0)"
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
