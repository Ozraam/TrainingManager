import { serverSupabaseClient } from '#supabase/server'
import { Competence, Registration, Training, YearData } from '~/utils/types'
export default defineEventHandler(async (event) => {
    const sp = await serverSupabaseClient(event)
    const data = [] as any

    const dataFocast = (await sp.from('Forecast').select('*')).data as YearData[]
    const dataCompetences = (await sp.from('Competences').select('*, Training(*, Registration(*, Operators(*), State(*)))')).data as Competence[]
    // data.push(dataCompetences)
    // console.log(dataFocast)
    // console.log(dataCompetences)

    dataFocast.forEach((yearData) => {
        data.push({
            year: yearData.year,
            budget: yearData.budget,
            competences: []
        })
    })
    data.forEach((yearData: YearData) => {
        dataCompetences.forEach((competence) => {
            const Competence = {} as Competence
            Competence.name = competence.name
            Competence.Training = []
            competence.Training.forEach((training:Training) => {
                if (yearData.year === new Date(training.date).getFullYear()) {
                    if (training.id_comp === competence.id_comp) {
                        const Training = {} as Training
                        Training.name = training.name
                        Training.date = training.date
                        Training.duration = training.duration
                        Training.cost = training.cost
                        Training.operators = []

                        training.Registration.forEach((registration:Registration) => {
                            if (training.id_train === registration.id_train) {
                                Training.operators.push(registration.Operators)
                                if (Training.operators.length > 0) {
                                    Training.operators.forEach((operator) => {
                                        operator.status = registration.State.name
                                    })
                                }
                            }
                        })

                        if (Training.operators.length > 0) { Competence.Training.push(Training) }
                    }
                }
            })
            if (Competence.Training.length > 0) { yearData.competences.push(Competence) }
        })
    })

    data.forEach((yearData: YearData) => {
        if (yearData.competences.length === 0) {
            data.splice(data.indexOf(yearData), 1)
        }
    })

    return {
        data
    }
})
