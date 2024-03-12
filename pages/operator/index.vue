<script setup lang="ts">
const sp = useSupabaseClient()

const { data } = await sp.from('Operators').select('id_op').order('name')

navigateTo(`/operator/${data![0].id_op}`)
</script>
