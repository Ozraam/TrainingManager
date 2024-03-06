import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const sp = await serverSupabaseClient(event)

    const { data } = await sp.from('Operators').select('*, Position(*, Position_comp(*, Competences(*)))').eq('id_op', body.id_op)

    return {
        data
    }
})
