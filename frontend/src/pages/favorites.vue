<template>
  <v-container class="favorites-page">
    <!-- Header with stats -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Mes Favoris</h1>
        <p v-if="favorites.length > 0" class="text-subtitle-1 text-grey mt-1">
          {{ filteredFavorites.length }} {{ filteredFavorites.length > 1 ? 'éléments' : 'élément' }}
          <span v-if="filterType !== 'all'">
            ({{ filterType === 'movie' ? 'films' : 'séries' }})
          </span>
        </p>
      </div>
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-magnify"
        @click="$router.push('/search')"
      >
        Ajouter
      </v-btn>
    </div>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <!-- Filters -->
    <v-card v-if="favorites.length > 0" class="mb-6 pa-4" variant="outlined">
      <v-row align="center">
        <v-col cols="12" sm="6" md="4">
          <v-btn-toggle
            v-model="filterType"
            mandatory
            color="primary"
            density="comfortable"
            rounded="pill"
          >
            <v-btn value="all" size="small">
              <v-icon start size="small">mdi-view-grid</v-icon>
              Tous
            </v-btn>
            <v-btn value="movie" size="small">
              <v-icon start size="small">mdi-movie</v-icon>
              Films
            </v-btn>
            <v-btn value="tv" size="small">
              <v-icon start size="small">mdi-television</v-icon>
              Séries
            </v-btn>
          </v-btn-toggle>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            label="Trier par"
            variant="outlined"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-sort"
          />
        </v-col>
      </v-row>
    </v-card>

    <!-- Favorites Grid -->
    <v-row v-if="filteredFavorites.length > 0">
      <v-col
        v-for="favorite in filteredFavorites"
        :key="favorite.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="favorite-card h-100" hover>
          <!-- Poster -->
          <v-img
            :src="getImageUrl(favorite.poster_path)"
            height="300"
            cover
            class="favorite-poster"
            @click="goToDetails(favorite)"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-icon size="64" color="grey">mdi-movie</v-icon>
              </v-row>
            </template>
            
            <!-- Type Badge -->
            <v-chip
              class="ma-2"
              :color="favorite.type === 'movie' ? 'blue' : 'purple'"
              size="small"
            >
              {{ favorite.type === 'movie' ? 'Film' : 'Série' }}
            </v-chip>
            
            <!-- Delete Button Overlay -->
            <v-btn
              class="delete-btn"
              icon="mdi-delete"
              color="error"
              size="small"
              variant="flat"
              @click.stop="confirmDelete(favorite)"
            />
          </v-img>

          <!-- Content -->
          <v-card-title class="text-subtitle-1 font-weight-bold pb-1" @click="goToDetails(favorite)">
            {{ favorite.title || favorite.name }}
          </v-card-title>

          <v-card-text class="pb-2">
            <!-- Rating & Year -->
            <div class="d-flex align-center gap-3 mb-2">
              <v-chip size="x-small" color="amber" variant="flat">
                <v-icon start size="small">mdi-star</v-icon>
                {{ formatRating(favorite.vote_average) }}
              </v-chip>
              <span class="text-caption text-grey">
                {{ getYear(favorite.release_date || favorite.first_air_date) }}
              </span>
            </div>

            <!-- User rating if exists -->
            <div v-if="favorite.rating" class="d-flex align-center mb-2">
              <v-rating
                :model-value="favorite.rating"
                readonly
                density="compact"
                size="small"
                color="amber"
                half-increments
              />
              <span class="text-caption ml-2">Ma note</span>
            </div>

            <!-- Comment if exists -->
            <p v-if="favorite.comment" class="text-caption text-grey-darken-1 font-italic mb-2">
              "{{ favorite.comment }}"
            </p>

            <!-- Added date -->
            <p class="text-caption text-grey mb-0">
              <v-icon size="x-small" class="mr-1">mdi-calendar-plus</v-icon>
              Ajouté {{ formatDate(favorite.created_at) }}
            </p>
          </v-card-text>

          <v-card-actions class="pt-0">
            <v-btn
              color="error"
              variant="text"
              size="small"
              prepend-icon="mdi-heart-remove"
              @click="confirmDelete(favorite)"
            >
              Retirer
            </v-btn>
            <v-spacer />
            <v-btn
              color="primary"
              variant="text"
              size="small"
              prepend-icon="mdi-eye"
              @click="goToDetails(favorite)"
            >
              Détails
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card v-else-if="!loading" class="pa-8 text-center" variant="flat" color="grey-lighten-4">
      <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-heart-outline</v-icon>
      <h2 class="text-h5 mb-2">Aucun favori</h2>
      <p class="text-body-1 text-grey mb-4">
        Vous n'avez pas encore de favoris. Recherchez des films ou séries pour en ajouter !
      </p>
      <v-btn
        color="primary"
        size="large"
        prepend-icon="mdi-magnify"
        @click="$router.push('/search')"
      >
        Rechercher
      </v-btn>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon color="error" class="mr-2">mdi-alert</v-icon>
          Confirmer la suppression
        </v-card-title>
        <v-card-text>
          Voulez-vous vraiment retirer <strong>{{ favoriteToDelete?.title || favoriteToDelete?.name }}</strong> de vos favoris ?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" variant="flat" @click="removeFavorite" :loading="deleting">
            Retirer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as favoritesService from '@/services/favorites'

const router = useRouter()
const favorites = ref([])
const loading = ref(false)
const deleting = ref(false)
const filterType = ref('all')
const sortBy = ref('date-desc')
const deleteDialog = ref(false)
const favoriteToDelete = ref(null)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const sortOptions = [
  { title: 'Plus récents', value: 'date-desc' },
  { title: 'Plus anciens', value: 'date-asc' },
  { title: 'Meilleure note', value: 'rating-desc' },
  { title: 'Note TMDB', value: 'vote-desc' },
  { title: 'Titre (A-Z)', value: 'title-asc' }
]

const filteredFavorites = computed(() => {
  let result = [...favorites.value]

  if (filterType.value !== 'all') {
    result = result.filter(f => f.type === filterType.value)
  }

  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'date-asc':
        return new Date(a.created_at) - new Date(b.created_at)
      case 'rating-desc':
        return (b.rating || 0) - (a.rating || 0)
      case 'vote-desc':
        return (b.vote_average || 0) - (a.vote_average || 0)
      case 'title-asc':
        const titleA = (a.title || a.name || '').toLowerCase()
        const titleB = (b.title || b.name || '').toLowerCase()
        return titleA.localeCompare(titleB)
      default:
        return 0
    }
  })

  return result
})

onMounted(() => {
  loadFavorites()
})

async function loadFavorites() {
  loading.value = true
  try {
    const data = await favoritesService.getAllFavorites()
    favorites.value = data || []
  } catch (error) {
    console.error('Erreur lors du chargement des favoris:', error)
    favorites.value = []
    showSnackbar('Erreur lors du chargement des favoris', 'error')
  } finally {
    loading.value = false
  }
}

function confirmDelete(favorite) {
  favoriteToDelete.value = favorite
  deleteDialog.value = true
}

async function removeFavorite() {
  if (!favoriteToDelete.value) return

  deleting.value = true
  try {
    await favoritesService.deleteFavorite(favoriteToDelete.value.id)
    favorites.value = favorites.value.filter(f => f.id !== favoriteToDelete.value.id)
    showSnackbar(`${favoriteToDelete.value.title || favoriteToDelete.value.name} retiré des favoris`, 'success')
    deleteDialog.value = false
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    showSnackbar('Erreur lors de la suppression', 'error')
  } finally {
    deleting.value = false
    favoriteToDelete.value = null
  }
}

function showSnackbar(message, color = 'success') {
  snackbar.value = { show: true, message, color }
}

function goToDetails(favorite) {
  const id = favorite.tmdbId || favorite.id
  router.push({
    path: `/movie/${id}`,
    query: { type: favorite.type || 'movie' }
  })
}

function getImageUrl(posterPath) {
  if (!posterPath) return ''
  return `https://image.tmdb.org/t/p/w500${posterPath}`
}

function getYear(dateString) {
  if (!dateString) return ''
  return new Date(dateString).getFullYear()
}

function formatRating(rating) {
  if (!rating) return 'N/A'
  return rating.toFixed(1)
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.favorites-page {
  max-width: 1400px;
  padding: 2rem 1rem;
}

.favorite-card {
  transition: all 0.3s ease;
  overflow: hidden;
}

.favorite-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.favorite-poster {
  cursor: pointer;
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.favorite-card:hover .delete-btn {
  opacity: 1;
}

.gap-3 {
  gap: 12px;
}
</style>
