// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        '@nuxtjs/supabase',
        '@nuxtjs/eslint-module',
        '@nuxt/ui',
        '@nuxtjs/i18n',
        '@sidebase/nuxt-pdf',
        'nuxt-cron',
        '@nuxtjs/google-fonts'
    ],

    css: [
        '~/assets/css/global.scss'
    ],

    colorMode: {
        preference: 'light'
    },

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
            exclude: ['/auth/signup']
        },
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

    cron: {
        runOnInit: true,
        timeZone: 'Europe/Riga',
        // jobsDir: '/cron'
    },

    googleFonts: {
        families: {
            'Lexend Exa': true,
        },
        display: 'swap',
    },
})
