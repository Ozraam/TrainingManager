<script setup lang="ts">
import * as excel from 'exceljs'

const route = useRoute()

if (!route.query.competence) {
    navigateTo('/history')
}

const competence = ref({
    value: Number(route.query.competence),
    label: '',
})

const sp = useSupabaseClient()
const toast = useToast()

async function fetchHistory() {
    const { data, error } = await sp.from('Competences').select('*, Training(*, Competences(name, tmp_validity), Registration(*, Operators(*), State(*)))')
        .eq('id_comp', competence.value.value).eq('Training.Registration.Operators.deleted', 0) as any

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

    competence.value.label = `${data[0].name}`
    // process the data to have an object for each date of registration but I want training
    const history = data[0].Training.reduce((acc: any, training: any) => {
        return training.Registration.reduce((acc: any, reg: any) => {
            const date = new Date(reg.date)
            const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            if (!acc[key]) {
                acc[key] = []
            }
            acc[key].push({
                reg,
                training
            })
            return acc
        }, acc)
    }, {})

    return history
}

const competenceData = ref({})

fetchHistory().then((data) => {
    competenceData.value = data
    download()
})

function download() {
    const worksheet = new excel.Workbook()
    const sheet = worksheet.addWorksheet('History - ' + competence.value.label)

    sheet.columns = [
        { header: 'Operator', key: 'operator', width: 20 },
        { header: 'Date', key: 'date', width: 20 },
        { header: 'Training', key: 'training', width: 40 },
        { header: 'State', key: 'state', width: 20 },
        { header: 'Price', key: 'price', width: 20 },
        { header: 'Frequency', key: 'frequency', width: 20 },
        { header: 'Competence', key: 'competence', width: 20 },
    ]

    const rows = Object.entries(competenceData.value).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()).map(([date, registrations]) => {
        return registrations.map(({ reg, training }) => {
            return {
                operator: `${reg.Operators.name} ${reg.Operators.surname}`,
                date: new Date(date).toLocaleDateString(),
                training: training.name,
                state: reg.State.name,
                price: training.cost,
                frequency: training.Competences.tmp_validity,
                competence: training.Competences.name,
            }
        })
    }).flat()

    // sort rows by operator name
    rows.sort((a, b) => a.operator.localeCompare(b.operator))
    sheet.addRows(rows)

    worksheet.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `History - ${competence.value.label}.xlsx`
        a.click()
        URL.revokeObjectURL(url)

        setTimeout(() => {
            navigateTo('/history?competence=' + competence.value.value)
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
                    {{ firstLetterToUpperCase(competence.label) }}
                </span>
            </h2>

            <DownloadWaiting @download="download" />
        </div>
    </div>
</template>
