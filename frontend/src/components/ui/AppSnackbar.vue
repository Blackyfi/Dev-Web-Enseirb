<template>
  <v-snackbar
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :color="color"
    :timeout="timeout"
    location="bottom right"
  >
    {{ message }}
    <template v-slot:actions>
      <v-btn variant="text" @click="$emit('update:modelValue', false)">
        Fermer
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'success'
  },
  timeout: {
    type: Number,
    default: 3000
  }
})

defineEmits(['update:modelValue'])
</script>
