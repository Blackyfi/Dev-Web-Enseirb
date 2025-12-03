<template>
  <v-app>
    <v-main class="auth-layout">
      <div class="auth-container">
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
//
</script>

<style scoped>
.auth-layout {
  background: #121212;
  height: 100vh;
  padding: 0 !important;
  overflow: hidden;
}

.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
}
</style>
