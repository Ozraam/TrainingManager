/* eslint-disable indent */
import { serverSupabaseClient } from '#supabase/server'
import { Operator, PositionComp, Registration } from '~/utils/types'
export default defineEventHandler(async (event) => {
    const sp = await serverSupabaseClient(event)

    const { data } = await sp.from('Operators')
    .select('*, Position(*, Position_comp(*, Competences(*))),  Registration(*, Training(*), State(name))')

    data?.forEach((operator: Operator) => {
        operator.Position.Position_comp.forEach((comp: PositionComp) => {
            operator.Registration.forEach((reg: Registration) => {
                if (reg.Training.id_comp === comp.id_comp) {
                    const now = new Date()
                    const trainingDate = new Date(reg.Training.date)
                    const validityDays = comp.Competences.tmp_validity || 0

                    trainingDate.setDate(trainingDate.getDate() + validityDays)

                    if (now.getDate() > trainingDate.getDate()) {
                        comp.Competences.valid = false
                    } else {
                        comp.Competences.valid = true
                    }
                } else {
                    comp.Competences.valid = false
                }
            })
        })
    })

    return {
        data
    }
})
