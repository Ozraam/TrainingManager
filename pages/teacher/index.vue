<script setup lang="ts">
const sp = useSupabaseClient()

const teachers : Ref<{
    id_teacher: number;
    name: string;
    surname: string;
    Training: {
        name: string;
        id_train: number;
    }[]
}[]> = ref([])

const fetchTeacher = async () => {
    const { data, error } = await sp.from('Teacher').select('*, Training(name, id_train)')
    if (error) {
        // eslint-disable-next-line no-console
        console.error(error)
    } else {
        teachers.value = data
    }
}

const route = useRoute()

const search = ref(route.query.search ? route.query.search as string : '')

const filteredTeachers = computed(() => {
    return teachers.value.filter((teacher) => {
        const searchv = search.value.split(' ').filter(v => v !== '').join(' ')

        return (teacher.name.trim() + ' ' + teacher.surname.trim()).toLowerCase().includes(searchv.toLowerCase())
    })
})

onMounted(fetchTeacher)
</script>

<template>
    <section class="">
        <PageHeader
            title="Teachers"
            title-link="/teacher"
            :actions="[
                {
                    label: 'Add new teacher',
                    callBack: () => navigateTo('/teacher/add')
                }
            ]"
        />

        <div class="flex justify-center mt-1">
            <UInput
                v-model="search"
                icon="i-heroicons-magnifying-glass-20-solid"
                placeholder="Search"
                :ui="{ icon: { trailing: { pointer: '' } } }"
            >
                <template #trailing>
                    <UButton
                        v-show="search !== ''"
                        color="gray"
                        variant="link"
                        icon="i-heroicons-x-mark-20-solid"
                        :padded="false"
                        @click="search = ''"
                    />
                </template>
            </UInput>
        </div>

        <div class="flex flex-wrap gap-3 m-3">
            <TeacherDetail
                v-for="teacher in filteredTeachers"
                :key="teacher.id_teacher"
                :teacher="teacher"
                @deleted="fetchTeacher"
            />
        </div>
    </section>
</template>
