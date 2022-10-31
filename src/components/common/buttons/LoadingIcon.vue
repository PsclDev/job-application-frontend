<template>
  <LoaderIcon
    class="spin-animation"
    :class="{
      'h-4 w-4': size === 'xs',
      'h-5 w-5': size === 'sm',
      'h-8 w-8': size === 'md',
      'h-12 w-12': size === 'xl',
    }"
  />
</template>

<script lang="ts">
import { LoaderIcon } from '@zhuowenli/vue-feather-icons';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    LoaderIcon,
  },
  props: {
    size: {
      type: String,
      default: 'md',
    },
  },
});
</script>

<style>
</style>
