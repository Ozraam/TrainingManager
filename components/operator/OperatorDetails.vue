<script setup lang="ts">
const props = defineProps({
    currentOperator: {
        type: String,
        required: true,
    },
})

const sp = useSupabaseClient()

const { data } = await sp.from('Person').select('*, Role (*), Validity(*, Competence (*))').eq('id_pers', props.currentOperator)

const operator : Ref<{
    id_pers: number,
    name: string,
    surname: string,
    id_role: number,
    Role: {
        id_role: number, name: string
    },
    Validity: {
        id_comp: number,
        id_pers: number,
        verified: boolean,
        date: string,
        Competence: {
            id_comp: number,
            name: string,
            id_role: number
        }
    }[]
} | null> = ref(data?.[0] ?? null)
</script>

<template>
    <div
        v-if="operator"
        class="m-3"
    >
        <h2 class="text-2xl">
            {{ operator!.name }} {{ operator!.surname }}
        </h2>

        <h3>
            {{ operator.Role.name }} <!-- TODO : Translate -->
        </h3>

        <div class="mt-3">
            <h4>{{ $t("operator.competence") }}</h4>

            <ul>
                <li
                    v-for="competence in operator.Validity"
                    :key="competence.id_comp"
                >
                    {{ competence.Competence.name }} : <span
                        :class="{
                            'text-green-500': competence.verified,
                            'text-red-500': !competence.verified
                        }"
                    >
                        {{ new Date(competence.date).toLocaleDateString() }}
                    </span>

                    <span v-if="!competence.verified"> : {{ $t("operator.renew") }}</span>
                </li>
            </ul>
        </div>
    </div>

    <div v-else>
        Error
    </div>
</template>
