<template>
  <v-container class="favorites-page">
    <!-- Header with stats -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Mes Favoris</h1>
        <p v-if="favorites.length > 0" class="text-subtitle-1 text-grey mt-1">
          {{ filteredFavorites.length }}
          {{ filteredFavorites.length > 1 ? "éléments" : "élément" }}
          <span v-if="filterType !== 'all'"
            >({{ filterType === "movie" ? "films" : "séries" }})</span
          >
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

    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="mb-4"
    />

    <!-- Filters -->
    <v-card v-if="favorites.length > 0" class="mb-6 pa-4" variant="outlined">
      <v-row align="center">
        <v-col cols="12" sm="6" md="4">
          <TypeFilterToggle
            v-model="filterType"
            size="small"
            density="comfortable"
            icon-size="small"
          />
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
        <FavoriteCard
          :favorite="favorite"
          @click="goToDetails(favorite)"
          @delete="confirmDelete(favorite)"
        />
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card
      v-else-if="!loading"
      class="pa-8 text-center"
      variant="flat"
      color="grey-lighten-4"
    >
      <v-icon size="80" color="grey-lighten-1" class="mb-4"
        >mdi-heart-outline</v-icon
      >
      <h2 class="text-h5 mb-2">Aucun favori</h2>
      <p class="text-body-1 text-grey mb-4">
        Vous n'avez pas encore de favoris. Recherchez des films ou séries pour
        en ajouter !
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
          Voulez-vous vraiment retirer
          <strong>{{
            favoriteToDelete?.title || favoriteToDelete?.name
          }}</strong>
          de vos favoris ?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="removeFavorite"
            :loading="deleting"
            >Retirer</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <AppSnackbar
      v-model="snackbar.show"
      :message="snackbar.message"
      :color="snackbar.color"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import * as favoritesService from "@/services/favorites";
import TypeFilterToggle from "@/components/ui/TypeFilterToggle.vue";
import AppSnackbar from "@/components/ui/AppSnackbar.vue";
import FavoriteCard from "@/components/favorites/FavoriteCard.vue";

const router = useRouter();
const favorites = ref([]);
const loading = ref(false);
const deleting = ref(false);
const filterType = ref("all");
const sortBy = ref("date-desc");
const deleteDialog = ref(false);
const favoriteToDelete = ref(null);
const snackbar = ref({ show: false, message: "", color: "success" });

const sortOptions = [
  { title: "Plus récents", value: "date-desc" },
  { title: "Plus anciens", value: "date-asc" },
  { title: "Meilleure note", value: "rating-desc" },
  { title: "Note TMDB", value: "vote-desc" },
  { title: "Titre (A-Z)", value: "title-asc" },
];

const filteredFavorites = computed(() => {
  let result = [...favorites.value];
  if (filterType.value !== "all") {
    result = result.filter((f) => f.type === filterType.value);
  }
  result.sort((a, b) => {
    switch (sortBy.value) {
      case "date-desc":
        return new Date(b.created_at) - new Date(a.created_at);
      case "date-asc":
        return new Date(a.created_at) - new Date(b.created_at);
      case "rating-desc":
        return (b.rating || 0) - (a.rating || 0);
      case "vote-desc":
        return (b.vote_average || 0) - (a.vote_average || 0);
      case "title-asc":
        const titleA = (a.title || a.name || "").toLowerCase();
        const titleB = (b.title || b.name || "").toLowerCase();
        return titleA.localeCompare(titleB);
      default:
        return 0;
    }
  });
  return result;
});

onMounted(() => loadFavorites());

async function loadFavorites() {
  loading.value = true;
  try {
    favorites.value = (await favoritesService.getAllFavorites()) || [];
  } catch (error) {
    console.error("Erreur lors du chargement:", error);
    snackbar.value = {
      show: true,
      message: "Erreur lors du chargement",
      color: "error",
    };
  } finally {
    loading.value = false;
  }
}

function confirmDelete(favorite) {
  favoriteToDelete.value = favorite;
  deleteDialog.value = true;
}

async function removeFavorite() {
  if (!favoriteToDelete.value) return;
  deleting.value = true;
  try {
    await favoritesService.deleteFavorite(favoriteToDelete.value.id);
    favorites.value = favorites.value.filter(
      (f) => f.id !== favoriteToDelete.value.id
    );
    snackbar.value = {
      show: true,
      message: `${
        favoriteToDelete.value.title || favoriteToDelete.value.name
      } retiré`,
      color: "success",
    };
    deleteDialog.value = false;
  } catch (error) {
    snackbar.value = {
      show: true,
      message: "Erreur lors de la suppression",
      color: "error",
    };
  } finally {
    deleting.value = false;
    favoriteToDelete.value = null;
  }
}

function goToDetails(favorite) {
  router.push({
    path: `/media/${favorite.tmdbId || favorite.id}`,
    query: { type: favorite.type || "movie" },
  });
}
</script>

<style scoped>
.favorites-page {
  max-width: 1400px;
  padding: 2rem 1rem;
}
</style>
