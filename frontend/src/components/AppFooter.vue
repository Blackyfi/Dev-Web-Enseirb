<template>
  <v-footer app color="secondary" class="px-6 py-4">
    <v-row align="center" justify="space-between" no-gutters>
      <!-- Section gauche - Liens -->
      <v-col cols="12" md="6" class="text-center text-md-left mb-3 mb-md-0">
        <a
          v-for="link in links"
          :key="link.text"
          :href="link.href"
          class="footer-link mx-3"
        >
          {{ link.text }}
        </a>
      </v-col>

      <!-- Section droite - Copyright -->
      <v-col cols="12" md="6" class="text-center text-md-right">
        <span class="copyright-text">
          &copy; {{ currentYear }} Seenflix. Tous droits réservés.
        </span>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())

const links = [
  { text: 'À propos', href: '#' },
  { text: 'Contact', href: '#' },
  { text: 'Conditions d\'utilisation', href: '#' },
  { text: 'Confidentialité', href: '#' },
]
</script>

<style scoped>
.footer-link {
  color: #999;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #E50914;
}

.copyright-text {
  color: #999;
  font-size: 14px;
}

@media (max-width: 960px) {
  .footer-link {
    display: inline-block;
    margin: 4px 8px;
  }
}
</style>
