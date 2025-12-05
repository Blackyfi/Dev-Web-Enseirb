<template>
  <v-navigation-drawer
    app
    permanent
    :width="280"
    color="secondary"
  >
    <!-- Section recherche -->
    <v-list class="pa-4">
      <v-text-field
        v-model="searchQuery"
        placeholder="Rechercher un film ou une série ..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        hide-details
        class="mb-4"
        color="primary"
        @keyup.enter="handleSearch"
      />
    </v-list>

    <v-divider />

    <!-- Menu de navigation -->
    <v-list nav density="comfortable" class="py-4">
      <v-list-item
        prepend-icon="mdi-home"
        title="Accueil"
        value="home"
        color="primary"
        @click="navigateTo('/')"
      />

      <v-list-item
        prepend-icon="mdi-movie-open"
        title="Rechercher"
        value="search"
        color="primary"
        @click="navigateTo('/search')"
      />

      <v-list-item
        prepend-icon="mdi-heart"
        title="Mes favoris"
        value="favorites"
        color="primary"
        @click="navigateTo('/favorites')"
      />
    </v-list>

    <v-divider />

    <!-- Section utilisateur en bas -->
    <template v-slot:append>
      <v-list class="pa-4">
        <v-list-item
          v-if="authStore.isAuthenticated && authStore.user"
          class="mb-2 user-section"
        >
          <template v-slot:prepend>
            <v-avatar color="primary" size="40">
              <span class="text-white text-h6">
                {{ getUserInitials() }}
              </span>
            </v-avatar>
          </template>

          <v-list-item-title class="text-white font-weight-medium">
            {{ authStore.user.firstName || authStore.user.email }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-grey">
            {{ authStore.user.email }}
          </v-list-item-subtitle>
        </v-list-item>

        <v-btn
          v-if="authStore.isAuthenticated"
          block
          color="primary"
          variant="outlined"
          prepend-icon="mdi-logout"
          @click="handleLogout"
        >
          Déconnexion
        </v-btn>

        <v-btn
          v-else
          block
          color="primary"
          variant="flat"
          prepend-icon="mdi-login"
          @click="navigateTo('/login')"
        >
          Connexion
        </v-btn>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const searchQuery = ref('')

const navigateTo = (path) => {
  router.push(path)
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value.trim() }
    })
  }
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}

const getUserInitials = () => {
  if (!authStore.user) return '?'

  if (authStore.user.firstName) {
    return authStore.user.firstName.charAt(0).toUpperCase()
  }

  if (authStore.user.email) {
    return authStore.user.email.charAt(0).toUpperCase()
  }

  return '?'
}
</script>

<style scoped>
.v-navigation-drawer {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.v-list-item {
  border-radius: 8px;
  margin-bottom: 4px;
}

.v-list-item:hover {
  background-color: rgba(229, 9, 20, 0.1);
}

.v-list-item--active {
  background-color: rgba(229, 9, 20, 0.2);
}

.user-section {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

:deep(.v-field--variant-outlined) {
  --v-field-border-opacity: 0.3;
}

:deep(.v-field--variant-outlined:hover) {
  --v-field-border-opacity: 0.6;
}

:deep(.v-field__input) {
  color: white;
}

:deep(.v-field__input::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}
</style>
