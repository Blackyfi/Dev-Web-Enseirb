<template>
  <AppHeader />

  <AppSidebar />

  <v-main class="main-content">
    <router-view />
  </v-main>

  <AppFooter />
</template>

<script setup>
//
</script>

<style scoped>
.main-content {
  padding-bottom: 4rem;
  min-height: 100vh;
}
</style>
