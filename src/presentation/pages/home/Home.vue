<script setup lang="ts" >
    import { onMounted } from "vue";

    const goToLogin = () => {
        location.href = "/login"
    }

    onMounted(goToLogin)
</script>
<template>
    <div>
        <button @click="goToLogin()">Ir para login</button>
    </div>
</template>