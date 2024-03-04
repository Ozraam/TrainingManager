// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        '@nuxtjs/supabase',
        '@nuxtjs/eslint-module',
        '@nuxt/ui',
        '@nuxtjs/i18n'
    ],

    eslint: {
        fix: true,
    },

    css: [

    ],

    supabase: {
        redirect: false
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
