
<script setup lang="ts">
import { defineProps, PropType, ref, onMounted } from "vue";
import axios from "axios";

// Define as propriedades recebidas pelo componente
import { Desserts } from "../../protocols";

const props = defineProps({
  Desserts: Object as PropType<Desserts>,
});

// Estado reativo para armazenar as categorias
const desserts = ref([]);

// Função para listar as categorias usando a propriedade injetada
const listarDesserts = async () => {
  try {
    const response = await axios.get("https://burgerlivery-api.vercel.app/desserts");
    desserts.value = response.data; // Atualiza o estado reativo
  } catch (error) {
    console.error("Erro ao buscar desserts:", error);
  } finally {
    console.log("Consulta concluída!");
  }
};

// Função auxiliar para formatar valores monetários
const currency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Carregar sobremesas ao montar o componente
onMounted(listarDesserts);
</script>

<template>
  <div class="desserts-container">
    <h1 class="title">Sabores Incríveis de Sobremesas</h1>
    <ul class="desserts-list">
      <li v-for="dessert in desserts" :key="dessert.id" class="dessert-item">
        <div class="dessert-card">
          <img :src="dessert.image" alt="Imagem da sobremesa" class="dessert-image" />
          <div class="dessert-info">
            <h2 class="dessert-title">{{ dessert.title }}</h2>
            <p class="dessert-description">{{ dessert.description }}</p>
            <strong class="dessert-price">{{ currency(dessert.value) }}</strong>
            <!--<button @click="addToCart(dessert)" class="add-to-cart-btn">Adicionar ao Carrinho</button>-->
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.desserts-container {
  padding: 20px;
  background-color: #f8f8f8;
  text-align: center;
}

.title {
  font-size: 2rem;
  margin-bottom: 30px;
  color: #333;
  font-weight: 600;
}

.desserts-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  list-style: none;
  padding: 0;
}

.dessert-item {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.dessert-item:hover {
  transform: translateY(-10px);
}

.dessert-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dessert-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 2px solid #eee;
}

.dessert-info {
  padding: 20px;
  text-align: left;
}

.dessert-title {
  font-size: 1.6rem;
  font-weight: bold;
  color: #444;
  margin: 10px 0;
}

.dessert-description {
  font-size: 1rem;
  color: #666;
  margin-bottom: 15px;
}

.dessert-price {
  font-size: 1.2rem;
  color: #d9534f;
  font-weight: 600;
}

.add-to-cart-btn {
  background-color: #d9534f;
  color: #fff;
  border: none;
  padding: 10px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.add-to-cart-btn:hover {
  background-color: #c9302c;
}
</style>
