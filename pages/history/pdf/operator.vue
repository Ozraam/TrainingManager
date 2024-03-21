<script setup lang="ts">
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
    } else {
        // if the element is not a text node, then we need to check its children
        element.childNodes.forEach(replaceAllLatvianLongVowelsInHtmlElement)
    }
}

function downloadPDF() {
    replaceAllLatvianLongVowelsInHtmlElement(page.value!)
    downloadButton.value!.style.opacity = '0'
    const name = operator.value.label.replace(' ', '_') + new Date().toLocaleDateString() + '.pdf'
    exportToPDF(name, page.value!)
    downloadButton.value!.style.opacity = ''
}
</script>

<template>
    <div class="flex justify-center gap-5">
        <div
            ref="page"
            class="page text-black relative"
        >
            <h2 class="text-xl">
                History of
                <span class="underline">
                    {{ operator.label }}
                </span>
            </h2>

            <h3>
                Date: {{ new Date().toLocaleDateString() }}
            </h3>

            <div
                v-if="Object.keys(operatorData).length"
                class="flex gap-3 flex-col mt-4"
            >
                <div
                    v-for="[date, registrations] in Object.entries(operatorData).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())"
                    :key="date"
                >
                    <h3 class="underline">
                        {{ new Date(date).toLocaleDateString() }}
                    </h3>

                    <div class="flex flex-col gap-2">
                        <div
                            v-for="registration in registrations"
                            :key="registration.id_train"
                        >
                            <span
                                class="font-bold"
                            >
                                {{ registration.Training.name }}
                            </span>
                            - {{ registration.State.name }}
                        </div>
                    </div>
                </div>
            </div>

            <div v-else>
                <p>
                    No history for this operator
                </p>
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
