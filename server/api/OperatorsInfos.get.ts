/* eslint-disable no-console */
/* eslint-disable indent */
import { serverSupabaseClient } from '#supabase/server'
export default defineEventHandler(async (event) => {
    const sp = await serverSupabaseClient(event)

    const { data } = await sp.from('Operators')
    .select('id_op, name, surname, Position(*, Position_comp(*, Competences(*))),  Registration(*, Training(*), State(name))')

    data?.forEach((_operator: any) => {
        _operator?.Position?.Position_comp?.forEach((_comp: any) => {
            _operator?.Registration?.forEach((_reg: any) => {
                if (_reg?.Training?.id_comp === _comp?.id_comp) {
                    console.log(_reg?.Training?.date)
                    const now = new Date()
                    const trainingDate = new Date(_reg?.Training?.date)
                    const validityDays = _comp?.Competences?.tmp_validity || 0

                    // Ajouter le nombre de jours de validité à la date de formation
                    trainingDate.setDate(trainingDate.getDate() + validityDays)

                    if (now.getDate() > trainingDate.getDate()) {
                        _comp.Competence.valid = false
                    } else {
                        _comp.Competence.valid = true
                    }
                } else {
                    console.log(_comp)
                }
            })
        })
    })

    return {
        data
    }
})
