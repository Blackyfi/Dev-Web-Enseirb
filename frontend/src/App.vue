<template>
  <div id="app">
    <nav class="navbar" v-if="isAuthenticated">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">SeenFlix</router-link>
        <div class="nav-links">
          <router-link to="/search" class="nav-link">Recherche</router-link>
          <router-link to="/favorites" class="nav-link">Favoris</router-link>
          <button @click="handleLogout" class="btn-logout">Déconnexion</button>
        </div>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const isAuthenticated = computed(() => authStore.isAuthenticated)

function handleLogout() {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  background-color: #141414;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.8rem;
  font-weight: bold;
  color: #e50914;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: #fff;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #e50914;
}

.btn-logout {
  background-color: transparent;
  color: #fff;
  border: 1px solid #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout:hover {
  background-color: #e50914;
  border-color: #e50914;
}

main {
  min-height: calc(100vh - 80px);
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .nav-brand {
    font-size: 1.5rem;
  }
}
</style>
