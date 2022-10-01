<template>
  <suspense>
    <router-view />
  </suspense>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
import { useGroupStore } from './modules/group/store/group.store';
import { DEFAULT_APP_TITLE } from '@/modules/common/config';

const { loadAll: loadAllGroups } = useGroupStore();
loadAllGroups();

defineComponent({
  watch: {
    $route: {
      handler() {
        this.setTitle();
      },
      immediate: true,
    },
  },
  methods: {
    setTitle() {
      document.title = `${String(this.$route.name)} - ${DEFAULT_APP_TITLE}`;
    },
  },
});
</script>
