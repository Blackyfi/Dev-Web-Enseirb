<template>
  <v-container class="home-page">
    <!-- Hero Section -->
    <v-row class="hero-section mb-8" align="center">
      <v-col cols="12" md="6">
        <h1 class="text-h2 font-weight-bold text-primary mb-4">
          Seenflix
        </h1>
        <p class="text-h5 mb-6">
          Découvrez, recherchez et gérez vos films et séries préférés
        </p>
        <div class="d-flex flex-wrap gap-3">
          <v-btn
            v-if="!authStore.isAuthenticated"
            size="x-large"
            color="primary"
            @click="$router.push('/login')"
          >
            Commencer
          </v-btn>
          <v-btn
            size="x-large"
            :color="authStore.isAuthenticated ? 'primary' : 'secondary'"
            variant="outlined"
            @click="$router.push('/search')"
          >
            Rechercher
          </v-btn>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <v-img
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800"
          alt="Cinema"
          class="rounded-lg elevation-8"
        />
      </v-col>
    </v-row>

    <!-- Features Section -->
    <v-row class="mb-8">
      <v-col cols="12">
        <h2 class="text-h4 mb-6 text-center">Fonctionnalités</h2>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="feature-card text-center pa-4" elevation="2">
          <v-icon size="64" color="primary" class="mb-4">mdi-magnify</v-icon>
          <h3 class="text-h5 mb-2">Recherche</h3>
          <p>
            Recherchez parmi des milliers de films et séries grâce à l'API TMDB
          </p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="feature-card text-center pa-4" elevation="2">
          <v-icon size="64" color="primary" class="mb-4">mdi-heart</v-icon>
          <h3 class="text-h5 mb-2">Favoris</h3>
          <p>
            Créez votre liste personnelle de films et séries favoris
          </p>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="feature-card text-center pa-4" elevation="2">
          <v-icon size="64" color="primary" class="mb-4">mdi-shield-check</v-icon>
          <h3 class="text-h5 mb-2">Sécurisé</h3>
          <p>
            Authentification sécurisée avec JWT et refresh tokens
          </p>
        </v-card>
      </v-col>
    </v-row>

    <!-- CTA Section -->
    <v-row v-if="!authStore.isAuthenticated">
      <v-col cols="12">
        <v-card color="primary" dark class="pa-8 text-center">
          <h2 class="text-h4 mb-4">Prêt à commencer ?</h2>
          <p class="text-h6 mb-6">
            Créez votre compte gratuitement et commencez à gérer vos films préférés
          </p>
          <v-btn
            size="x-large"
            color="white"
            variant="flat"
            @click="$router.push('/login')"
          >
            S'inscrire maintenant
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- User Section -->
    <v-row v-else>
      <v-col cols="12">
        <v-card class="pa-6">
          <h2 class="text-h4 mb-4">
            Bienvenue, {{ authStore.user?.firstName || authStore.user?.email }} !
          </h2>
          <p class="text-h6 mb-4">Que souhaitez-vous faire aujourd'hui ?</p>
          <div class="d-flex flex-wrap gap-3">
            <v-btn color="primary" size="large" @click="$router.push('/search')">
              <v-icon left>mdi-magnify</v-icon>
              Rechercher des films
            </v-btn>
            <v-btn color="secondary" size="large" @click="$router.push('/favorites')">
              <v-icon left>mdi-heart</v-icon>
              Voir mes favoris
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.home-page {
  padding: 40px 20px;
}

.hero-section {
  min-height: 60vh;
}

.feature-card {
  height: 100%;
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-8px);
}

.gap-3 {
  gap: 12px;
}
</style>
