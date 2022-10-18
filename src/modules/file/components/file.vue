<template>
  <div>
    <BaseCard class="w-72" :title="fullName" title-width="w-40" action="modules.file.components.card.action" :dropdown-options="dropdownOptions" @action-clicked="cardAction" @dropdown-clicked="async (option: DropdownOption) => await option.action()" />

    <GDialog v-model="showEditModal">
      <div class="p-5">
        <FormKit
          v-model="form"
          type="form"
          :submit-label="$t('common.edit')"
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
        </FormKit>
      </div>
    </GDialog>
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed, ref, toRefs, watch } from 'vue';
import { FileInterface } from '@shared';
import { useFileStore } from '../store/file.store';
import { UpdateFileInterface } from '../types/edit-file.interface';
import { DropdownOption } from '@/modules/common/types';
import { API_BASE_URL } from '@/modules/common/config';

const props = defineProps({
  file: {
    type: Object as PropType<FileInterface>,
    required: true,
  },
});

const { file } = toRefs(props);
const { edit, remove, serve } = useFileStore();

const dropdownOptions = ref<Array<DropdownOption>>([]);

function generateDropdownOptions() {
  dropdownOptions.value = [
    {
      label: 'common.edit',
      action: editAction,
    },
    {
      label: 'common.delete',
      class: 'text-white bg-red-500 hover:bg-red-700',
      action: removeAction,
    },
  ];
}
generateDropdownOptions();

watch(() => file.value, () => {
  generateDropdownOptions();
});

const fullName = computed(() => {
  return `${file.value.name}${file.value.extension}`;
});

async function cardAction() {
  const path = await serve(file.value.id, file.value.name);
  window.open(API_BASE_URL + path, '_blank');
}

async function removeAction() {
  await remove(file.value.id, fullName.value);
}

const showEditModal = ref(false);

function editAction() {
  showEditModal.value = true;
}

const form = ref<UpdateFileInterface>(
  {
    name: file.value.name,
  },
);

async function onSubmit() {
  await edit(file.value.id, form.value);
  showEditModal.value = false;
}
</script>

<route lang="yaml">
name: file
</route>
