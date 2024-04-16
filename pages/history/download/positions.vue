<script setup lang="ts">
const route = useRoute()

if (!route.query.positions) {
    navigateTo('/history')
}

const positions = ref(route.query.positions.split(',').map((p: string) => ({ value: Number(p), label: '' })))

const sp = useSupabaseClient()
const toast = useToast()

async function fetchHistory() {
    const { data, error } = await sp.from('Position').select('*, Operators(*, Registration(*, Training(*), State(*)))').eq('Operators.deleted', 0)

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
})

const page : Ref<HTMLElement | null> = ref(null)
const downloadButton : Ref<HTMLElement | null> = ref(null)

function replaceAllLatvianLongVowelsInHtmlElement(element: HTMLElement) {
    // replace all long vowels with short ones in the text of the element children check if the element is a text node
    if (element.nodeType === Node.TEXT_NODE) {
        element.textContent = element.textContent
            .replace(/ā/g, 'aa')
            .replace(/ē/g, 'ee')
            .replace(/ī/g, 'ii')
            .replace(/ū/g, 'uu')
            .replace(/Ā/g, 'AA')
            .replace(/Ē/g, 'EE')
            .replace(/Ī/g, 'II')
            .replace(/Ū/g, 'UU')
            .replace(/ģ/g, 'g')
            .replace(/ķ/g, 'k')
            .replace(/ļ/g, 'l')
            .replace(/ņ/g, 'n')
    } else {
        // if the element is not a text node, then we need to check its children
        element.childNodes.forEach(replaceAllLatvianLongVowelsInHtmlElement)
    }
}

function downloadPDF() {
    replaceAllLatvianLongVowelsInHtmlElement(page.value!)
    downloadButton.value!.style.opacity = '0'
    const name = 'positions_' + new Date().toLocaleDateString() + '.pdf'
    exportToPDF(name, page.value!, {}, { html2canvas: { scale: 0.8 } })
    downloadButton.value!.style.opacity = ''
}
</script>

<template>
    <div class="flex justify-center gap-5">
        <div
            v-if="Object.keys(positionsData).length"
            ref="page"
            class="page text-black relative flex flex-col"
        >
            <h2 class="text-xl">
                History of positions
            </h2>

            <span class="mb-4">
                Date: {{ new Date().toLocaleDateString() }}
            </span>

            <div
                v-for="(history, i) in positionsData"
                :key="history.position.id_pos"
            >
                <h2 class="text-xl">
                    History of
                    <span class="underline">
                        {{ firstLetterToUpperCase(history.position.name) }}
                    </span>
                </h2>

                <div
                    v-if="Object.keys(history.history).length"
                    class="flex gap-3 flex-col mt-4"
                >
                    <div
                        v-for="[date, registrations] in Object.entries(history.history).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())"
                        :key="date"
                    >
                        <h3 class="underline">
                            {{ new Date(date).toLocaleDateString() }}
                        </h3>

                        <div class="flex flex-col gap-2">
                            <div
                                v-for="registration in (registrations as any)"
                                :key="registration.reg.id_op"
                            >
                                <div class="flex gap-1">
                                    <span>
                                        {{ registration.training.name }}
                                    </span>
                                    |
                                    <span class="font-bold">
                                        {{ registration.op.name }} {{ registration.op.surname }}
                                    </span>
                                    |
                                    <p>
                                        {{ registration.reg.State.name }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else>
                    <p>
                        No history for this competence
                    </p>
                </div>

                <UDivider
                    v-if="i !== positionsData.length - 1"
                    class="my-4"
                />
            </div>

            <button
                ref="downloadButton"
                class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center button-download font-bold"
                @click="downloadPDF"
            >
                <UIcon
                    name="i-material-symbols-download"
                />
                Download
            </button>
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
