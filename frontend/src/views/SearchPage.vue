<template>
  <v-container class="search-page">
    <h1 class="text-h3 mb-6">Rechercher</h1>

    <!-- Search Form -->
    <v-card class="mb-6 elevation-2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="searchQuery"
              label="Rechercher un film ou une série"
              placeholder="Entrez un titre..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              @keyup.enter="handleSearch"
              @click:clear="clearSearch"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="searchType"
              :items="searchTypes"
              label="Type de contenu"
              variant="outlined"
              prepend-inner-icon="mdi-filter"
            />
          </v-col>
        </v-row>

        <v-btn
          color="primary"
          size="large"
          block
          @click="handleSearch"
          :loading="loading"
          :disabled="!searchQuery || searchQuery.length < 2"
        >
          <v-icon start>mdi-magnify</v-icon>
          Rechercher
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- Results Counter -->
    <div v-if="hasSearched && !loading" class="mb-4">
      <v-chip color="primary" variant="flat">
        {{ results.length }} résultat{{ results.length > 1 ? 's' : '' }} trouvé{{ results.length > 1 ? 's' : '' }}
      </v-chip>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center my-8">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-h6">Recherche en cours...</p>
    </div>

    <!-- Results -->
    <v-row v-else-if="results.length > 0">
      <v-col
        v-for="item in results"
        :key="item.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <MovieCard
          :movie="enrichMovieData(item)"
          :show-favorite-button="isAuthenticated"
          :show-type="true"
          @add-favorite="handleAddFavorite"
        />
      </v-col>
    </v-row>

    <!-- No Results -->
    <v-alert
      v-else-if="hasSearched && !loading"
      type="info"
      variant="tonal"
      class="my-8"
    >
      <v-alert-title>Aucun résultat</v-alert-title>
      Aucun {{ getTypeLabel() }} ne correspond à votre recherche "{{ searchQuery }}".
      <br>
      Essayez avec un autre terme ou changez le type de contenu.
    </v-alert>

    <!-- Empty State -->
    <v-alert
      v-else-if="!hasSearched"
      type="info"
      variant="tonal"
      class="my-8"
    >
      <v-alert-title>Commencez une recherche</v-alert-title>
      Utilisez le formulaire ci-dessus pour rechercher des films ou des séries.
    </v-alert>

    <!-- Snackbar for feedback -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Fermer</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import MovieCard from '../components/MovieCard.vue'
import { searchMulti } from '../services/movies'
import { addToFavorites } from '../services/favorites'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const searchQuery = ref('')
const searchType = ref('all')
const results = ref([])
const loading = ref(false)
const hasSearched = ref(false)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const searchTypes = [
  { title: 'Tous', value: 'all' },
  { title: 'Films uniquement', value: 'movie' },
  { title: 'Séries uniquement', value: 'tv' }
]

const handleSearch = async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    snackbar.value = {
      show: true,
      message: 'Veuillez entrer au moins 2 caractères',
      color: 'warning'
    }
    return
  }

  try {
    loading.value = true
    hasSearched.value = true

    const response = await searchMulti(searchQuery.value, searchType.value)
    results.value = response.results || response || []
  } catch (error) {
    console.error('Error searching:', error)
    snackbar.value = {
      show: true,
      message: 'Erreur lors de la recherche',
      color: 'error'
    }
    results.value = []
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  results.value = []
  hasSearched.value = false
}

const enrichMovieData = (item) => {
  // Ajouter le type si manquant (TMDB retourne media_type dans multi-search)
  const type = item.media_type || (item.first_air_date ? 'tv' : 'movie')

  return {
    ...item,
    type,
    title: item.title || item.name,
    name: item.name || item.title
  }
}

const getTypeLabel = () => {
  if (searchType.value === 'movie') return 'film'
  if (searchType.value === 'tv') return 'série'
  return 'résultat'
}

const handleAddFavorite = async (movie) => {
  if (!isAuthenticated.value) {
    snackbar.value = {
      show: true,
      message: 'Vous devez être connecté pour ajouter des favoris',
      color: 'warning'
    }
    return
  }

  try {
    await addToFavorites(movie.tmdbId || movie.id, movie.type || 'movie')
    snackbar.value = {
      show: true,
      message: 'Ajouté aux favoris avec succès!',
      color: 'success'
    }
  } catch (error) {
    snackbar.value = {
      show: true,
      message: error.message || 'Erreur lors de l\'ajout aux favoris',
      color: 'error'
    }
  }
}
</script>

<style scoped>
.search-page {
  max-width: 1400px;
  padding: 2rem 1rem;
}
</style>
