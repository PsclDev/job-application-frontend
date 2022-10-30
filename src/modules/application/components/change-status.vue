<template>
  <div class="p-5 flex flex-col justify-center">
    <p class="text-2xl text-bold text-center mb-8">
      {{ $t('modules.application.modal.change.title') }}
    </p>

    <FormKit
      id="change-status"
      v-slot="{ state: { valid } }"
      v-model="form"
      type="form"
      :actions="false"
      @submit="onSubmit"
    >
      <FormKit
        name="state"
        type="select"
        :options="stateOptions"
        :label="$t('modules.application.modal.change.state')"
        :placeholder="$t('modules.application.modal.change.select-state')"
        validation="required"
      />

      <FormKit
        type="date"
        name="date"
        :label="$t('modules.application.modal.change.date')"
        validation="required"
      />

      <FormKit
        type="submit"
        :disabled="!valid"
        :label="$t('common.update')"
      />
    </FormKit>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRefs } from 'vue';
import { reset } from '@formkit/vue';
import { StatusInterface } from '@shared';
import { DateTime } from 'luxon';
import { useApplicationStore } from '@module/application/store/application.store';
import { getStatusFormOptions } from '@module/application/utils/status-options';
import { getFormDateFormat } from '@module/common/utils';

const props = defineProps({
  applicationId: {
    type: String,
    required: true,
  },
  status: {
    type: Array<StatusInterface>,
    required: true,
  },
});

const emit = defineEmits(['submit']);
const { applicationId, status } = toRefs(props);

const initialState = ref<{ state: string; date: string }>({
  state: '',
  date: DateTime.now().toFormat(getFormDateFormat()),
});

const form = ref<{ state: string; date: string }>(
  {
    ...initialState.value,
  },
);

const stateOptions = ref(getStatusFormOptions(status.value.map(s => s.state)));
const { changeStatus } = useApplicationStore();

async function onSubmit() {
  await changeStatus(applicationId.value, form.value);

  reset('change-status');
  emit('submit');
}
</script>
