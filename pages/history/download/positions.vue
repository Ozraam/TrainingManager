<script setup lang="ts">
import * as excel from 'exceljs'
const route = useRoute()

if (!route.query.positions) {
    navigateTo('/history')
}

const positions : Ref<{value: number, label: string}[]> = ref(route.query.positions.split(',').map((p: string) => ({ value: Number(p), label: '' })))

const sp = useSupabaseClient()
const toast = useToast()

async function fetchHistory() {
    const { data, error } = await sp.from('Position').select('*, Operators(*, Registration(*, Training(*, Competences(name, tmp_validity)), State(*)))').eq('Operators.deleted', 0)

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

    positions.value.forEach((pos) => {
        pos.label = data.find((p: any) => p.id_pos === pos.value).name
    })

    const dataFiltered = data.filter((p: any) => positions.value.some(pos => pos.value === p.id_pos))

    const history = dataFiltered.map((p: any) => {
        return {
            position: { id_pos: p.id_pos, name: p.name },
            history: p.Operators.reduce((acc: any, op: any) => {
                return op.Registration.reduce((acc: any, reg: any) => {
                    const date = new Date(reg.date)
                    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                    if (!acc[key]) {
                        acc[key] = []
                    }
                    acc[key].push({
                        reg,
                        training: reg.Training,
                        op
                    })
                    return acc
                }, acc)
            }, {})
        }
    })

    return history
}

const positionsData = ref([])

fetchHistory().then((data) => {
    positionsData.value = data
    download()
})

function download() {
    const worksheet = new excel.Workbook()

    positionsData.value.forEach((p) => {
        const sheet = worksheet.addWorksheet('History - ' + p.position.name)
        sheet.columns = [
            { header: 'Operator', key: 'operator', width: 20 },
            { header: 'Date', key: 'date', width: 20 },
            { header: 'Training', key: 'training', width: 40 },
            { header: 'State', key: 'state', width: 20 },
            { header: 'Price', key: 'price', width: 20 },
            { header: 'Frequency', key: 'frequency', width: 20 },
            { header: 'Competence', key: 'competence', width: 20 },
        ]

        const rows : any = Object.entries(p.history).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()).map(([date, registrations]) => {
            return registrations.map(({ reg, training, op }) => {
                return {
                    operator: `${op.name} ${op.surname}`,
                    date: new Date(date).toLocaleDateString(),
                    training: training.name,
                    state: reg.State.name,
                    price: training.cost,
                    frequency: training.Competences.tmp_validity,
                    competence: training.Competences.name,
                }
            })
        }).flat()

        sheet.addRows(rows)
    })

    worksheet.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `History - ${positions.value.map(p => p.label).join(', ')}.xlsx`
        a.click()
        URL.revokeObjectURL(url)

        setTimeout(() => {
            navigateTo('/history?positions=' + positions.value.map(p => p.value).join(', '))
        }, 1000)
    })
}
</script>

<template>
    <div class="flex justify-center gap-5 items-center text-center">
        <div>
            <h2 class="text-2xl">
                History of positions
                <span>
                    {{ positions.map(p => p.label).join(', ') }}
                </span>
            </h2>

            <DownloadWaiting @download="download" />
        </div>
    </div>
</template>

<style>
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
