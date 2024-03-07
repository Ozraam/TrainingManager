import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const sp = await serverSupabaseClient(event)
    const { data } = await sp.rpc('test')
    return {
        data
    }
})
