<script setup lang="ts">
const props = defineProps<{
    registration: Registration;
}>()
const isRegistrationEditing: Ref<boolean> = ref(false)
function toggleRegistrationEdit() {
    isRegistrationEditing.value = !isRegistrationEditing.value
}
console.log(props.registration)

defineEmits(['update'])
</script>

<template>
    <div
        class="flex items-center gap-3 justify-between"
    >
        <p>{{ registration.Operators.name }} {{ registration.Operators.surname }} : {{ registration.State.name }}</p>

        <div class="flex gap-2">
            <UButton
                v-if="registration.State.name !== 'done' && registration.State.name !== 'expired'"
                label="Mark as done"
                icon="i-heroicons-check"
                @click="toggleRegistrationEdit"
            />

            <UButton
                label="View profile"
                icon="i-heroicons-user-circle"
                :to="`/operator/${registration.Operators.id_op}`"
            />
        </div>

        <RegistrationChangeState
            :registration="registration"
            :is-editing="isRegistrationEditing"
            @close="toggleRegistrationEdit"
            @update="$emit('update')"
        />
    </div>
</template>
