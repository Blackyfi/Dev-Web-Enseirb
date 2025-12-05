<template>
  <v-container class="home-page">
    <!-- Header compact -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">
          <span v-if="authStore.isAuthenticated"
            >Bonjour {{ authStore.userName }} !</span
          >
          <span v-else>Découvrez</span>
        </h1>
        <p class="text-subtitle-1 text-grey">Films et séries du moment</p>
      </div>
      <div class="d-flex gap-2">
        <v-btn
          v-if="!authStore.isAuthenticated"
          color="primary"
          @click="$router.push('/login')"
        >
          Connexion
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-magnify"
          @click="$router.push('/search')"
        >
          Rechercher
        </v-btn>
        <v-btn
          v-if="authStore.isAuthenticated"
          color="secondary"
          variant="outlined"
          prepend-icon="mdi-heart"
          @click="$router.push('/favorites')"
        >
          Favoris
        </v-btn>
      </div>
    </div>

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="mb-6"
    />

    <!-- Trending Movies -->
    <MediaSection
      title="Films tendances"
      icon="mdi-fire"
      icon-color="primary"
      @see-more="$router.push('/search?type=movie')"
    >
      <v-row>
        <v-col
          v-for="movie in trendingMovies.slice(0, 4)"
          :key="'movie-' + movie.id"
          cols="12"
          sm="6"
          md="3"
        >
          <MovieCard
            :movie="{ ...movie, type: 'movie' }"
            :show-favorite-button="authStore.isAuthenticated"
            :show-type="true"
            @add-favorite="addToFavorites"
          />
        </v-col>
      </v-row>
    </MediaSection>

    <!-- Trending Series -->
    <MediaSection
      title="Séries tendances"
      icon="mdi-television-classic"
      icon-color="purple"
      @see-more="$router.push('/search?type=tv')"
    >
      <v-row>
        <v-col
          v-for="series in trendingSeries.slice(0, 4)"
          :key="'tv-' + series.id"
          cols="12"
          sm="6"
          md="3"
        >
          <MovieCard
            :movie="{ ...series, type: 'tv' }"
            :show-favorite-button="authStore.isAuthenticated"
            :show-type="true"
            @add-favorite="addToFavorites"
          />
        </v-col>
      </v-row>
    </MediaSection>

    <!-- CTA for non-authenticated -->
    <v-card
      v-if="!authStore.isAuthenticated"
      color="primary"
      class="pa-6 text-center"
    >
      <h3 class="text-h5 mb-2">Créez votre compte</h3>
      <p class="mb-4">
        Sauvegardez vos favoris et accédez à plus de fonctionnalités
      </p>
      <v-btn color="white" variant="flat" @click="$router.push('/login')"
        >S'inscrire gratuitement</v-btn
      >
    </v-card>

    <AppSnackbar
      v-model="snackbar.show"
      :message="snackbar.message"
      :color="snackbar.color"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import * as moviesService from "@/services/movies";
import * as favoritesService from "@/services/favorites";
import MovieCard from "@/components/media/MovieCard.vue";
import MediaSection from "@/components/media/MediaSection.vue";
import AppSnackbar from "@/components/ui/AppSnackbar.vue";

const authStore = useAuthStore();
const trendingMovies = ref([]);
const trendingSeries = ref([]);
const loading = ref(true);
const snackbar = ref({ show: false, message: "", color: "success" });

onMounted(() => loadTrendingContent());

async function loadTrendingContent() {
  loading.value = true;
  try {
    const [moviesRes, seriesRes] = await Promise.all([
      moviesService.getTrendingMovies(),
      moviesService.getTrendingSeries(),
    ]);
    trendingMovies.value = moviesRes.results || [];
    trendingSeries.value = seriesRes.results || [];
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    loading.value = false;
  }
}

async function addToFavorites(movie) {
  if (!authStore.isAuthenticated) {
    snackbar.value = {
      show: true,
      message: "Connectez-vous pour ajouter des favoris",
      color: "warning",
    };
    return;
  }
  try {
    await favoritesService.addFavorite({
      tmdbId: movie.id,
      type: movie.type || "movie",
    });
    snackbar.value = {
      show: true,
      message: `${movie.title || movie.name} ajouté aux favoris !`,
      color: "success",
    };
  } catch (error) {
    const msg = error.message?.includes("existe déjà")
      ? "Déjà dans vos favoris"
      : "Erreur lors de l'ajout";
    snackbar.value = { show: true, message: msg, color: "error" };
  }
}
</script>

<style scoped>
.home-page {
  max-width: 1400px;
  padding: 1.5rem 1rem;
}
.gap-2 {
  gap: 8px;
}
</style>
