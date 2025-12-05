<template>
  <v-container class="account-page" max-width="600">
    <h1 class="text-h4 mb-6">Mon compte</h1>

    <v-card class="pa-6">
      <v-progress-linear
        v-if="loading"
        indeterminate
        color="primary"
        class="mb-4"
      />

      <v-form @submit.prevent="saveProfile">
        <v-text-field
          v-model="profile.email"
          label="Email"
          variant="outlined"
          readonly
          disabled
          class="mb-4"
        />

        <v-text-field
          v-model="profile.username"
          label="Nom d'affichage"
          variant="outlined"
          placeholder="Votre pseudo"
          hint="Ce nom sera affiché sur la page d'accueil"
          persistent-hint
          class="mb-4"
        />

        <v-btn
          type="submit"
          color="primary"
          size="large"
          :loading="saving"
          block
        >
          Enregistrer
        </v-btn>
      </v-form>
    </v-card>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as authService from "@/services/auth";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const loading = ref(true);
const saving = ref(false);
const profile = ref({ email: "", username: "" });
const snackbar = ref({ show: false, message: "", color: "success" });

onMounted(async () => {
  try {
    const data = await authService.getProfile();
    profile.value = { email: data.email, username: data.username || "" };
  } catch (error) {
    snackbar.value = {
      show: true,
      message: "Erreur lors du chargement",
      color: "error",
    };
  } finally {
    loading.value = false;
  }
});

async function saveProfile() {
  saving.value = true;
  try {
    const data = await authService.updateProfile({
      username: profile.value.username,
    });
    // Update store
    authStore.user = { ...authStore.user, username: data.username };
    authStore.persistAuth?.();
    snackbar.value = {
      show: true,
      message: "Profil mis à jour !",
      color: "success",
    };
  } catch (error) {
    snackbar.value = {
      show: true,
      message: "Erreur lors de la sauvegarde",
      color: "error",
    };
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.account-page {
  padding: 2rem 1rem;
}
</style>
