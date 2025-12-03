<template>
  <v-card class="movie-card" hover>
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
        v-if="showType && movie.type"
        class="ma-2"
        :color="movie.type === 'movie' ? 'blue' : 'purple'"
        size="small"
      >
        {{ movie.type === 'movie' ? 'Film' : 'Série' }}
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
          @click="$emit('add-favorite', movie)"
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
import { useAuthStore } from '@/stores/auth'

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
</script>

<style scoped>
.movie-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}

.movie-card:hover {
  transform: translateY(-4px);
}

.movie-poster {
  flex-shrink: 0;
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
