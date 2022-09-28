<template>
  <TheBreadcrumbs class="p-3" />
  <Suspense>
    <router-view />
  </Suspense>

  <Suspense>
    <custom-calendar />
  </Suspense>
</template>
