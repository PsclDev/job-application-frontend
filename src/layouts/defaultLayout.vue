<template>
  <div class="mx-5 mt-10">
    <div class="flex items-center justify-between mb-5">
      <TheBreadcrumbs />
      <div class="flex gap-3">
        <CalendarHeader />
        <FileHeader />
      </div>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import CalendarHeader from '@/modules/calendar/components/calendar-header.vue';
import FileHeader from '@/modules/file/components/file-header.vue';
</script>
