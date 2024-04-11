export default defineNuxtRouteMiddleware(async (to, _from) => {
    const sp = useSupabaseClient()
    const user = useSupabaseUser()

    if (to.path === '/auth/login' || to.path === '/auth/signup' || to.path === '/auth/logout' || to.path === '/unauthorized' || to.path === '/auth/callback') {
        return
    }

    if (!user.value) {
        return navigateTo('/auth/login')
    }

    const { data: auth, error } = await sp.from('Authorization').select('is_allowed').eq('user_id', user.value!.id).single()

    if (error) {
        await sp.from('Authorization').insert({
            user_id: user.value.id,
            is_allowed: false,
        })
        return navigateTo('/')
    }

    if (!auth || !auth.is_allowed) {
        return navigateTo('/unauthorized')
    }
})
