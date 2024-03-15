import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const sp = await serverSupabaseClient(event)
    const body = await readBody(event)

    let { data } = await sp.rpc('StudyPlanHelper', { nbday: body.nbday ?? 30 } as any) as any

    if (body.id_op === undefined || data === null) { return { data } }
    data = data.filter((d: any) => d.id_op === body.id_op)

    return {
        data
    }
})
