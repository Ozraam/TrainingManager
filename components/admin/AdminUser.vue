<script setup lang="ts">
const props = defineProps({
    user: {
        type: Object as PropType<{ user_id: string, email: string, is_allowed: boolean, is_admin: boolean }>,
        required: true
    }
})
const emit = defineEmits(['update'])
const sp = useSupabaseClient()
function switchAllowState(state: boolean) {
    sp.from('Authorization').update({ is_allowed: state } as never).eq('user_id', props.user.user_id).then(() => {
        emit('update')
    })
}

const toast = useToast()
function changeState(confirmMessage : string, state: boolean, switchFunction: (state: boolean) => void) {
    toast.add({
        title: 'Are you sure ?',
        description: confirmMessage,
        actions: [
            {
                label: 'Yes',
                click: () => switchFunction(state),
                color: 'green'
            },
            {
                label: 'Cancel',
                color: 'red'
            }
        ]
    })
}

function switchAdminState(state: boolean) {
    sp.from('Authorization').update({ is_admin: state } as never).eq('user_id', props.user.user_id).then(() => {
        emit('update')
    })
}

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
                    @click="changeState('Do you want to disallowed this user to use the application ?', false, switchAllowState)"
                >
                    Allowed
                </UButton>

                <UButton
                    v-else
                    color="red"
                    size="sm"
                    class="flex justify-center"
                    @click="changeState('Do you want to allowed this user to use the application ?', true, switchAllowState)"
                >
                    Not Allowed
                </UButton>

                <UButton
                    v-if="user.is_admin"
                    color="green"
                    size="sm"
                    class="flex justify-center"
                    @click="changeState('Do you want to revoke admin right from this user ?', false, switchAdminState)"
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
                    @click="changeState('Do you want to give admin right from this user ? (Warning: this user will be allowed to use the admin panel fully and revoke admin right)', true, switchAdminState)"
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
