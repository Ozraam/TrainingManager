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
        {
            label: 'Operators',
            to: route.path.startsWith('/operator') ? route.path : '/operator/1',
            icon: 'i-heroicons-user-group'
        },
        {
            label: 'Competences',
            to: '/competence/0',
            icon: 'i-heroicons-clipboard'
        },
        {
            label: 'Training',
            to: '/training',
            icon: 'i-heroicons-academic-cap'
        }
    ],
    [
        {
            label: 'Settings',
            to: '/settings',
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
