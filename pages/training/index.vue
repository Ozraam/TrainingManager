<script setup lang="ts">
const sp = useSupabaseClient()

const { data } = await sp.from('Training').select('id_train').order('name')

navigateTo(`/training/${data![0].id_train}`)
</script>
