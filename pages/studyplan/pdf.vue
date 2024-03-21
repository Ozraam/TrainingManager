<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { StudyPlan } from '../../utils/types'
const tmp = ref<{ data: StudyPlan[] }>()
const page = ref<HTMLElement>()

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
            // console.log(tmp.value.data)
        } else {
            console.error('La réponse du serveur ne contient pas de données valides.')
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des données :", error)
    }
}

function DownloadPDF() {
    console.log(page.value)
    exportToPDF('test.pdf', page.value)
}

onMounted(async () => {
    await fetchData()
})
</script>

<template>
    <div
        class="flex justify-center gap-5"
    >
        <div
            ref="page"
            class="page text-black relative"
        >
            <h1 class="text-2xl font-bold text-center mb-10">
                Study Plan
            </h1>

            <div
                v-for="item in tmp?.data"
                :key="item.id_op"
                class="flex gap-5 "
            >
                <div
                    class="flex flex-col gap-5"
                >
                    <h2 class="text-xl font-bold">
                        {{ item.name }}
                    </h2>

                    <p>
                        {{ item.name_op + ' ' + item.surname }}
                    </p>
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
