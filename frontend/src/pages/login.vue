<template>
  <LoginForm />
</template>

<script setup>
import LoginForm from "@/components/auth/LoginForm.vue";

definePage({
  meta: {
    layout: "auth",
  },
});
</script>
