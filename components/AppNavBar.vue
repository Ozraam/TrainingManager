<script setup lang="ts">
const route = useRoute()

const links = computed(() => [
    [
        {
            label: 'Training Manager',
            avatar: {
                src: 'https://placehold.co/400  ',
            },
        },
        {
            label: 'Home',
            to: '/',
            icon: 'i-heroicons-home'
        },
    ],
    [
        {
            label: 'Operators',
            to: route.path.startsWith('/operator') ? route.path : '/operator/1',
            icon: 'i-heroicons-user-group'
        },
        {
            label: 'Positions',
            to: '/positions',
            icon: 'i-heroicons-user'
        },
        {
            label: 'Competences',
            to: route.path.startsWith('/competence') ? route.path : '/competence/1',
            icon: 'i-heroicons-clipboard'
        },
        {
            label: 'Training',
            to: route.path.startsWith('/training') ? route.path : '/training/1',
            icon: 'i-heroicons-academic-cap'
        },
        {
            label: 'Teacher',
            to: route.path.startsWith('/teacher') ? route.path : '/teacher/1',
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
