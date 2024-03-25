import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const sp = await serverSupabaseClient(event)
    const body = await readBody(event)

    const nbday = body === undefined || body.nbday ? 50 : body.nbday

    let { data } = await sp.rpc('StudyPlanHelper', { nbday } as any) as any
    let data2 = (await sp.rpc('StudyPlanHelper2')).data as any
    if (body === undefined || body.id_op === undefined || data === null) { return { data: data.concat(data2) } }
    data = data.filter((d: any) => d.id_op === body.id_op)
    data2 = data2.filter((d: any) => d.id_op === body.id_op)

    data.concat(data2)
    return {
        data
    }
})
