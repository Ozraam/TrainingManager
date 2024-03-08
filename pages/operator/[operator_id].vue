<script setup lang="ts">
const route = useRoute()

const operatorId = route.params.operator_id.toString()

const loadOperator = ref(false)
</script>

<template>
    <main class="h-screen flex flex-col">
        <PageHeader
            title="Operator"
            :title-link="`/operator/${operatorId}`"
            :actions="[
                {
                    label: $t('operator.add'),
                    callBack: () => navigateTo('/operator/add')
                },
            ]"
        />

        <div class="flex grow">
            <OperatorSelect
                :current-operator="operatorId"
                @load-operator="loadOperator = true"
            />

            <OperatorDetails
                v-if="!loadOperator"
                :current-operator="operatorId"
            />

            <div
                v-else
                class="w-full flex justify-center items-center"
            >
                <CircleLoader />
            </div>
        </div>
    </main>
</template>
