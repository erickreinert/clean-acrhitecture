<template>
  <div class="alert-overlay">
    <div class="alert-box">
      <div class="alert-message">{{ message }}</div>
      <button class="alert-close" @click="closeAlert">Fechar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  message: String,
  isVisible: Boolean,
});

const emit = defineEmits(["close"]);

const closeAlert = () => {
  emit("close");
};
</script>

<style src="../styles/alert.css"></style>
