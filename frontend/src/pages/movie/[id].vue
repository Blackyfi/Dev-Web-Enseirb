<template>
  <v-container class="movie-detail-page" v-if="movie">
    <!-- Back Button -->
    <v-btn
      class="mb-4"
      variant="text"
      prepend-icon="mdi-arrow-left"
      @click="goBack"
    >
      Retour
    </v-btn>

    <!-- Movie Header -->
    <v-row class="movie-header">
      <v-col cols="12" md="4">
        <v-img
          :src="getImageUrl(movie.poster_path)"
          :alt="movie.title || movie.name"
          class="movie-poster elevation-8"
          cover
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-icon size="120" color="grey">mdi-movie</v-icon>
            </v-row>
          </template>
        </v-img>
      </v-col>

      <v-col cols="12" md="8">
        <div class="movie-info">
          <!-- Title -->
          <h1 class="text-h3 mb-2">{{ movie.title || movie.name }}</h1>

          <!-- Original Title -->
          <p v-if="movie.original_title && movie.original_title !== movie.title" class="text-h6 text-grey mb-4">
            {{ movie.original_title }}
          </p>

          <!-- Metadata -->
          <div class="metadata mb-4">
            <v-chip
              v-if="movie.release_date || movie.first_air_date"
              class="mr-2 mb-2"
              color="primary"
              variant="flat"
            >
              <v-icon start>mdi-calendar</v-icon>
              {{ getYear(movie.release_date || movie.first_air_date) }}
            </v-chip>

            <v-chip
              v-if="movie.runtime"
              class="mr-2 mb-2"
              color="secondary"
              variant="flat"
            >
              <v-icon start>mdi-clock-outline</v-icon>
              {{ formatRuntime(movie.runtime) }}
            </v-chip>

            <v-chip
              v-if="movie.vote_average"
              class="mr-2 mb-2"
              color="amber"
              variant="flat"
            >
              <v-icon start>mdi-star</v-icon>
              {{ formatRating(movie.vote_average) }} / 10
            </v-chip>

            <v-chip
              v-if="movie.type"
              class="mb-2"
              :color="movie.type === 'movie' ? 'blue' : 'purple'"
              variant="flat"
            >
              {{ movie.type === 'movie' ? 'Film' : 'Série' }}
            </v-chip>
          </div>

          <!-- Genres -->
          <div v-if="movie.genres && movie.genres.length" class="genres mb-4">
            <v-chip
              v-for="genre in movie.genres"
              :key="genre.id"
              class="mr-2 mb-2"
              variant="outlined"
              size="small"
            >
              {{ genre.name }}
            </v-chip>
          </div>

          <!-- Actions -->
          <div class="actions mb-4">
            <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-heart-plus"
              @click="dialog = true"
              :disabled="loading"
            >
              Ajouter aux favoris
            </v-btn>
          </div>

          <!-- Overview -->
          <div v-if="movie.overview" class="overview">
            <h2 class="text-h5 mb-3">Synopsis</h2>
            <p class="text-body-1">{{ movie.overview }}</p>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Additional Information -->
    <v-row class="mt-8">
      <v-col cols="12">
        <v-card class="pa-4">
          <h2 class="text-h5 mb-4">Informations complémentaires</h2>

          <v-row>
            <v-col cols="12" md="6">
              <div v-if="movie.status" class="info-item">
                <strong>Statut:</strong> {{ movie.status }}
              </div>

              <div v-if="movie.original_language" class="info-item">
                <strong>Langue originale:</strong> {{ movie.original_language.toUpperCase() }}
              </div>

              <div v-if="movie.budget && movie.budget > 0" class="info-item">
                <strong>Budget:</strong> {{ formatCurrency(movie.budget) }}
              </div>

              <div v-if="movie.revenue && movie.revenue > 0" class="info-item">
                <strong>Recettes:</strong> {{ formatCurrency(movie.revenue) }}
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <div v-if="movie.production_companies && movie.production_companies.length" class="info-item">
                <strong>Sociétés de production:</strong>
                <div class="mt-2">
                  <v-chip
                    v-for="company in movie.production_companies"
                    :key="company.id"
                    class="mr-2 mb-2"
                    size="small"
                  >
                    {{ company.name }}
                  </v-chip>
                </div>
              </div>

              <div v-if="movie.production_countries && movie.production_countries.length" class="info-item">
                <strong>Pays de production:</strong>
                <span class="ml-2">{{ movie.production_countries.map(c => c.name).join(', ') }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog pour ajouter aux favoris -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Ajouter aux favoris</v-card-title>
        <v-card-text>
          <div class="mb-4">
            <label class="text-subtitle-2 mb-2 d-block">Note (optionnel)</label>
            <v-rating v-model="rating" color="amber" hover></v-rating>
          </div>
          <v-textarea
            v-model="comment"
            label="Commentaire (optionnel)"
            rows="3"
            counter="500"
            maxlength="500"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false">Annuler</v-btn>
          <v-btn color="primary" @click="addToFavorites">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for feedback -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Fermer</v-btn>
      </template>
    </v-snackbar>
  </v-container>

  <v-container v-else-if="loading" class="text-center">
    <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    <p class="mt-4">Chargement des détails...</p>
  </v-container>

  <v-container v-else class="text-center">
    <v-icon size="120" color="grey">mdi-alert-circle</v-icon>
    <h2 class="mt-4">Film non trouvé</h2>
    <v-btn class="mt-4" color="primary" @click="goBack">Retour</v-btn>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMovieDetails } from '@/services/movies'
import { addToFavorites as addFavorite } from '@/services/favorites'

const route = useRoute()
const router = useRouter()

const movie = ref(null)
const loading = ref(true)
const dialog = ref(false)
const rating = ref(0)
const comment = ref('')
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const getImageUrl = (posterPath) => {
  if (!posterPath) return ''
  return `https://image.tmdb.org/t/p/w500${posterPath}`
}

const getYear = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).getFullYear()
}

const formatRating = (rating) => {
  if (!rating) return 'N/A'
  return rating.toFixed(1)
}

const formatRuntime = (minutes) => {
  if (!minutes) return ''
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount)
}

const goBack = () => {
  router.back()
}

const addToFavorites = async () => {
  try {
    loading.value = true
    const favoriteData = {
      tmdbId: movie.value.id,
      type: movie.value.type || 'movie'
    }
    if (rating.value > 0) favoriteData.rating = rating.value
    if (comment.value) favoriteData.comment = comment.value

    await addFavorite(favoriteData)
    dialog.value = false
    rating.value = 0
    comment.value = ''
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
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const movieId = route.params.id
    const movieType = route.query.type || 'movie'
    const data = await getMovieDetails(movieId, movieType)
    movie.value = { ...data, type: movieType }
  } catch (error) {
    console.error('Error loading movie details:', error)
    snackbar.value = {
      show: true,
      message: 'Erreur lors du chargement des détails',
      color: 'error'
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.movie-detail-page {
  max-width: 1400px;
  padding: 2rem 1rem;
}

.movie-header {
  margin-bottom: 2rem;
}

.movie-poster {
  border-radius: 8px;
  width: 100%;
  max-height: 600px;
}

.movie-info {
  padding: 1rem 0;
}

.metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.overview {
  line-height: 1.8;
}

.info-item {
  margin-bottom: 1rem;
  line-height: 1.6;
}

@media (max-width: 960px) {
  .movie-detail-page {
    padding: 1rem;
  }

  .text-h3 {
    font-size: 2rem !important;
  }

  .movie-poster {
    max-height: 500px;
  }
}
</style>
