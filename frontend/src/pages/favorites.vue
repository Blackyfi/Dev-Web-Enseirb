<template>
  <v-container>
    <h1 class="text-h4 mb-6">Mes Favoris</h1>

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <v-row v-if="favorites.length > 0">
      <v-col
        v-for="favorite in favorites"
        :key="favorite.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as favoritesService from '@/services/favorites'
import MovieCard from '@/components/MovieCard.vue'

const router = useRouter()
const favorites = ref([])
const loading = ref(false)
const deletingId = ref(null)

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

