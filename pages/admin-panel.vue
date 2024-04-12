<script setup lang="ts">
const sp = useSupabaseClient()
const userCurrent = useSupabaseUser()

const allUser = ref([])

function fetchAllUser() {
    sp.from('Authorization').select('user_id, email, is_allowed, is_admin').order('email').then(({ data, error }) => {
        // check if user is admin
        if (data.find((user : any) => user.user_id === userCurrent.value?.id)?.is_admin === false) {
            navigateTo('/')
        } else if (error) {
            navigateTo('/')
            console.error(error)
        } else {
            allUser.value = data
        }
    })
}

fetchAllUser()
</script>

<template>
    <section>
        <PageHeader
            :title="$t('adminPanel.title')"
            title-link="/admin-panel"
        />

        <div class="flex flex-col items-center justify-center">
            <h1 class="text-3xl font-bold mb-4">
                {{ $t('adminPanel.welcome') }}
            </h1>

            <p class="text-lg text-center">
                {{ $t('adminPanel.description') }}
            </p>
        </div>

        <ul class="flex flex-col items-center">
            <li
                v-for="user in allUser"
                :key="user.user_id"
                class="user-admin"
            >
                <admin-user
                    :user="user"
                    @update="fetchAllUser"
                />
            </li>
        </ul>
    </section>
</template>

<style>
.user-admin {
    max-width: 900px;
    width: 100%;
}
</style>
