<template>
  <v-container class="movie-detail-page" v-if="movie">
    <v-btn
      class="mb-4"
      variant="text"
      prepend-icon="mdi-arrow-left"
      @click="goBack"
      >Retour</v-btn
    >

    <v-row class="movie-header">
      <v-col cols="12" md="4">
        <v-img
          :src="imageUrl"
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
          <h1 class="text-h3 mb-2">{{ movie.title || movie.name }}</h1>
          <p
            v-if="movie.original_title && movie.original_title !== movie.title"
            class="text-h6 text-grey mb-4"
          >
            {{ movie.original_title }}
          </p>

          <div class="metadata mb-4">
            <v-chip
              v-if="movie.release_date || movie.first_air_date"
              class="mr-2 mb-2"
              color="primary"
              variant="flat"
            >
              <v-icon start>mdi-calendar</v-icon>
              {{ year }}
            </v-chip>
            <v-chip
              v-if="movie.runtime"
              class="mr-2 mb-2"
              color="secondary"
              variant="flat"
            >
              <v-icon start>mdi-clock-outline</v-icon>
              {{ runtime }}
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
              {{ movie.type === "movie" ? "Film" : "Série" }}
            </v-chip>
          </div>

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

          <div class="actions mb-4">
            <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-heart-plus"
              @click="addToFavorites"
              :disabled="loading"
            >
              Ajouter aux favoris
            </v-btn>
          </div>

          <div v-if="movie.overview" class="overview">
            <h2 class="text-h5 mb-3">Synopsis</h2>
            <p class="text-body-1">{{ movie.overview }}</p>
          </div>
        </div>
      </v-col>
    </v-row>

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
                <strong>Langue originale:</strong>
                {{ movie.original_language.toUpperCase() }}
              </div>
              <div v-if="movie.budget && movie.budget > 0" class="info-item">
                <strong>Budget:</strong> {{ formatCurrency(movie.budget) }}
              </div>
              <div v-if="movie.revenue && movie.revenue > 0" class="info-item">
                <strong>Recettes:</strong> {{ formatCurrency(movie.revenue) }}
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div
                v-if="
                  movie.production_companies &&
                  movie.production_companies.length
                "
                class="info-item"
              >
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
              <div
                v-if="
                  movie.production_countries &&
                  movie.production_countries.length
                "
                class="info-item"
              >
                <strong>Pays de production:</strong>
                <span class="ml-2">{{
                  movie.production_countries.map((c) => c.name).join(", ")
                }}</span>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <AppSnackbar
      v-model="snackbar.show"
      :message="snackbar.message"
      :color="snackbar.color"
    />
  </v-container>

  <v-container v-else-if="loading" class="text-center">
    <v-progress-circular indeterminate size="64" color="primary" />
    <p class="mt-4">Chargement des détails...</p>
  </v-container>

  <v-container v-else class="text-center">
    <v-icon size="120" color="grey">mdi-alert-circle</v-icon>
    <h2 class="mt-4">Film non trouvé</h2>
    <v-btn class="mt-4" color="primary" @click="goBack">Retour</v-btn>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getMovieDetails } from "@/services/movies";
import { addFavorite } from "@/services/favorites";
import AppSnackbar from "@/components/ui/AppSnackbar.vue";

const route = useRoute();
const router = useRouter();

const movie = ref(null);
const loading = ref(true);
const snackbar = ref({ show: false, message: "", color: "success" });

const imageUrl = computed(() =>
  movie.value?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.value.poster_path}`
    : ""
);
const year = computed(() => {
  const date = movie.value?.release_date || movie.value?.first_air_date;
  return date ? new Date(date).getFullYear() : "";
});
const runtime = computed(() => {
  const mins = movie.value?.runtime;
  if (!mins) return "";
  const hours = Math.floor(mins / 60);
  return hours > 0 ? `${hours}h ${mins % 60}min` : `${mins}min`;
});

function formatRating(rating) {
  return rating ? rating.toFixed(1) : "N/A";
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function goBack() {
  router.back();
}

async function addToFavorites() {
  try {
    loading.value = true;
    await addFavorite({
      tmdbId: movie.value.id,
      type: movie.value.type || "movie",
    });
    snackbar.value = {
      show: true,
      message: "Ajouté aux favoris avec succès!",
      color: "success",
    };
  } catch (error) {
    snackbar.value = {
      show: true,
      message: error.message || "Erreur lors de l'ajout",
      color: "error",
    };
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  try {
    const movieId = route.params.id;
    const movieType = route.query.type || "movie";
    const data = await getMovieDetails(movieId, movieType);
    movie.value = { ...data, type: movieType };
  } catch (error) {
    console.error("Error loading movie details:", error);
    snackbar.value = {
      show: true,
      message: "Erreur lors du chargement",
      color: "error",
    };
  } finally {
    loading.value = false;
  }
});
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
.metadata,
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
