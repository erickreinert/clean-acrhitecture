
<script setup lang="ts">
import { defineProps, PropType, ref, onMounted } from "vue";
import axios from "axios";

// Define as propriedades recebidas pelo componente
import { appetizers } from "../../protocols";

const props = defineProps({
    appetizers: Object as PropType<Appetizers>,
});

// Estado reativo para armazenar os aperitivos
const appetizers = ref<Appetizer[]>([]);

// Função para listar os aperitivos
const listarAppetizers = async () => {
  try {
    const response = await axios.get<Appetizer[]>("https://burgerlivery-api.vercel.app/appetizers");
    appetizers.value = response.data; // Atualiza o estado reativo com os dados da API
  } catch (error) {
    console.error("Erro ao buscar appetizers:", error);
  } finally {
    console.log("Consulta concluída!");
  }
};

// Carregar aperitivos ao montar o componente
onMounted(listarAppetizers);
</script>

<template> 
    <div class="appetizers-container">
      <h1 class="title">Appetizers</h1>
      <ul class="appetizers-list">
        <!-- Renderiza a lista de aperitivos -->
        <li v-for="appetizer in appetizers" :key="appetizer.id" class="appetizer-item">
          <img :src="appetizer.image" alt="Imagem do aperitivo" class="appetizer-image" />
          <div class="appetizer-details">
            <h2 class="appetizer-title">{{ appetizer.title }}</h2>
            <p class="appetizer-description">{{ appetizer.description }}</p>
            <div class="appetizer-prices">
              <strong v-if="appetizer.values.small !== null" class="price-small">
                Preço (Pequeno): {{ appetizer.values.small | currency }}
              </strong>
              <strong v-if="appetizer.values.large !== null" class="price-large">
                Preço (Grande): {{ appetizer.values.large | currency }}
              </strong>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <style scoped>
    .appetizers-container {
      font-family: 'Arial', sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f8f8f8;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
  
    .title {
      text-align: center;
      font-size: 36px;
      color: #333;
      margin-bottom: 20px;
      font-weight: bold;
    }
  
    .appetizers-list {
      list-style-type: none;
      padding: 0;
    }
  
    .appetizer-item {
      display: flex;
      align-items: center;
      background-color: #fff;
      margin: 15px 0;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }
  
    .appetizer-item:hover {
      transform: translateY(-5px);
    }
  
    .appetizer-image {
      width: 120px;
      height: 120px;
      object-fit: cover;
      border-radius: 8px;
      margin-right: 20px;
    }
  
    .appetizer-details {
      flex-grow: 1;
    }
  
    .appetizer-title {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }
  
    .appetizer-description {
      font-size: 14px;
      color: #666;
      margin-bottom: 15px;
    }
  
    .appetizer-prices {
      font-size: 16px;
      font-weight: bold;
    }
  
    .price-small {
      color: #28a745;
      margin-right: 10px;
    }
  
    .price-large {
      color: #dc3545;
    }
  </style>

<script lang="ts">
// Função auxiliar para formatar valores monetários
export const currency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
</script>
