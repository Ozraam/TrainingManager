/* eslint-disable indent */
import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
    const sp = await serverSupabaseClient(event)

    const { data } = await sp.from('Operators')
    .select('id_op, name, surname, Position(*, Position_comp(*, Competences(*))),  Registration(*, Training(*), State(name))')

    return {
        data
    }
})
