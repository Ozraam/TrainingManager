<script setup lang="ts">
import * as excel from 'exceljs'
import { onMounted } from 'vue'
const route = useRoute()

if (!route.query.operator) {
    navigateTo('/history')
}

const operator = ref({
    value: Number(route.query.operator),
    label: '',
})

const sp = useSupabaseClient()
const toast = useToast()

async function fetchHistory() {
    const { data, error } = await sp.from('Operators').select('*, Registration(*, Training(*, Competences(*)), State(*)), Position(*)')
        .eq('id_op', operator.value.value) as any

    if (error) {
        toast.add({
            title: 'Error',
            description: error.message,
            color: 'red'
        })
        return
    }

    if (data.length === 0) {
        navigateTo('/history')
    }

    operator.value.label = `${data[0].name} ${data[0].surname}`
    // process the data to have an object for each date
    const history = data[0].Registration.reduce((acc: any, reg: any) => {
        const date = new Date(reg.date)
        const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        if (!acc[key]) {
            acc[key] = []
        }
        acc[key].push(reg)
        return acc
    }, {})

    return history
}

const operatorData = ref({})

fetchHistory().then((data) => {
    operatorData.value = data
    download()
})

function download() {
    const worksheet = new excel.Workbook()
    const sheet = worksheet.addWorksheet('History - ' + operator.value.label)

    sheet.columns = [
        { header: 'Date', key: 'date', width: 20 },
        { header: 'Training', key: 'training', width: 40 },
        { header: 'State', key: 'state', width: 20 },
        { header: 'Price', key: 'price', width: 20 },
        { header: 'Frequency', key: 'frequency', width: 20 },
        { header: 'Competence', key: 'competence', width: 20 },
    ]

    console.log(operatorData.value)

    const rows = Object.entries(operatorData.value)
        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
        .map(([date, registrations]) => {
            return registrations.map((registration: any) => {
                return {
                    date: new Date(date).toLocaleDateString(),
                    training: registration.Training.name,
                    state: registration.State.name,
                    price: registration.Training.cost,
                    frequency: registration.Training.Competences.tmp_validity,
                    competence: registration.Training.Competences.name
                }
            })
        }).flat()

    sheet.addRows(rows)

    worksheet.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `History - ${operator.value.label}.xlsx`
        a.click()
        URL.revokeObjectURL(url)

        setTimeout(() => {
            navigateTo('/history?operator=' + operator.value.value)
        }, 1000)
    })
}
</script>

<template>
    <div class="flex justify-center gap-5 items-center text-center">
        <div>
            <h2 class="text-2xl">
                History of
                <span class="underline">
                    {{ operator.label }}
                </span>
            </h2>

            <DownloadWaiting @download="download" />
        </div>
    </div>
</template>