<template>
  <div class="p-5 flex flex-col justify-center">
    <p class="text-2xl text-bold text-center mb-8">
      {{ $t('modules.application.modal.move.title') }}
    </p>

    <FormKit
      id="move-application"
      v-slot="{ state: { valid } }"
      v-model="form"
      type="form"
      :actions="false"
      @submit="onSubmit"
    >
      <FormKit
        name="groupId"
        type="select"
        :options="groupOptions"
        :label="$t('modules.application.modal.move.select')"
        :placeholder="$t('modules.application.modal.move.new')"
        validation="required"
      />

      <FormKit
        type="submit"
        :disabled="!valid"
        :label="$t('common.move')"
      />
    </FormKit>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue';
import { reset } from '@formkit/vue';
import { storeToRefs } from 'pinia';
import { useApplicationStore } from '../store/application.store';
import { useGroupStore } from '@/modules/group/store/group.store';

const props = defineProps({
  applicationId: {
    type: String,
    required: true,
  },
  groupId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['submit']);

const { applicationId, groupId } = toRefs(props);

const initialState = ref({
  groupId: '',
});

const form = ref(
  {
    ...initialState.value,
  },
);

const { groups } = storeToRefs(useGroupStore());
const groupOptions = ref<any>({});

groups.value.filter(g => g.id !== groupId.value && !g.isArchived).forEach((group) => {
  groupOptions.value[group.id] = group.name;
});

const { move } = useApplicationStore();

async function onSubmit() {
  await move(applicationId.value, form.value.groupId);

  reset('move-application');
  emit('submit');
}
</script>
