<script setup lang="ts">
const sp = useSupabaseClient()

const { data } = await sp.from('Competences').select('id_comp').order('name')

navigateTo(`/competence/${data![0].id_comp}`)
</script>
