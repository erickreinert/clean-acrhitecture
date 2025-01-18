
<script setup lang="ts">
import { defineProps, PropType, ref, onMounted } from "vue";
import axios from "axios";

// Define as propriedades recebidas pelo componente
import { Beverages } from "../../protocols";

const props = defineProps({
    Beverages: Object as PropType<Beverages>,
});

const beverages = ref<Beverage[]>([]);

// Função para listar as bebidas
const listarBeverages = async () => {
  try {
    const response = await axios.get<Beverage[]>("https://burgerlivery-api.vercel.app/beverages");
    beverages.value = response.data; // Atualiza o estado reativo com os dados da API
  } catch (error) {
    console.error("Erro ao buscar beverages:", error);
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

// Carregar bebidas ao montar o componente
onMounted(listarBeverages);
</script>

<template>
    <div class="beverages-container">
      <h1 class="title">Beverages</h1>
      <ul class="beverages-list">
        <!-- Renderiza a lista de bebidas -->
        <li v-for="beverage in beverages" :key="beverage.id" class="beverage-item">
          <div class="beverage-card">
            <img :src="beverage.image" alt="Imagem da bebida" class="beverage-image" />
            <div class="beverage-details">
              <h2 class="beverage-title">{{ beverage.title }}</h2>
              <p class="beverage-description">{{ beverage.description }}</p>
              <strong class="beverage-price">Preço: {{ currency(beverage.value) }}</strong>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <style scoped>
  .beverages-container {
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
  
  .beverages-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    list-style: none;
    padding: 0;
  }
  
  .beverage-item {
    display: flex;
    justify-content: center;
  }
  
  .beverage-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
    text-align: center;
    padding: 10px;
  }
  
  .beverage-card:hover {
    transform: scale(1.05);
    background-color: #f1f1f1;
  }
  
  .beverage-image {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 15px;
  }
  
  .beverage-details {
    padding: 10px;
  }
  
  .beverage-title {
    font-size: 1.5rem;
    color: #222;
    margin: 0;
  }
  
  .beverage-description {
    margin: 10px 0;
    color: #555;
    font-size: 1rem;
    line-height: 1.4;
  }
  
  .beverage-price {
    font-size: 1.2rem;
    color: #007b00;
    font-weight: bold;
  }
  </style>
  