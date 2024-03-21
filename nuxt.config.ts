// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        '@nuxtjs/supabase',
        '@nuxtjs/eslint-module',
        '@nuxt/ui',
        '@nuxtjs/i18n',
        '@sidebase/nuxt-pdf',
    ],

    eslint: {
        fix: true,
    },

    ui: {
        icons: [
            'heroicons',
            'material-symbols'
        ]
    },

    supabase: {
        redirectOptions: {
            callback: '/',
            login: '/auth/login',
            exclude: [
                '/auth/signup',
                '/test'
            ]
        }
    },

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: ''
                }
            }
        }
    },

    i18n: {
        locales: [
            {
                code: 'en',
                file: 'en-US.json'
            },
        ],
        defaultLocale: 'en',
        lazy: true,
        langDir: 'locales/',
    },
})
