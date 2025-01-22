<script setup lang="ts">
import { defineProps, PropType, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// Define as propriedades recebidas pelo componente
import { Categories } from "../../protocols";

const props = defineProps({
  Categories: Object as PropType<Categories>,
});

// Estado reativo para armazenar as categorias
const categories = ref([]);

// Instância do Vue Router para navegação
const router = useRouter();

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

// Função para navegar para a tela correspondente
const navigateToCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case "bebidas":
      router.push("/Beverages"); // Navega para a página de Bebidas
      break;
    case "combos":
      router.push("/combos"); // Navega para a página de Combos
      break;
    case "sobremesas":
      router.push("/Desserts"); // Navega para a página de Sobremesas
      break;
    case "burgers":
      router.push("/Hamburgers"); // Navega para a página de Burgers
      break;
    case "porções":
      router.push("/Appetizers"); // Navega para a página de Porções
      break;
    default:
      console.error("Categoria não encontrada.");
  }
};

// Carregar categorias ao montar o componente
onMounted(listarCategories);
</script>

<template>
  <div class="categories-container">
    <br></br>
    <h1 class="title">Categorias</h1>
    <ul class="categories-list">
      <!-- Renderiza a lista de categorias -->
      <li
        v-for="category in categories"
        :key="category.id"
        class="category-item"
        @click="navigateToCategory(category.text)"
      >
        <div class="category-card">
          <h2 class="category-title">{{ category.text }}</h2>
        </div>
      </li>
    </ul>
  </div>
</template>


<style scoped>

.categories-container {
  font-family: 'Arial', sans-serif;
  height: 100vh; 
  width: 100%; 
  margin: 0 auto;
  padding: 2px;
  background-color: #ff7f32;
  color: #ccc;
  background-image: url('/assets/images/categorias.jpg');
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat; 
  margin: 0; 
  padding: 0; 
}

.title {
  text-align: center;
  font-size: 36px;
  color: #fff; /* Cor do título em branco para contraste */
  margin-bottom: 350px;
  font-weight: bold;
}

.categories-list {
  display: flex; /* Faz os itens ficarem em uma linha */
  justify-content: space-around; /* Espaça igualmente os itens */
  list-style: none;
  padding: 10;
  gap: 20px; /* Espaço entre os itens */
}

.category-item {
  display: flex;
  justify-content: center;
}

.category-card {
  background: #f8f7f680;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(223, 55, 55, 0.1);
  transition: transform 0.2s ease-in-out;
  border-radius: 50%;
  text-align: center;
}

.category-card:hover {
  transform: scale(1.05);
  background-color: #f1f1f1;
}

.category-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}
</style>
