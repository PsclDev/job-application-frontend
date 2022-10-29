<template>
  <span class="absolute -mt-3 text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-700 bg-emerald-300">
    {{ $t(`enum.state.${status.toLowerCase()}`) }}
  </span>
</template>

<script lang="ts" setup>
import { StateEnum } from '@shared';
import { PropType, toRefs } from 'vue';

const props = defineProps({
  status: {
    type: String as PropType<StateEnum>,
    required: true,
  },
});
const { status } = toRefs(props);
</script>
