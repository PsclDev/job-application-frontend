<template>
  <div class="mx-5 mt-10">
    <div class="flex items-center justify-between mb-5">
      <TheBreadcrumbs />
      <FileHeader />
    </div>
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import FileHeader from '@/modules/file/components/file-header.vue';
</script>
