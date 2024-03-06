import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
    const sp = await serverSupabaseClient(event)

    const { data } = await sp.from('Position').select('*, Operators(*), Position_comp(*, Competences(*))')

    return {
        data
    }
})
