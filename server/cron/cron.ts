import { createClient } from '@supabase/supabase-js'
import { defineCronHandler } from '#nuxt/cron'

// function getDate(date: Date) {
//     return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
// }

export default defineCronHandler('daily', async () => {
    const sp = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_KEY!
    )

    const { data: Trainings } = await sp.from('Training').select('id_train, name, date, duration, cost, id_comp, id_conf, id_orga, id_teacher, id_type_train, topic, Registration(date, filename, id_op, id_state)')
    const { data: Competences } = await sp.from('Competences').select('id_comp, tmp_validity')
    // const data = await sp.from('Operators').select('*')
    // console.log(Trainings)
    // console.log(Competences)

    /**
     * state ID
     * 1 = planned
     * 2 = in progress
     * 3 = delayed
     * 4 = expired
     * 5 = done
     */
    // console.log(Trainings)
    Trainings?.forEach((Training: any) => {
        Training.Registration.forEach((Registration: any) => {
            if (Registration.id_state !== 3) {
                // const dateR = new Date(Registration.date)
                const today = new Date()
                let dateT = new Date(Training.date)
                const DateTrainEnd = new Date(dateT.setDate(today.getDate() + Training.duration))
                const DateExpire = new Date(dateT.setDate(today.getDate() + Training.duration + Competences?.find((comp: any) => comp.id_comp === Training.id_comp)?.tmp_validity))
                dateT = new Date(Training.date)

                // console.log('-------------------------------------')
                // console.log('today', getDate(today))
                // console.log('dateT', getDate(dateT))
                // console.log('DateTrainEnd', getDate(DateTrainEnd))
                // console.log('DateExpire', getDate(DateExpire))

                // console.log(today < dateT)

                if (today < dateT && Registration.id_state !== 1) {
                    sp.from('Registration').update({ id_state: 1 } as never).eq('id_train', Training.id_train).eq('id_op', Registration.id_op)
                    // console.log('this registration need to pass in planned ' + getDate(today) + '<' + getDate(dateT), Registration)
                }

                if (dateT < today && today < DateTrainEnd && Registration.id_state !== 2) {
                    sp.from('Registration').update({ id_state: 2 } as never).eq('id_train', Training.id_train).eq('id_op', Registration.id_op)
                    // console.log('this registration need to pass in progress ' + getDate(dateT) + '>' + getDate(today) + ' && ' + getDate(today) + '<' + getDate(DateTrainEnd), Registration)
                }

                if (DateTrainEnd < today && today < DateExpire && Registration.id_state !== 5) {
                    sp.from('Registration').update({ id_state: 5 } as never).eq('id_train', Training.id_train).eq('id_op', Registration.id_op)
                    // console.log('this registration need to pass in done ' + getDate(DateTrainEnd) + '>' + getDate(today) + ' && ' + getDate(today) + '<' + getDate(DateExpire), Registration)
                }

                if (DateExpire < today && Registration.id_state !== 4) {
                    sp.from('Registration').update({ id_state: 4 } as never).eq('id_train', Training.id_train).eq('id_op', Registration.id_op)
                    // console.log('this registration need to pass in expired ' + getDate(DateExpire) + '<' + getDate(today), Registration)
                }
            }
        })
    })
})
