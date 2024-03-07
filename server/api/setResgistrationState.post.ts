/* eslint-disable indent */
import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
    const sp = await serverSupabaseClient(event)
    const body = await readBody(event)

    const data = await sp.from('Registration')
    .update({ id_state: body.id_state } as never)
    .eq('id_op', body.id_op)
    .eq('id_train', body.id_train)
    .eq('date', body.date)

    return {
        data
    }
})
