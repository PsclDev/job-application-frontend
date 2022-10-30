<template>
  <div class="p-5 flex flex-col justify-center">
    <p class="text-2xl text-bold text-center mb-8">
      {{ $t(mode === 'CREATE' ? 'modules.group.modal.form.create' : 'modules.group.modal.form.edit') }}
    </p>

    <FormKit
      id="create-edit-group"
      v-model="form"
      type="form"
      :submit-label="$t(mode === 'CREATE' ? 'common.create' : 'common.update')"
      @submit="onSubmit"
    >
      <FormKit
        name="name"
        type="text"
        :label="$t('modules.group.modal.form.name')"
        validation="required"
        minlength="3"
        maxlength="50"
        validation-visibility="dirty"
      />

      <FormKit
        name="description"
        type="text"
        :label="$t('modules.group.modal.form.description')"
        maxlength="155"
        validation-visibility="dirty"
      />
    </FormKit>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, toRefs } from 'vue';
import { GroupInterface } from '@shared';
import { reset } from '@formkit/core';
import { CreateGroupInterface } from '@module/group/types/group.interface';
import { useGroupStore } from '@module/group/store/group.store';
import { FormMode } from '@module/common/types';

const props = defineProps({
  mode: {
    type: String as PropType<FormMode>,
    default: 'CREATE',
  },
  group: {
    type: Object as PropType<GroupInterface>,
  },
});

const emit = defineEmits(['submit']);

const { mode, group } = toRefs(props);
const initialState = ref<CreateGroupInterface>({
  name: '',
  description: '',
});

const form = ref<CreateGroupInterface>(
  {
    ...(mode.value === FormMode.EDIT ? group!.value! : initialState.value),
  },
);

const groupStore = useGroupStore();
const { create, edit } = groupStore;

async function onSubmit() {
  if (mode.value === FormMode.CREATE) {
    await create(form.value);
  } else {
    await edit(group!.value!.id, form.value);
  }

  reset('create-edit-group');
  emit('submit');
}
</script>
