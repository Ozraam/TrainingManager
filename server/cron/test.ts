/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js'
import { defineCronHandler } from '#nuxt/cron'

export default defineCronHandler('everyMinute', async () => {
//     const sp = createClient(
//         process.env.SUPABASE_URL!,
//         process.env.SUPABASE_KEY!
//     )

//     const { data } = await sp.from('Training').select('*')
//     console.log('This will run every minute')
//     console.log(data)
})
