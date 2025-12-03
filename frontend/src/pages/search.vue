<template>
  <v-container>
    <h1 class="text-h4 mb-6">Rechercher des films</h1>

    <v-card class="mb-6">
      <v-card-text>
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
        v-for="movie in results"
        :key="movie.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <MovieCard
          :movie="movie"
          :show-favorite-button="authStore.isAuthenticated"
          @add-favorite="addToFavorites"
          @click="goToMovie(movie.id)"
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
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
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

// Rechercher au chargement si query présente
if (searchQuery.value) {
  handleSearch()
}

async function handleSearch() {
  if (!searchQuery.value) return

  loading.value = true
  searched.value = true
  lastSearchQuery.value = searchQuery.value

  try {
    const response = await moviesService.searchMovies(searchQuery.value)
    results.value = response.results || []

    // Mettre à jour l'URL
    router.push({ query: { q: searchQuery.value } })
  } catch (error) {
    console.error('Erreur de recherche:', error)
    results.value = []
  } finally {
    loading.value = false
  }
}

function goToMovie(movieId) {
  router.push(`/movie/${movieId}`)
}

async function addToFavorites(movie) {
  try {
    await favoritesService.addFavorite({
      tmdbId: movie.id,
      type: movie.media_type === 'tv' ? 'tv' : 'movie'
    })
    // TODO: Afficher un message de succès
    console.log('Ajouté aux favoris')
  } catch (error) {
    console.error('Erreur lors de l\'ajout aux favoris:', error)
  }
}
</script>

