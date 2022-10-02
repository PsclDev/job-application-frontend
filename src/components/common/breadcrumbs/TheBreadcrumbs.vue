<template>
  <div class="flex flex-row">
    <div v-for="(crumb, index) in getBreadcrumbs" :key="crumb.label" class="flex flex-row">
      <a class="cursor-pointer" :class="index === getBreadcrumbs.length - 1 ? 'text-emerald-400 font-bold' : ''" @click="router.push(crumb.to)">
        {{ crumb.translate ? $t(crumb.label) : crumb.label }}
      </a>
      <p class="px-1">
        {{ index < getBreadcrumbs.length - 1 ? ' > ' : '' }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useBreadcrumbsStore } from '@/modules/breadcrumbs/store/breadcrumbsStore';
const router = useRouter();
const { getBreadcrumbs } = storeToRefs(useBreadcrumbsStore());
</script>
