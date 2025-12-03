<script setup>
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<template>
    <v-app-bar app height="100" color="secondary" flat>
      <v-toolbar-title class="apptitle text-primary">Seenflix</v-toolbar-title>

      <v-spacer />

      <span v-if="authStore.isAuthenticated && authStore.user" class="mr-4 text-h6 text-white">
        Bonjour, {{ authStore.user.firstName || authStore.user.email }} !
      </span>
      

      <span class="logo text-primary">S</span>
    </v-app-bar>
</template>

<style scoped>
.apptitle {
  font-weight: bold;
  font-size: 32px;
}

.logo {
  font-size: 50px;
  margin-right: 30px;
}
</style>
