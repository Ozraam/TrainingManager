<script setup lang="ts">
const props = defineProps({
    currentTraining: {
        type: String,
        required: true,
    },
})

const sp = useSupabaseClient()

const training = ref<{
    id_train: number,
    name: string,
    cost: number,
    date: string,
    duration: number,
    topic: string,
    Registration: {
        Operators: {
            name: string,
            surname: string,
            id_op: number,
        }[],
        State: {
            name: string,
        },
        date: string,
    }[],
    Type_training: {
        name: string,
    },
    Type_confirmation: {
        name: string,
    },
    Teacher: {
        name: string,
        surname: string,
        id_teacher: number,
    },
    Competences: {
        id_comp: number,
        name: string,
    },
} | null>(null)

const { data } = await sp.from('Training').select('*, Registration(*, State(*), Operators(*)), Competences(*), Type_confirmation(*), Type_training(*), Teacher(*)').eq('id_train', props.currentTraining)

training.value = data?.[0] ?? null

function changeState() {
    // TODO : This is a placeholder for the real save
    alert('State changed - TODO')
}

function deleteTraining() {
    // TODO : This is a placeholder for the real save
    alert('Training deleted - TODO')
}

function downloadCertificate() {
    // TODO : This is a placeholder for the real save
    alert('Certificate downloaded - TODO')
}
</script>

<template>
    <div
        v-if="training"
        class="m-3"
    >
        <h2 class="text-2xl underline">
            {{ firstLetterToUpperCase(training?.name) }}
        </h2>

        <div class="flex justify-between gap-20">
            <div>
                <p>
                    <span class="font-bold">Competence:</span> {{ training?.Competences.name }}
                </p>

                <p>
                    <span class="font-bold">Teacher:</span>

                    <UButton
                        variant="link"
                        :to="'/teacher?search=' + training?.Teacher.name + ' ' + training?.Teacher.surname"
                    >
                        {{ training?.Teacher.name }} {{ training?.Teacher.surname }}
                    </UButton>
                </p>

                <p>
                    <span class="font-bold">Duration:</span> {{ training?.duration }} hours
                </p>

                <p>
                    <span class="font-bold">Cost:</span> {{ training?.cost }} €
                </p>

                <p>
                    <span class="font-bold">Type:</span> {{ training?.Type_training.name }}
                </p>

                <p>
                    <span class="font-bold">Confirmation:</span> {{ training?.Type_confirmation.name }}
                </p>

                <p>
                    <span class="font-bold">Topic:</span> {{ training?.topic }}
                </p>
            </div>

            <div>
                <h3 class="text-xl">
                    Registrations
                </h3>

                <UTable
                    :rows="training?.Registration.map((r) => {
                        return {
                            Operators: r.Operators,
                            State: r.State.name,
                            Date: new Date(r.date).toLocaleDateString(),
                            action: ''
                        }
                    })"
                >
                    <template #Operators-data="{ row }">
                        <UButton
                            variant="link"
                            :to="`/operator/${row.Operators.id_op}`"
                            class="p-0"
                        >
                            {{ row.Operators.name }} {{ row.Operators.surname }}
                        </UButton>
                    </template>

                    <template #action-data="{ row }">
                        <UButton
                            v-if="row.State !== 'done' && row.State !== 'expired'"
                            label="Change state"
                            size="xs"
                            class="ml-2"
                            @click="changeState"
                        />

                        <UButton
                            v-else
                            label="Certificate"
                            size="xs"
                            class="ml-2"
                            @click="downloadCertificate"
                        />
                    </template>
                </UTable>
            </div>
        </div>

        <div class="flex gap-3">
            <UButton
                label="Delete"
                color="red"
                @click="deleteTraining"
            />

            <UButton
                label="Edit"
                @click="deleteTraining"
            />
        </div>
    </div>

    <div v-else>
        <p>Loading...</p>
    </div>
</template>
