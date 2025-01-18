
<script setup lang="ts">
import { defineProps, PropType, ref, onMounted } from "vue";
import axios from "axios";

// Define as propriedades recebidas pelo componente
import { Categories } from "../../protocols";

const props = defineProps({
  Categories: Object as PropType<Categories>,
});

// Estado reativo para armazenar as categorias
const categories = ref([]);

// Função para listar as categorias usando a propriedade injetada
const listarCategories = async () => {
  try {
    const response = await axios.get("https://burgerlivery-api.vercel.app/categories");
    categories.value = response.data; // Atualiza o estado reativo
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
  } finally {
    console.log("Consulta concluída!");
  }
};

// Carregar categorias ao montar o componente
onMounted(listarCategories);
</script>

<template>
  <div class="categories-container">
    <h1 class="title">Categories</h1>
    <ul class="categories-list">
      <!-- Renderiza a lista de categorias -->
      <li v-for="category in categories" :key="category.id" class="category-item">
        <div class="category-card">
          <h2 class="category-title">{{ category.text }}</h2>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.categories-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.categories-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  list-style: none;
  padding: 0;
}

.category-item {
  display: flex;
  justify-content: center;
}

.category-card {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  text-align: center;
}

.category-card:hover {
  transform: scale(1.05);
  background-color: #f1f1f1;
}

.category-title {
  font-size: 1.2rem;
  color: #222;
  margin: 0;
}
</style>
