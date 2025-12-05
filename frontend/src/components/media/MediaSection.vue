<template>
  <section class="media-section mb-8">
    <div class="d-flex align-center justify-space-between mb-4">
      <h2 class="text-h5">
        <v-icon :color="iconColor" class="mr-2">{{ icon }}</v-icon>
        {{ title }}
      </h2>
      <v-btn v-if="showMoreLink" variant="text" color="primary" @click="$emit('see-more')">
        Voir tout
      </v-btn>
    </div>
    <slot />
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'mdi-movie'
  },
  iconColor: {
    type: String,
    default: 'primary'
  },
  showMoreLink: {
    type: Boolean,
    default: true
  }
})

defineEmits(['see-more'])
</script>

<style scoped>
.media-section {
  margin-bottom: 2rem;
}
</style>
