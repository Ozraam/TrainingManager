<script setup lang="ts">
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
    const { data, error } = await sp.from('Competences').select('*, Training(*, Registration(*, Operators(*), State(*)))')
        .eq('id_comp', competence.value.value) as any

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
})

const page : Ref<HTMLElement | null> = ref(null)
const downloadButton : Ref<HTMLElement | null> = ref(null)

function replaceAllLatvianLongVowelsInHtmlElement(element: ChildNode, _index: number, _array: NodeListOf<ChildNode>) {
    // replace all long vowels with short ones in the text of the element children check if the element is a text node
    if (element.nodeType === Node.TEXT_NODE) {
        element.textContent = element.textContent!
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
    replaceAllLatvianLongVowelsInHtmlElement(page.value!, 0, page.value!.childNodes)
    downloadButton.value!.style.opacity = '0'
    const name = competence.value.label.replace(' ', '_') + new Date().toLocaleDateString() + '.pdf'
    exportToPDF(name, page.value!, {}, { html2canvas: { scale: 0.8 } })
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
                    {{ firstLetterToUpperCase(competence.label) }}
                </span>
            </h2>

            <div
                v-if="Object.keys(competenceData).length"
                class="flex flex-col gap-3 mt-4"
            >
                <div
                    v-for="[date, registrations] in Object.entries(competenceData).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())"
                    :key="registrations[0].training.id_train + date"
                >
                    <h3 class="underline">
                        {{ new Date(date).toLocaleDateString() }}
                    </h3>

                    <div class="flex flex-col gap-2">
                        <div
                            v-for="registration in registrations"
                            :key="registration.reg.id_op + registration.training.id_train"
                            class="flex gap-1"
                        >
                            {{ registration.training.name }}
                            -
                            <span class="font-bold">
                                {{ registration.reg.Operators.name }} {{ registration.reg.Operators.surname }}
                            </span>
                            -
                            <p>
                                {{ registration.reg.State.name }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else>
                <p>
                    No history for this competence
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
