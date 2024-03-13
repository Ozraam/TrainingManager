<!-- eslint-disable no-console -->
<script setup lang="ts">
const route = useRoute()
const user = useSupabaseUser()

const links = computed(() => [
    [
        {
            label: 'Training Manager',
            avatar: {
                src: 'https://placehold.co/400  ',
            },
        },
        {
            label: 'Dashboard',
            to: '/',
            icon: 'i-heroicons-home'
        },
    ],
    [
        {
            label: 'Operators',
            to: route.path.startsWith('/operator') ? route.path : '/operator',
            icon: 'i-heroicons-user-group'
        },
        {
            label: 'Positions',
            to: '/positions',
            icon: 'i-heroicons-user'
        },
        {
            label: 'Competences',
            to: route.path.startsWith('/competence') ? route.path : '/competence',
            icon: 'i-heroicons-clipboard'
        },
        {
            label: 'Training',
            to: route.path.startsWith('/training') ? route.path : '/training',
            icon: 'i-heroicons-academic-cap'
        },
        {
            label: 'Teacher',
            to: '/teacher',
            icon: 'i-heroicons-academic-cap'
        },
    ],
    [
        {
            label: 'Forecast',
            to: '/forecast',
            icon: 'i-heroicons-calendar'
        },
        {
            label: 'History',
            to: '/history',
            icon: 'i-heroicons-clock'
        },
        {
            label: 'Study Plan',
            to: '/study-plan',
            icon: 'i-heroicons-book-open'
        },
    ],
    [

        user.value
            ? {
                label: 'Log out',
                to: '/auth/logout',
                icon: 'i-heroicons-arrow-left-start-on-rectangle'
            }
            : {
                label: 'Log in',
                to: '/auth/login',
                icon: 'i-heroicons-arrow-right-end-on-rectangle'
            },
        {
            label: 'Sign up',
            to: '/auth/signup',
            icon: 'i-heroicons-user-plus'
        },
    ],
    [
        {
            label: 'Settings',
            to: '',
            icon: 'i-heroicons-cog'
        }
    ]
])
</script>

<template>
    <nav class="border-r-4 h-screen border-gray-200 dark:border-gray-700 sticky top-0">
        <UVerticalNavigation
            :links="links"
        />
    </nav>
</template>
