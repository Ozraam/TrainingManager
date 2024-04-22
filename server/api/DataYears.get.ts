import { serverSupabaseClient } from '#supabase/server'
import { Competence, Registration, Training, YearData } from '~/utils/types'
export default defineEventHandler(async (event) => {
    const sp = await serverSupabaseClient(event)
    const data = [] as YearData[]

    const dataFocast = (await sp.from('Forecast').select('*').order('year')).data as YearData[]
    const dataCompetences = (await sp.from('Competences').select('*, Training(*, Registration(*, Operators(*), State(*)))')).data as Competence[]

    dataFocast.forEach((yearData) => {
        data.push({
            year: yearData.year,
            budget: yearData.budget,
            competences: [] as Competence[]
        })
    })
    //
    data.forEach((yearData: YearData) => {
        dataCompetences.forEach((competence) => {
            const Competence = {} as Competence
            Competence.name = competence.name
            Competence.id_comp = competence.id_comp
            Competence.Training = []
            competence.Training.forEach((training) => {
                if (yearData.year === new Date(training.date).getFullYear()) {
                    const Training = {} as Training
                    Training.id_train = training.id_train
                    Training.id_comp = training.id_comp
                    Training.name = training.name
                    Training.date = training.date
                    Training.duration = training.duration
                    Training.cost = training.cost
                    Training.topic = training.topic
                    Training.Registration = []
                    training.Registration.forEach((registration) => {
                        const Registration = {} as Registration
                        Registration.date = registration.date
                        Registration.filename = registration.filename
                        Registration.State = registration.State
                        Registration.Operators = registration.Operators
                        Registration.id_op = registration.id_op
                        Registration.id_state = registration.id_state
                        Registration.id_train = registration.id_train
                        Training.Registration.push(Registration)
                    })
                    if (Training.Registration.length !== 0) { Competence.Training.push(Training) }
                }
            })
            //
            if (Competence.Training.length !== 0) { yearData.competences.push(Competence) }
        })
    })

    return {
        data
    }
})
