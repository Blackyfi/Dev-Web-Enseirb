<template>
  <v-container>
    <h1 class="text-h4 mb-6">Rechercher</h1>

    <v-card class="mb-6">
      <v-card-text>
        <TypeFilterToggle v-model="filterType" class="mb-4" />

        <v-text-field
          v-model="searchQuery"
          label="Rechercher un film ou une série..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          @keyup.enter="handleSearch"
          clearable
        />
        <v-btn
          color="primary"
          size="large"
          @click="handleSearch"
          :loading="loading"
          :disabled="!searchQuery"
          block
        >
          Rechercher
        </v-btn>
      </v-card-text>
    </v-card>

    <v-row v-if="results.length > 0">
      <v-col
        v-for="item in results"
        :key="`${item.media_type || filterType}-${item.id}`"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <MovieCard
          :movie="normalizedItem(item)"
          :show-favorite-button="authStore.isAuthenticated"
          :show-type="true"
          @add-favorite="addToFavorites"
        />
      </v-col>
    </v-row>

    <v-alert
      v-else-if="searched && !loading"
      type="info"
      variant="tonal"
      class="mt-4"
    >
      Aucun résultat trouvé pour "{{ lastSearchQuery }}"
    </v-alert>

    <AppSnackbar
      v-model="snackbar.show"
      :message="snackbar.message"
      :color="snackbar.color"
    />
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import * as moviesService from "@/services/movies";
import * as favoritesService from "@/services/favorites";
import MovieCard from "@/components/media/MovieCard.vue";
import TypeFilterToggle from "@/components/ui/TypeFilterToggle.vue";
import AppSnackbar from "@/components/ui/AppSnackbar.vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const searchQuery = ref(route.query.q || "");
const lastSearchQuery = ref("");
const results = ref([]);
const loading = ref(false);
const searched = ref(false);
const filterType = ref(route.query.type || "all");
const snackbar = ref({ show: false, message: "", color: "success" });

if (searchQuery.value) handleSearch();

watch(filterType, () => {
  if (searchQuery.value && searched.value) handleSearch();
});

async function handleSearch() {
  if (!searchQuery.value) return;
  loading.value = true;
  searched.value = true;
  lastSearchQuery.value = searchQuery.value;

  try {
    const response = await moviesService.searchMulti(
      searchQuery.value,
      filterType.value
    );
    results.value = response.results || [];
    router.push({ query: { q: searchQuery.value, type: filterType.value } });
  } catch (error) {
    console.error("Erreur de recherche:", error);
    results.value = [];
  } finally {
    loading.value = false;
  }
}

function normalizedItem(item) {
  return {
    ...item,
    type:
      item.media_type ||
      (filterType.value !== "all" ? filterType.value : "movie"),
  };
}

async function addToFavorites(movie) {
  try {
    await favoritesService.addFavorite({
      tmdbId: movie.id,
      type: movie.type || movie.media_type || "movie",
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
