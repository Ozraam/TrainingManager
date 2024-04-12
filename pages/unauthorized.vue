<template>
    <div class="min-h-screen">
        <PageHeader
            :title="$t('unauthorized.title')"
            title-link="/unauthorized"
        />

        <div class="flex justify-center items-center h-64">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-200">
                    {{ $t('unauthorized.title') }}
                </h1>

                <p class="text-gray-600 dark:text-gray-400">
                    {{ $t('unauthorized.description') }}
                </p>
            </div>
        </div>
    </div>
</template>
