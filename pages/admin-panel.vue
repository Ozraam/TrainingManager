<script setup lang="ts">
const sp = useSupabaseClient()

const allUser = ref([])

function fetchAllUser() {
    sp.from('Authorization').select('user_id, email, is_allowed, is_admin').then(({ data, error }) => {
        if (error) {
            // eslint-disable-next-line no-console
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

        <ul>
            <li
                v-for="user in allUser"
                :key="user.user_id"
            >
                <admin-user :user="user" />
            </li>
        </ul>
    </section>
</template>
