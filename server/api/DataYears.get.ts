import { serverSupabaseClient } from '#supabase/server'
import { Competence, YearData } from '~/utils/types'
export default defineEventHandler(async (event) => {
    const sp = await serverSupabaseClient(event)

    const dataFocast = (await sp.from('Forecast').select('*')).data as YearData[]
    const dataCompetences = (await sp.from('Competences').select('*, Training(*, Registration(*, Operators(*)))')).data as Competence[]

    const data = {
        dataFocast,
        dataCompetences
    }
    return {
        data
    }
})
