<!-- eslint-disable no-console -->
<script setup lang="ts">
import * as excel from 'exceljs'
import { onMounted, ref } from 'vue'

const tmp = ref<{ data: StudyPlan[] }>()
const trainings = ref<Training[]>()
const Training = ref<{
    id_comp: number
    name: string
    trainings: Training[]
}[]>([])
const page = ref<HTMLElement>()
const sp = useSupabaseClient()
const route = useRoute()

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

        trainings.value = (await sp.from('Training').select('*')).data ?? []
        tmp.value = { data: tmp.value.data.filter(item => item.id_op === Number(route.query.id_op)) }

        trainings.value = trainings.value.filter(item => item.date > new Date().toISOString().split('T')[0] && tmp.value?.data.some(study => study.id_comp === item.id_comp))
        const comp = (await sp.from('Competences').select('*')).data ?? [] as Competence[]
        trainings.value.forEach((training) => {
            const trainingIndex = Training.value?.findIndex(item => item.id_comp === training.id_comp)
            // console.log(trainingIndex)
            if (trainingIndex === -1) {
                Training.value.push({
                    id_comp: training.id_comp,
                    name: comp.find(item => item.id_comp === training.id_comp)?.name ?? '',
                    trainings: [training]
                })
            } else {
                Training.value[trainingIndex!].trainings.push(training)
            }
        })

        // add comp without training to the list with 'No training'
        tmp.value.data.forEach((item) => {
            if (!Training.value.some(training => training.id_comp === item.id_comp)) {
                Training.value.push({
                    id_comp: item.id_comp,
                    name: item.name,
                    trainings: [
                        {
                            id_train: 0,
                            name: 'No training available',
                            date: '',
                            cost: 0,
                            duration: 0,
                            topic: 'This competence need to be trained by the operator'
                        }
                    ]
                })
            }
        })
    } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des données :", error)
    }
}

function download() {
    const worksheet = new excel.Workbook()

    Training.value.forEach((items) => {
        const sheet = worksheet.addWorksheet(items.name)
        sheet.columns = [
            { header: 'Training', key: 'training', width: 24 },
            { header: 'Date Training', key: 'date', width: 24 },
            { header: 'Price', key: 'cost', width: 24 },
            { header: 'Duration', key: 'duration', width: 24 },
            { header: 'Topic', key: 'topic', width: 24 }
        ]

        const rows : any = items.trainings.map(item => ({
            training: item.name ?? 'No training',
            date: (new Date(item.date)).toLocaleDateString(),
            cost: item.cost,
            duration: item.duration,
            topic: item.topic
        }))
        sheet.addRows(rows)
    })

    worksheet.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `study-plan - ${tmp.value?.data[0].name_op} ${tmp.value?.data[0].surname}.xlsx`
        a.click()
        URL.revokeObjectURL(url)

        setTimeout(() => {
            navigateTo('/operator/' + route.query.id_op)
        }, 1000)
    })
}

onMounted(async () => {
    await fetchData()
    download()
})
</script>

<template>
    <div
        class="flex justify-center gap-5 items-center text-center"
    >
        <div>
            <h1 class="text-2xl font-bold text-center mb-5">
                Study Plan
            </h1>

            <h2
                v-if="tmp?.data !== undefined"
                class="text-xl font-bold text-center mb-5"
            >
                Operator: {{ tmp?.data[0].name_op + ' ' + tmp?.data[0].surname }}
            </h2>

            <DownloadWaiting @download="download" />
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
