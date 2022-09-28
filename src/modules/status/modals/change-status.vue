<template>
  <BaseModal v-if="modelValue" :hide-actions="true" @hide="hideModal">
    <template #title>
      {{ $t('modules.application.modals.move.title') }}
    </template>
    <template #body>
      <FormKit
        v-model="form"
        type="form"
        :submit-label="$t('modules.application.modals.move.submit')"
        @submit="onSubmit"
      >
        <FormKit
          name="state"
          type="select"
          :options="stateOptions"
          :placeholder="$t('modules.application.modals.move.description')"
        />
      </FormKit>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref, toRefs } from 'vue';
import { StateEnum } from '@shared';
import { CreateStatusInterface } from '../types/create-status.interface';
import { useApplicationStore } from '@/modules/application/store/applicationStore';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  id: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'edited']);
const { modelValue, id } = toRefs(props);
const { changeStatus } = useApplicationStore();
const form = ref<CreateStatusInterface>({
  state: StateEnum.PENDING,
  date: new Date(),
});

const stateOptions = ref({} as any);
const app = getCurrentInstance();
const translation = app?.appContext.config.globalProperties.$t;
Object.keys(StateEnum).forEach((s: string) => {
  stateOptions.value[s] = translation(`enum.state.${s}`);
});

function hideModal() {
  emit('update:modelValue', !modelValue);
}

function onSubmit() {
  changeStatus(id.value, form.value);
  hideModal();
}
</script>
