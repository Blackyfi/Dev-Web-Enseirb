<template>
  <RegisterForm />
</template>

<script setup>
import RegisterForm from "@/components/auth/RegisterForm.vue";

definePage({
  meta: {
    layout: "auth",
  },
});
</script>
