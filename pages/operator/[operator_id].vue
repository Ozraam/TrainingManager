<script setup lang="ts">
const route = useRoute()

const operatorId = route.params.operator_id.toString()
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
            <OperatorSelect :current-operator="operatorId" />

            <OperatorDetails :current-operator="operatorId" />
        </div>
    </main>
</template>
