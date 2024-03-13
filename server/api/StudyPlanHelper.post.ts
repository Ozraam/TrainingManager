import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const sp = await serverSupabaseClient(event)
    const body = await readBody(event)

    const { data } = await sp.rpc('StudyPlanHelper', { nbday: body.nbday ?? 30 } as any)
    return {
        data
    }
})
