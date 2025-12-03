<template>
  <div class="home-page">
    <div class="hero">
      <h1 class="title">Bienvenue sur SeenFlix</h1>
      <p class="description">
        Votre plateforme pour rechercher, découvrir et gérer vos films et séries préférés.
        Créez votre liste de favoris (et peut être un jour si on y arrive... des collections partagées)!
      </p>
    </div>

    <div class="actions">
      <div v-if="!isAuthenticated" class="auth-actions">
        <h2>Commencez maintenant</h2>
        <div class="buttons">
          <router-link to="/register" class="btn btn-primary">
            Créer un compte
          </router-link>
          <router-link to="/login" class="btn btn-secondary">
            Se connecter
          </router-link>
        </div>
      </div>

      <div v-else class="user-actions">
        <h2>Que voulez-vous faire ?</h2>
        <div class="buttons">
          <router-link to="/search" class="btn btn-primary">
            Rechercher des films
          </router-link>
          <router-link to="/favorites" class="btn btn-secondary">
            Mes favoris
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.hero {
  text-align: center;
  padding: 3rem 0;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #e50914;
}

.description {
  font-size: 1.2rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.actions {
  margin-top: 3rem;
  text-align: center;
}

.actions h2 {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #333;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.875rem 2rem;
  font-size: 1rem;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-weight: 500;
  display: inline-block;
}

.btn-primary {
  background-color: #e50914;
  color: white;
}

.btn-primary:hover {
  background-color: #b20710;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #333;
  color: white;
}

.btn-secondary:hover {
  background-color: #222;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .description {
    font-size: 1rem;
  }

  .actions h2 {
    font-size: 1.5rem;
  }

  .buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>
