<template>
  <v-container>
    <h1 class="text-h4 mb-6">Rechercher</h1>

    <v-card class="mb-6">
      <v-card-text>
        <!-- Type Filter Toggle -->
        <v-btn-toggle
          v-model="filterType"
          mandatory
          color="primary"
          class="mb-4"
          rounded="pill"
        >
          <v-btn value="all">
            <v-icon start>mdi-multimedia</v-icon>
            Tous
          </v-btn>
          <v-btn value="movie">
            <v-icon start>mdi-movie</v-icon>
            Films
          </v-btn>
          <v-btn value="tv">
            <v-icon start>mdi-television-classic</v-icon>
            Séries
          </v-btn>
        </v-btn-toggle>

        <v-text-field
          v-model="searchQuery"
          label="Rechercher un film ou une série..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          @keyup.enter="handleSearch"
          clearable
        />
        <v-btn
          color="primary"
          size="large"
          @click="handleSearch"
          :loading="loading"
          :disabled="!searchQuery"
          block
        >
          Rechercher
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Résultats de recherche -->
    <v-row v-if="results.length > 0">
      <v-col
        v-for="item in results"
        :key="`${item.media_type || filterType}-${item.id}`"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <MovieCard
          :movie="normalizedItem(item)"
          :show-favorite-button="authStore.isAuthenticated"
          :show-type="true"
          @add-favorite="addToFavorites"
        />
      </v-col>
    </v-row>

    <!-- Message si aucun résultat -->
    <v-alert
      v-else-if="searched && !loading"
      type="info"
      variant="tonal"
      class="mt-4"
    >
      Aucun résultat trouvé pour "{{ lastSearchQuery }}"
    </v-alert>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="bottom right">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Fermer</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import * as moviesService from '@/services/movies'
import * as favoritesService from '@/services/favorites'
import MovieCard from '@/components/MovieCard.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const searchQuery = ref(route.query.q || '')
const lastSearchQuery = ref('')
const results = ref([])
const loading = ref(false)
const searched = ref(false)
const filterType = ref(route.query.type || 'all')

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Rechercher au chargement si query présente
if (searchQuery.value) {
  handleSearch()
}

// Re-search when filter type changes (if we have a query)
watch(filterType, () => {
  if (searchQuery.value && searched.value) {
    handleSearch()
  }
})

async function handleSearch() {
  if (!searchQuery.value) return

  loading.value = true
  searched.value = true
  lastSearchQuery.value = searchQuery.value

  try {
    const response = await moviesService.searchMulti(searchQuery.value, filterType.value)
    results.value = response.results || []

    // Mettre à jour l'URL
    router.push({ query: { q: searchQuery.value, type: filterType.value } })
  } catch (error) {
    console.error('Erreur de recherche:', error)
    results.value = []
  } finally {
    loading.value = false
  }
}

// Normalize item to ensure it has a type property
function normalizedItem(item) {
  return {
    ...item,
    // Use media_type from TMDB multi-search, or infer from filterType, or default to movie
    type: item.media_type || (filterType.value !== 'all' ? filterType.value : 'movie')
  }
}

async function addToFavorites(movie) {
  try {
    await favoritesService.addFavorite({
      tmdbId: movie.id,
      type: movie.type || movie.media_type || 'movie'
    })
    snackbar.value = {
      show: true,
      message: `${movie.title || movie.name} ajouté aux favoris !`,
      color: 'success'
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout aux favoris:', error)
    const message = error.message?.includes('existe déjà') 
      ? 'Ce contenu est déjà dans vos favoris'
      : 'Erreur lors de l\'ajout aux favoris'
    snackbar.value = {
      show: true,
      message,
      color: 'error'
    }
  }
}
</script>

