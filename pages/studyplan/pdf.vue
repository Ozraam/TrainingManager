<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
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
            console.log(tmp.value.data)

            tmp.value.data.forEach((item) => {
                const i = comp.value.findIndex((el:StudyPlan[]) => el[0].id_comp === item.id_comp)
                if (i === -1) {
                    comp.value.push([item])
                } else {
                    comp.value[i].push(item)
                }
            })
            console.log(comp.value)
        } else {
            console.error('La réponse du serveur ne contient pas de données valides.')
        }
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
