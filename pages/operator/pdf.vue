<!-- eslint-disable no-console -->
<script setup lang="ts">
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
                console.log(training)
                Training.value.push({
                    id_comp: training.id_comp,
                    name: comp.find(item => item.id_comp === training.id_comp)?.name ?? '',
                    trainings: [training]
                })
            } else {
                Training.value[trainingIndex!].trainings.push(training)
            }
        })
        // console.log(Training.value)
        // console.log(trainings.value)
    } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des données :", error)
    }
}

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

function DownloadPDF() {
    // console.log(page.value)
    replaceAllLatvianLongVowelsInHtmlElement(page.value!)
    exportToPDF('Study-plan.pdf', page.value!, { format: 'a4' }, { html2canvas: { scale: 0.7 } })
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
            <h1 class="text-2xl font-bold text-center mb-5">
                Study Plan
            </h1>

            <h2
                v-if="tmp?.data !== undefined"
                class="text-xl font-bold text-center mb-5"
            >
                Operator: {{ tmp?.data[0].name_op + ' ' + tmp?.data[0].surname }}
            </h2>

            <h2
                v-else
                class="text-xl font-bold text-center mb-5"
            >
                Operator: this operator has no upcoming training
            </h2>

            <div
                v-if="Training.length > 0"
                class="flex flex-col gap-5"
            >
                <div
                    v-for="items in Training"
                    :key="items.id_comp"
                    class="flex justify-center gap-5 mb-5"
                >
                    <div
                        class="flex flex-col gap-5 border border-black p-5 w-3/4"
                    >
                        <h2 class="text-2xl font-bold text-center">
                            Name of competence: {{ items.name }}
                        </h2>

                        <div
                            v-for="training in items.trainings"
                            :key="training.id_train"
                        >
                            <p v-if="training.date">
                                Date Training: {{ training.date }}
                            </p>

                            <p>
                                Cost: {{ training.cost }} €
                            </p>

                            <p>
                                Duration: {{ training.duration }} day{{ training.duration > 1 ? 's' : '' }}
                            </p>

                            <p>
                                Topic: {{ training.topic }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-else
                class="flex flex-col gap-5 text-center"
            >
                <p>
                    No training available
                </p>
            </div>

            <button
                ref="downloadButton"
                class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center button-download font-bold"
                @click="DownloadPDF"
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
