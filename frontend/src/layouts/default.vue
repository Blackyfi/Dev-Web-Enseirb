<template>
  <AppHeader />

  <AppSidebar />

  <v-main class="main-content">
    <router-view />
  </v-main>

  <AppFooter />
</template>

<script setup>
import AppHeader from "@/components/layout/AppHeader.vue";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
</script>

<style scoped>
.main-content {
  padding-bottom: 4rem;
  min-height: 100vh;
}
</style>
