<template>
  <v-container fluid class="d-flex align-center justify-center" style="min-height: 80vh;">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-card-title class="bg-white text-center">
            <span class="text-h5 text-black font-weight-bold">Connexion</span>
          </v-card-title>

          <v-card-text class="pt-6">
            <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                prepend-inner-icon="mdi-email"
                type="email"
                variant="outlined"
                required
              />

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                label="Mot de passe"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                required
              />

              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ errorMessage }}
              </v-alert>

              <v-btn
                :loading="loading"
                :disabled="!valid || loading"
                color="primary"
                size="large"
                type="submit"
                block
                class="mt-2"
              >
                Se connecter
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center pb-4">
            <v-btn variant="text" color="primary" @click="goToRegister">
              Pas encore de compte ? S'inscrire
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref(null)
const valid = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

const email = ref('')
const password = ref('')

// Utiliser le loading du store
const loading = computed(() => authStore.loading)

const emailRules = [
  v => !!v || 'L\'email est requis',
  v => /.+@.+\..+/.test(v) || 'L\'email doit être valide',
]

const passwordRules = [
  v => !!v || 'Le mot de passe est requis',
  v => (v && v.length >= 6) || 'Le mot de passe doit contenir au moins 6 caractères',
]

const handleLogin = async () => {
  errorMessage.value = ''

  const { valid: isValid } = await form.value.validate()

  if (!isValid) return

  try {
    // Utiliser le store Pinia pour la connexion
    await authStore.login(email.value, password.value)

    // Rediriger vers la page d'accueil
    router.push('/')
  } catch (error) {
    errorMessage.value = error.message || 'Erreur de connexion. Veuillez vérifier vos identifiants.'
    console.error('Login error:', error)
  }
}

const goToRegister = () => {
  // TODO: Créer la page d'inscription et décommenter
  // router.push('/register')
  console.log('Navigation vers la page d\'inscription')
}
</script>

<style scoped>


</style>
