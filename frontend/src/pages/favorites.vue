<template>
  <v-container class="pb-16 favorites-container">
    <h1 class="text-h5 mb-4">Mes Favoris</h1>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <v-row v-if="favorites.length > 0" class="mb-4">
      <v-col cols="12" md="6">
        <v-select
          v-model="filterType"
          :items="typeOptions"
          label="Type"
          variant="outlined"
          density="compact"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          v-model="sortBy"
          :items="sortOptions"
          label="Trier par"
          variant="outlined"
          density="compact"
        />
      </v-col>
    </v-row>

    <v-row v-if="favorites.length > 0">
      <v-col
        v-for="favorite in filteredFavorites"
        :key="favorite.id"
        class="d-flex flex-column favorite-item"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <MovieCard
          :movie="favorite"
          :show-favorite-button="false"
          :show-type="true"
        >
          <template #actions>
            <v-btn
              color="error"
              variant="text"
              @click="removeFavorite(favorite.id)"
              :loading="deletingId === favorite.id"
            >
              <v-icon>mdi-delete</v-icon>
              Retirer
            </v-btn>
          </template>
        </MovieCard>

        <!-- Informations additionnelles -->
        <v-card class="mt-2" variant="outlined">
          <v-card-text class="py-2">
            <div v-if="favorite.rating" class="mb-1">
              <v-icon color="amber" size="small">mdi-star</v-icon>
              <span class="text-caption ml-1">Ma note: {{ favorite.rating }}/5</span>
            </div>
            <p v-if="favorite.comment" class="text-caption text-grey mb-1">
              "{{ favorite.comment }}"
            </p>
            <p class="text-caption text-grey-darken-1 mb-0">
              Ajouté le {{ formatDate(favorite.created_at) }}
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-alert
      v-else-if="!loading"
      type="info"
      variant="tonal"
    >
      Vous n'avez pas encore de favoris. Recherchez des films pour en ajouter !
      <v-btn
        class="mt-2"
        color="primary"
        variant="flat"
        @click="$router.push('/search')"
      >
        Rechercher des films
      </v-btn>
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as favoritesService from '@/services/favorites'
import MovieCard from '@/components/MovieCard.vue'

const router = useRouter()
const favorites = ref([])
const loading = ref(false)
const deletingId = ref(null)
const filterType = ref('all')
const sortBy = ref('date-desc')

const typeOptions = [
  { title: 'Tous', value: 'all' },
  { title: 'Films', value: 'movie' },
  { title: 'Séries', value: 'tv' }
]

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
  } finally {
    loading.value = false
  }
}

async function removeFavorite(favoriteId) {
  if (!confirm('Êtes-vous sûr de vouloir retirer ce favori ?')) return

  deletingId.value = favoriteId
  try {
    await favoritesService.deleteFavorite(favoriteId)
    favorites.value = favorites.value.filter(f => f.id !== favoriteId)
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  } finally {
    deletingId.value = null
  }
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.favorites-container {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.favorite-item {
  max-height: calc(100vh - 200px);
}

.favorite-item :deep(.v-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.favorite-item :deep(.v-card-text) {
  font-size: 0.8rem;
}

.favorite-item :deep(.v-card img) {
  max-height: 300px;
  object-fit: cover;
}
</style>
