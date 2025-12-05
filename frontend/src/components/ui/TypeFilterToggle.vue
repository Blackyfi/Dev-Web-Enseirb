<template>
  <v-btn-toggle
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    mandatory
    color="primary"
    :density="density"
    rounded="pill"
  >
    <v-btn value="all" :size="size">
      <v-icon start :size="iconSize">mdi-view-grid</v-icon>
      Tous
    </v-btn>
    <v-btn value="movie" :size="size">
      <v-icon start :size="iconSize">mdi-movie</v-icon>
      Films
    </v-btn>
    <v-btn value="tv" :size="size">
      <v-icon start :size="iconSize">mdi-television</v-icon>
      Séries
    </v-btn>
  </v-btn-toggle>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'all'
  },
  size: {
    type: String,
    default: 'default'
  },
  density: {
    type: String,
    default: 'default'
  },
  iconSize: {
    type: String,
    default: 'default'
  }
})

defineEmits(['update:modelValue'])
</script>
