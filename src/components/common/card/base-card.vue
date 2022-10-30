<template>
  <div class="block p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 hover:drop-shadow-2xl" :class="archived ? 'archived' : ''">
    <ArchivedBadge v-if="archived" class="absolute -mt-3" />
    <div class="flex flex-col">
      <div class="flex gap-4 justify-between">
        <div class="flex grow flex-col">
          <div class="inline-block" :class="titleWidth ? titleWidth : ''">
            <p class="text-2xl font-bold truncate">
              {{ title }}
            </p>
          </div>
          <p v-if="description" class="text-lg">
            {{ description }}
          </p>
        </div>
        <div>
          <div class="dropdown inline-block relative">
            <button class="py-2 px-3">
              <MoreVerticalIcon size="1.25x" />
            </button>

            <div class="absolute w-96">
              <ul class="dropdown-menu cursor-pointer absolute invisible pt-2">
                <li v-for="option in dropdownOptions" :key="option.label">
                  <a class="rounded-t py-2 px-4 block whitespace-no-wrap" :class="option.class ? option.class : 'bg-gray-100 hover:bg-gray-300'" @click="dropdownClicked(option)">{{ $t(option.label) }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-7 flex-none basis-1/4">
        <button class="px-6 py-2 text-sm rounded shadow bg-emerald-100 hover:bg-emerald-300 text-emerald-500 hover:text-emerald-700 inline-flex items-center" @click="actionClicked">
          {{ $t(action) }}
          <ArrowRightIcon size="1.5x" class="ml-2 -mr-1 w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
import { ArrowRightIcon, MoreVerticalIcon } from '@zhuowenli/vue-feather-icons';
import { DropdownOption } from '@module/common/types';
import ArchivedBadge from '@global/badge/archived-badge.vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  titleWidth: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  action: {
    type: String,
    required: true,
  },
  dropdownOptions: {
    type: Array<DropdownOption>,
    required: true,
  },
  archived: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['actionClicked', 'dropdownClicked']);
const { action, dropdownOptions } = toRefs(props);

function actionClicked() {
  emit('actionClicked');
}

function dropdownClicked(option: DropdownOption) {
  emit('dropdownClicked', option);
}
</script>

<style lang="scss">
.dropdown:hover .dropdown-menu {
    visibility: visible;
    top: 0;
}

.archived {
  background: rgba(255, 255, 255, 0.25);
  color: rgba(0, 0, 0, 0.50);
}
</style>
