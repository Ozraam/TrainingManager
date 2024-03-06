import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
    const sp = await serverSupabaseClient(event)

    const { data } = await sp.from('Competences').select('*, Position_comp(*, Position(*))')

    return {
        data
    }
})
