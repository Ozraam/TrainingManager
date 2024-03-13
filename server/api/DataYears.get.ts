/* eslint-disable no-console */
import { serverSupabaseClient } from '#supabase/server'
import { Competence, Registration, Training, YearData } from '~/utils/types'
export default defineEventHandler(async (event) => {
    const sp = await serverSupabaseClient(event)
    const data = [] as any

    const dataFocast = (await sp.from('Forecast').select('*')).data as YearData[]
    const dataCompetences = (await sp.from('Competences').select('*, Training(*, Registration(*, Operators(*), State(*)))')).data as Competence[]
    data.push(dataCompetences)
    // console.log(dataFocast)
    // console.log(dataCompetences)

    dataFocast.forEach((yearData) => {
        data.push({
            year: yearData.year,
            budget: yearData.budget,
            competences: []
        })
    })

    dataCompetences.forEach((competence) => {
        data.forEach((yearData: YearData) => {
            const Competence = {} as Competence
            competence.Training.forEach((training:Training) => {
                if (yearData.year === new Date(training.date).getFullYear()) {
                    Competence.name = competence.name
                    Competence.Training = []
                    if (training.id_comp === competence.id_comp) {
                        const Training = {} as Training
                        Training.name = training.name
                        Training.date = training.date
                        Training.duration = training.duration
                        Training.cost = training.cost
                        Training.operators = []

                        training.Registration.forEach((registration:Registration) => {
                            if (registration.Operators.length !== 0 && training.id_train === registration.id_train) {
                                console.log(registration.Operators)
                                Training.operators = registration.Operators
                                Training.state = registration.State.name
                            }
                        })

                        Competence.Training.push(Training)
                    }
                    yearData.competences.push(Competence)
                }
            })
        })
    })

    return {
        data
    }
})
