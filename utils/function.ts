import { SupabaseClient } from '@supabase/supabase-js'
export function firstLetterToUpperCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export async function fetchSupabaseData(sp:SupabaseClient<unknown, never, never>) {
    const { data: Trainings } = await sp.from('Training').select('id_train, name, date, duration, cost, id_comp, id_conf, id_orga, id_teacher, id_type_train, topic, Registration(date, filename, id_op, id_state)')
    const { data: Competences } = await sp.from('Competences').select('id_comp, tmp_validity')
    // const data = await sp.from('Operators').select('*')
    // console.log(Training)
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
                const dateT = new Date(Training.date)
                const DateTrainEnd = new Date(dateT.setDate(dateT.getDate() + Training.duration))
                const DateExpire = new Date(dateT.setDate(dateT.getDate() + Training.duration + Competences?.find((comp: any) => comp.id_comp === Training.id_comp)?.tmp_validity))
                const today = new Date()

                if (today < dateT && Registration.id_state !== 1) {
                    // sp.from('Registration').update({ id_state: 1 } as never).eq('id_train', Training.id_train).eq('id_op', Registration.id_op)
                    // console.log('this registration need to pass in planned ' + today. + '<' + dateT.getDate(), Registration)
                }

                if (today > dateT && today < DateTrainEnd && Registration.id_state !== 2) {
                    // sp.from('Registration').update({ id_state: 2 } as never).eq('id_train', Training.id_train).eq('id_op', Registration.id_op)
                    // console.log('this registration need to pass in progress ' + today.getDate() + '>' + dateT.getDate() + ' && ' + today.getDate() + '<' + DateTrainEnd.getDate(), Registration)
                }

                if (today > DateTrainEnd && today < DateExpire && Registration.id_state !== 5) {
                    // sp.from('Registration').update({ id_state: 5 } as never).eq('id_train', Training.id_train).eq('id_op', Registration.id_op)
                    // console.log('this registration need to pass in done ' + today.getDate() + '>' + dateT.getDate() + ' && ' + today.getDate() + '<' + DateExpire.getDate(), Registration)
                }

                if (today > DateExpire && Registration.id_state !== 4) {
                    // sp.from('Registration').update({ id_state: 4 } as never).eq('id_train', Training.id_train).eq('id_op', Registration.id_op)
                    // console.log('this registration need to pass in expired ' + today.getDate() + '>' + DateExpire.getDate(), Registration)
                }
            }
        })
    })
}
