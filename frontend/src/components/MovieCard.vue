<template>
  <v-card
    class="movie-card"
    hover
    @click="handleCardClick"
    style="cursor: pointer;"
  >
    <v-img
      :src="getImageUrl(movie.poster_path)"
      height="400"
      cover
      class="movie-poster"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-icon size="64" color="grey">mdi-movie</v-icon>
        </v-row>
      </template>

      <!-- Badge du type (movie/tv) -->
      <v-chip
        v-if="showType && effectiveType"
        class="ma-2"
        :color="effectiveType === 'movie' ? 'blue' : 'purple'"
        size="small"
      >
        {{ effectiveType === 'movie' ? 'Film' : 'Série' }}
      </v-chip>
    </v-img>

    <v-card-title class="text-h6">
      {{ movie.title || movie.name }}
    </v-card-title>

    <v-card-subtitle v-if="movie.release_date || movie.first_air_date">
      {{ getYear(movie.release_date || movie.first_air_date) }}
    </v-card-subtitle>

    <v-card-text>
      <div class="d-flex align-center mb-2">
        <v-icon color="amber" size="small">mdi-star</v-icon>
        <span class="ml-1">{{ formatRating(movie.vote_average) }}</span>
      </div>
      <p v-if="movie.overview" class="text-truncate-3">{{ movie.overview }}</p>
    </v-card-text>

    <v-card-actions>
      <slot name="actions" :movie="movie">
        <!-- Actions par défaut -->
        <v-btn
          v-if="showFavoriteButton"
          color="primary"
          variant="text"
          @click.stop="$emit('add-favorite', movie)"
        >
          <v-icon>mdi-heart-plus</v-icon>
          Ajouter
        </v-btn>
      </slot>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()

const props = defineProps({
  movie: {
    type: Object,
    required: true
  },
  showFavoriteButton: {
    type: Boolean,
    default: true
  },
  showType: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add-favorite', 'remove-favorite', 'click'])

const authStore = useAuthStore()

// Compute effective type from type or media_type
const effectiveType = computed(() => {
  return props.movie.type || props.movie.media_type || null
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

const handleCardClick = () => {
  // Utiliser tmdbId si disponible (cas des favoris), sinon id (cas de recherche/trending)
  const movieId = props.movie.tmdbId || props.movie.id
  const movieType = props.movie.type || 'movie'

  router.push({
    path: `/movie/${movieId}`,
    query: { type: movieType }
  })
}
</script>

<style scoped>
.movie-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.movie-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 24px rgba(0,0,0,0.2);
}

.movie-poster {
  flex-shrink: 0;
  position: relative;
}

.movie-poster::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%);
  pointer-events: none;
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  color: #555;
}

:deep(.v-card-title) {
  font-weight: 600;
  line-height: 1.3;
}

:deep(.v-card-subtitle) {
  opacity: 0.8;
}

:deep(.v-card-text) {
  flex-grow: 1;
}

:deep(.v-card-actions) {
  padding: 12px 16px;
  border-top: 1px solid rgba(0,0,0,0.05);
}
</style>
