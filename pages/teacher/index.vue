<!-- eslint-disable no-console -->
<script setup lang="ts">
import OrgaDetail from '~/components/teacher/OrgaDetail.vue'

const sp = useSupabaseClient()

const teachers : Ref<{
    id_teacher: number;
    name: string;
    surname: string;
    deleted: boolean;
    Training: {
        name: string;
        id_train: number;
    }[]
}[]> = ref([])

const organisations : Ref<{
    id_orga: number;
    name: string;
    deleted: boolean;
    Training: {
        name: string;
        id_train: number;
    }[]
}[]> = ref([])

const fetchTeacher = async () => {
    const { data, error } = await sp.from('Teacher').select('*, Training(name, id_train)').order('name', { ascending: true })
    if (error) {
        // eslint-disable-next-line no-console
        console.error(error)
    } else {
        teachers.value = data.filter((teacher: { deleted: boolean }) => !teacher.deleted)
    }
}

const fetchOrganisation = async () => {
    const { data, error } = await sp.from('Organisation').select('id_orga, name, deleted').order('name', { ascending: true })
    const training = (await sp.from('Training').select('id_train, name, id_orga').order('name', { ascending: true })).data ?? []
    if (error) {
        // eslint-disable-next-line no-console
        console.error(error)
    } else {
        // console.log(data)
        organisations.value = data?.map((orga: { id_orga: number; name: string; deleted: boolean }) => {
            return {
                ...orga,
                Training: training.filter((train: { id_orga: number }) => train.id_orga === orga.id_orga)
            }
        }).filter((orga: { deleted: boolean }) => !orga.deleted) ?? []
    }
}

async function fetchAll() {
    await fetchTeacher()
    await fetchOrganisation()
}

const route = useRoute()

const search = ref(route.query.search ? route.query.search as string : '')

const filteredTeachers = computed(() => {
    return teachers.value.filter((teacher) => {
        const searchv = search.value.split(' ').filter(v => v !== '').join(' ')

        return (teacher.name.trim() + ' ' + teacher.surname.trim()).toLowerCase().includes(searchv.toLowerCase())
    })
})

const filteredOrganisations = computed(() => {
    return organisations.value.filter((orga) => {
        const searchv = search.value.split(' ').filter(v => v !== '').join(' ')

        return orga.name.toLowerCase().includes(searchv.toLowerCase())
    })
})

onMounted(fetchAll)
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

        <div class="flex flex-wrap gap-3 m-3">
            <OrgaDetail
                v-for="orga in filteredOrganisations"
                :key="orga.id_orga"
                :orga="orga"
                @deleted="fetchOrganisation"
            />
        </div>
    </section>
</template>
