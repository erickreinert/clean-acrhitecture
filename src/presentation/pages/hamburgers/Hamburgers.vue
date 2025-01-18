<script setup lang="ts">
import { defineProps, PropType, ref, onMounted } from "vue";
import axios from "axios";

// Definição do tipo de dados para os hambúrgueres
import { Hamburgers } from "../../protocols";

const props = defineProps({
  Hamburgers: {
    type: Array as PropType<Hamburgers>, // Certifique-se de que Hamburgers seja um array de objetos
    required: true,
  },
});

// Estado reativo para armazenar os hambúrgueres
const hamburgers = ref<Hamburgers>([]);

// Função para listar os hambúrgueres
const listarHamburgers = async () => {
  try {
    const response = await axios.get<Hamburgers>("https://burgerlivery-api.vercel.app/hamburgers");
    hamburgers.value = response.data; // Atualiza o estado reativo com os dados da API
  } catch (error) {
    console.error("Erro ao buscar hamburgers:", error);
  } finally {
    console.log("Consulta concluída!");
  }
};

// Carregar hambúrgueres ao montar o componente
onMounted(listarHamburgers);
</script>

<template>
  <div class="hamburger-container">
    <h1 class="title">Hamburgers</h1>
    <ul class="hamburger-list">
      <!-- Renderiza a lista de hambúrgueres -->
      <li v-for="hamburger in hamburgers" :key="hamburger.id" class="hamburger-item">
        <div class="hamburger-card">
          <div class="image-gallery">
            <!-- Verifica se o campo de imagens é um array -->
            <div v-for="(img, index) in hamburger.image" :key="index" class="image-wrapper">
              <img :src="img" alt="Imagem do hambúrguer" class="hamburger-image" />
            </div>
          </div>
          <div class="hamburger-details">
            <h2 class="hamburger-title">{{ hamburger.title }}</h2>
            <p class="hamburger-description">{{ hamburger.description }}</p>
            <div class="hamburger-prices">
              <strong class="price">Preço (Single): {{ currency(hamburger.values.single) }}</strong>
              <br />
              <strong class="price">Preço (Combo): {{ currency(hamburger.values.combo) }}</strong>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
// Função auxiliar para formatar valores monetários
export const currency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
</script>



<style scoped>
  .hamburger-container {
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

  .hamburger-list {
    list-style-type: none;
    padding: 0;
  }

  .hamburger-item {
    display: flex;
    align-items: center;
    background-color: #fff;
    margin: 15px 0;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }

  .hamburger-item:hover {
    transform: translateY(-5px);
  }

  .image-gallery {
    display: flex;
    gap: 10px;
  }

  .image-wrapper {
    width: 120px;
    height: 120px;
    overflow: hidden;
    border-radius: 8px;
  }

  .hamburger-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hamburger-details {
    flex-grow: 1;
    margin-left: 20px;
  }

  .hamburger-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }

  .hamburger-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 15px;
  }

  .hamburger-prices {
    font-size: 16px;
    font-weight: bold;
  }

  .price {
    color: #28a745;
    margin-right: 10px;
  }
</style>

 