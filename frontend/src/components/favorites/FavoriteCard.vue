<template>
  <v-card class="favorite-card h-100" hover>
    <v-img
      :src="imageUrl"
      height="300"
      cover
      class="favorite-poster"
      @click="$emit('click')"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-icon size="64" color="grey">mdi-movie</v-icon>
        </v-row>
      </template>
      <v-chip
        class="type-badge ma-2"
        :color="favorite.type === 'movie' ? 'blue' : 'purple'"
        size="small"
        variant="elevated"
      >
        {{ favorite.type === "movie" ? "Film" : "Série" }}
      </v-chip>
    </v-img>

    <v-card-title
      class="text-subtitle-1 font-weight-bold pb-1"
      @click="$emit('click')"
    >
      {{ favorite.title || favorite.name }}
    </v-card-title>

    <v-card-text class="pb-2">
      <div class="d-flex align-center gap-3 mb-2">
        <v-chip size="x-small" color="amber" variant="flat">
          <v-icon start size="small">mdi-star</v-icon>
          {{ formatRating(favorite.vote_average) }}
        </v-chip>
        <span class="text-caption text-grey">{{ year }}</span>
      </div>

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

      <p
        v-if="favorite.comment"
        class="text-caption text-grey-darken-1 font-italic mb-2"
      >
        "{{ favorite.comment }}"
      </p>

      <p class="text-caption text-grey mb-0">
        <v-icon size="x-small" class="mr-1">mdi-calendar-plus</v-icon>
        Ajouté {{ formattedDate }}
      </p>
    </v-card-text>

    <v-card-actions class="pt-0 flex-wrap justify-center ga-1">
      <v-btn
        color="error"
        variant="text"
        size="x-small"
        prepend-icon="mdi-delete"
        @click="$emit('delete')"
        >Retirer</v-btn
      >
      <v-btn
        color="warning"
        variant="text"
        size="x-small"
        prepend-icon="mdi-star"
        @click="$emit('edit')"
        >Noter</v-btn
      >
      <v-btn
        color="primary"
        variant="text"
        size="x-small"
        prepend-icon="mdi-eye"
        @click="$emit('click')"
        >Détails</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  favorite: { type: Object, required: true },
});

defineEmits(["click", "delete", "edit"]);

const imageUrl = computed(() => {
  if (!props.favorite.poster_path) return "";
  return `https://image.tmdb.org/t/p/w500${props.favorite.poster_path}`;
});

const year = computed(() => {
  const date = props.favorite.release_date || props.favorite.first_air_date;
  if (!date) return "";
  return new Date(date).getFullYear();
});

const formattedDate = computed(() => {
  if (!props.favorite.created_at) return "";
  return new Date(props.favorite.created_at).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
});

function formatRating(rating) {
  if (!rating) return "N/A";
  return rating.toFixed(1);
}
</script>

<style scoped>
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
}
.type-badge {
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
.gap-3 {
  gap: 12px;
}
</style>
