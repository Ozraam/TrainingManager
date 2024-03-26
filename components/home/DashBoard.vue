<script setup lang="ts">
const user = useSupabaseUser()

if (!user.value) {
    navigateTo('/auth/login')
}

const data : Ref<YearData[]> = ref([])

const toast = useToast()
function fetchData() {
    $fetch('/api/DataYears').then((res) => {
        if (!res.data) {
            toast.add({
                title: 'Error',
                description: 'Error while fetching years',
                color: 'red',
            })
        } else {
            data.value = res.data as YearData[]

            years.value = data.value.map(d => d.year)
            if (currentPage.value === -1) { currentPage.value = years.value.length - 1 }
        }
    })
}

const years : Ref<number[]> = ref([])
// current page is set to the last year
const currentPage = ref(-1)
fetchData()
</script>

<template>
    <section class="m-3 flex flex-col items-center">
        <h1 class="text-2xl font-bold">
            {{ $t('home.welcome') }}
        </h1>

        <div
            v-if="data.length > 0"
            class="flex flex-col items-center"
        >
            <HomeYearPagination
                v-model="currentPage"
                :years="years"
                class="mt-3"
            />

            <HomeChart
                :years-stat="data[currentPage]"
                class="mt-3"
            />

            <HomeRecapTrainingList
                :years-stat="data[currentPage]"
                class="mt-10"
                @update="fetchData"
            />
        </div>
    </section>
</template>
