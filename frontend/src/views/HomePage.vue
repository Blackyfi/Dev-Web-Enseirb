<template>
  <div class="home-page">
    <v-container>
      <!-- Hero Section -->
      <div class="hero">
        <h1 class="title">Bienvenue sur SeenFlix</h1>
        <p class="description">
          Votre plateforme pour rechercher, découvrir et gérer vos films et séries préférés.
          Créez votre liste de favoris (et peut être un jour si on y arrive... des collections partagées)!
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="actions">
        <div v-if="!isAuthenticated" class="auth-actions">
          <h2>Commencez maintenant</h2>
          <div class="buttons">
            <v-btn
              to="/register"
              color="primary"
              size="large"
              class="mr-2"
            >
              Créer un compte
            </v-btn>
            <v-btn
              to="/login"
              color="secondary"
              size="large"
              variant="outlined"
            >
              Se connecter
            </v-btn>
          </div>
        </div>

        <div v-else class="user-actions">
          <h2>Que voulez-vous faire ?</h2>
          <div class="buttons">
            <v-btn
              to="/search"
              color="primary"
              size="large"
              prepend-icon="mdi-magnify"
              class="mr-2"
            >
              Rechercher des films
            </v-btn>
            <v-btn
              to="/favorites"
              color="secondary"
              size="large"
              prepend-icon="mdi-heart"
              variant="outlined"
            >
              Mes favoris
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Trending Movies Section -->
      <div v-if="loading" class="loading-section">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p>Chargement du contenu...</p>
      </div>

      <div v-else>
        <!-- Trending Movies -->
        <section v-if="trendingMovies.length" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <v-icon color="primary" size="large" class="mr-2">mdi-fire</v-icon>
              Films Tendances
            </h2>
          </div>
          <v-row>
            <v-col
              v-for="movie in trendingMovies.slice(0, 6)"
              :key="movie.id"
              cols="12"
              sm="6"
              md="4"
              lg="2"
            >
              <MovieCard
                :movie="{ ...movie, type: 'movie' }"
                :show-favorite-button="isAuthenticated"
                @add-favorite="handleAddFavorite"
              />
            </v-col>
          </v-row>
        </section>

        <!-- Trending Series -->
        <section v-if="trendingSeries.length" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <v-icon color="purple" size="large" class="mr-2">mdi-television</v-icon>
              Séries Tendances
            </h2>
          </div>
          <v-row>
            <v-col
              v-for="series in trendingSeries.slice(0, 6)"
              :key="series.id"
              cols="12"
              sm="6"
              md="4"
              lg="2"
            >
              <MovieCard
                :movie="{ ...series, type: 'tv' }"
                :show-favorite-button="isAuthenticated"
                :show-type="true"
                @add-favorite="handleAddFavorite"
              />
            </v-col>
          </v-row>
        </section>

        <!-- Popular Movies -->
        <section v-if="popularMovies.length" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <v-icon color="amber" size="large" class="mr-2">mdi-star</v-icon>
              Films Populaires
            </h2>
          </div>
          <v-row>
            <v-col
              v-for="movie in popularMovies.slice(0, 6)"
              :key="movie.id"
              cols="12"
              sm="6"
              md="4"
              lg="2"
            >
              <MovieCard
                :movie="{ ...movie, type: 'movie' }"
                :show-favorite-button="isAuthenticated"
                @add-favorite="handleAddFavorite"
              />
            </v-col>
          </v-row>
        </section>

        <!-- Popular Series -->
        <section v-if="popularSeries.length" class="content-section">
          <div class="section-header">
            <h2 class="section-title">
              <v-icon color="indigo" size="large" class="mr-2">mdi-trophy</v-icon>
              Séries Populaires
            </h2>
          </div>
          <v-row>
            <v-col
              v-for="series in popularSeries.slice(0, 6)"
              :key="series.id"
              cols="12"
              sm="6"
              md="4"
              lg="2"
            >
              <MovieCard
                :movie="{ ...series, type: 'tv' }"
                :show-favorite-button="isAuthenticated"
                :show-type="true"
                @add-favorite="handleAddFavorite"
              />
            </v-col>
          </v-row>
        </section>
      </div>

      <!-- Snackbar for feedback -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
        {{ snackbar.message }}
        <template v-slot:actions>
          <v-btn variant="text" @click="snackbar.show = false">Fermer</v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import MovieCard from '../components/MovieCard.vue'
import { getTrendingMovies, getTrendingSeries, getPopularMovies, getPopularSeries } from '../services/movies'
import { addToFavorites } from '../services/favorites'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const loading = ref(true)
const trendingMovies = ref([])
const trendingSeries = ref([])
const popularMovies = ref([])
const popularSeries = ref([])

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const loadContent = async () => {
  try {
    loading.value = true

    // Load all content in parallel
    const [trending, trendingTv, popular, popularTv] = await Promise.allSettled([
      getTrendingMovies(),
      getTrendingSeries(),
      getPopularMovies(),
      getPopularSeries()
    ])

    if (trending.status === 'fulfilled') {
      trendingMovies.value = trending.value.results || trending.value || []
    }
    if (trendingTv.status === 'fulfilled') {
      trendingSeries.value = trendingTv.value.results || trendingTv.value || []
    }
    if (popular.status === 'fulfilled') {
      popularMovies.value = popular.value.results || popular.value || []
    }
    if (popularTv.status === 'fulfilled') {
      popularSeries.value = popularTv.value.results || popularTv.value || []
    }
  } catch (error) {
    console.error('Error loading content:', error)
    snackbar.value = {
      show: true,
      message: 'Erreur lors du chargement du contenu',
      color: 'error'
    }
  } finally {
    loading.value = false
  }
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
    await addToFavorites(movie.id, movie.type || 'movie')
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

onMounted(() => {
  loadContent()
})
</script>

<style scoped>
.home-page {
  background: linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, transparent 100%);
  min-height: 100vh;
  padding-bottom: 3rem;
}

.hero {
  text-align: center;
  padding: 4rem 0 3rem;
}

.title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #e50914;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.description {
  font-size: 1.25rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
}

.actions {
  margin: 3rem 0;
  text-align: center;
}

.actions h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
  font-weight: 600;
}

.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.loading-section {
  text-align: center;
  padding: 4rem 0;
}

.loading-section p {
  margin-top: 1rem;
  color: #666;
  font-size: 1.1rem;
}

.content-section {
  margin-top: 4rem;
}

.section-header {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  border-bottom: 3px solid rgba(229, 9, 20, 0.2);
  padding-bottom: 1rem;
}

@media (max-width: 960px) {
  .title {
    font-size: 2.5rem;
  }

  .description {
    font-size: 1.1rem;
    padding: 0 1rem;
  }

  .actions h2 {
    font-size: 1.6rem;
  }

  .section-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 600px) {
  .hero {
    padding: 2rem 0;
  }

  .title {
    font-size: 2rem;
  }

  .description {
    font-size: 1rem;
  }

  .actions h2 {
    font-size: 1.4rem;
  }

  .buttons {
    flex-direction: column;
    align-items: stretch;
    padding: 0 1rem;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .content-section {
    margin-top: 3rem;
  }
}
</style>
