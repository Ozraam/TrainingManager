<script setup lang="ts">
defineProps({
    user: {
        type: Object as PropType<{ user_id: string, email: string, is_allowed: boolean, is_admin: boolean }>,
        required: true
    }
})

const userAdmin = useSupabaseUser()
</script>

<template>
    <UCard>
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <div class="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full mr-4">
                    <span class="text-2xl font-bold text-gray-500">{{ user.email.charAt(0).toUpperCase() }}</span>
                </div>

                <div>
                    <h2 class="text-lg font-bold">
                        {{ user.email }}
                    </h2>

                    <p class="text-sm text-gray-500">
                        {{ user.user_id }}
                    </p>
                </div>
            </div>

            <div
                v-if="user.user_id !== userAdmin!.id"
                class="grid gap-2"
                :class="{
                    'grid-cols-2': user.is_allowed,
                    'grid-cols-1': !user.is_allowed
                }"
            >
                <UButton
                    v-if="user.is_allowed"
                    color="green"
                    size="sm"
                    class="flex justify-center"
                >
                    Allowed
                </UButton>

                <UButton
                    v-else
                    color="red"
                    size="sm"
                    class="flex justify-center"
                >
                    Not Allowed
                </UButton>

                <UButton
                    v-if="user.is_admin"
                    color="green"
                    size="sm"
                    class="flex justify-center"
                >
                    <span>
                        Admin
                    </span>
                </UButton>

                <UButton
                    v-else-if="user.is_allowed"
                    color="red"
                    size="sm"
                    class="flex justify-center"
                >
                    User
                </UButton>
            </div>

            <div v-else>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                    You
                </span>

                <span class="text-sm text-gray-500 dark:text-gray-400">
                    ({{ user.is_admin ? 'Admin' : 'User' }})
                </span>

                <span class="text-sm text-gray-500 dark:text-gray-400">
                    ({{ user.is_allowed ? 'Allowed' : 'Not Allowed' }})
                </span>
            </div>
        </div>
    </UCard>
</template>
