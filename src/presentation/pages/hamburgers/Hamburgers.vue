<script setup lang="ts">
import { defineProps, PropType, ref, onMounted } from "vue";
import axios from "axios";
import { faShoppingCart, faTrash, faArrowLeft, faArrowRight, faCreditCard } from "@fortawesome/free-solid-svg-icons"; // Ícones
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"; // Componente de ícones
import { useRouter } from "vue-router"; // Importar para navegação

// Registrar os ícones no componente
const components = { FontAwesomeIcon };

import { Hamburgers } from "../../protocols";

const props = defineProps({
  Hamburgers: {
    type: Array as PropType<Hamburgers>,
    required: true,
  },
});

const hamburgers = ref<Hamburgers>([]);
const cart = ref<Hamburgers>([]);

const router = useRouter(); // Usar o roteador para navegação

// Função para listar os hambúrgueres
const listarHamburgers = async () => {
  try {
    const response = await axios.get<Hamburgers>("https://burgerlivery-api.vercel.app/hamburgers");
    hamburgers.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar hambúrgueres:", error);
  }
};

// Função para adicionar ao carrinho
const addToCart = (hamburger: Hamburgers[number], type: "single" | "combo") => {
  const cartItem = { ...hamburger, type };
  cart.value.push(cartItem);
  console.log(`Hambúrguer (${type}) adicionado ao carrinho:`, hamburger);
};

// Função para remover do carrinho
const removeFromCart = (index: number) => {
  cart.value.splice(index, 1);
  console.log("Item removido do carrinho:", cart.value);
};

// Função para ir à página home
const goHome = () => {
  router.push("/Home"); // Rota da tela inicial
};

// Função para avançar para a próxima tela
const goToNextPage = () => {
  router.push("/appetizers"); // Defina a próxima tela aqui (ex: /next)
};

// Função para finalizar o pedido (ir para a tela de pagamento)
const goToPayment = () => {
  router.push({ name: "payment", query: { cartData: JSON.stringify(cart.value) } }); // Passando os dados do carrinho
};

// Função para calcular o total do carrinho
const getCartTotal = () => {
  return cart.value.reduce((total, item) => {
    return total + (item.type === 'single' ? item.values.single : item.values.combo);
  }, 0);
};

onMounted(listarHamburgers);
</script>

<template>
  <div class="hamburger-container">
    <h1 class="title">Lista de Hambúrgueres</h1>
    <ul class="hamburger-list">
      <li v-for="hamburger in hamburgers" :key="hamburger.id" class="hamburger-item">
        <img
          v-if="hamburger.image && hamburger.image.length > 0"
          :src="hamburger.image[0]"
          alt="Imagem do hambúrguer"
          class="hamburger-image"
        />
        <div class="hamburger-info">
          <h2 class="hamburger-title">{{ hamburger.title }}</h2>
          <p class="hamburger-description">{{ hamburger.description }}</p>

          <!-- Preço Single com ícone -->
          <div class="hamburger-prices">
            <span class="price">
              Preço (Single): {{ currency(hamburger.values.single) }}
            </span>
            <FontAwesomeIcon
              class="cart-icon"
              :icon="faShoppingCart"
              @click="addToCart(hamburger, 'single')"
            />
          </div>

          <!-- Preço Combo com ícone -->
          <div class="hamburger-prices">
            <span class="price">
              Preço (Combo): {{ currency(hamburger.values.combo) }}
            </span>
            <FontAwesomeIcon
              class="cart-icon"
              :icon="faShoppingCart"
              @click="addToCart(hamburger, 'combo')"
            />
          </div>
        </div>
      </li>
    </ul>

    <!-- Botões de navegação -->
    <div class="buttons-container">
      <button class="button" @click="goHome">
        <FontAwesomeIcon :icon="faArrowLeft" /> Voltar para a Home
      </button>
      <button class="button" @click="goToNextPage">
        <FontAwesomeIcon :icon="faArrowRight" /> Avançar
      </button>
      <button class="button" @click="goToPayment" :disabled="cart.length === 0">
        <FontAwesomeIcon :icon="faCreditCard" /> Finalizar Pedido
      </button>
    </div>
  </div>

  <!-- Exibição do carrinho -->
  <div class="cart-container">
    <h2 class="cart-title">Resumo do Pedido</h2>
    <ul class="cart-list">
      <li v-for="(item, index) in cart" :key="index" class="cart-item">
        <span>{{ item.title }} ({{ item.type }})</span>
        <span class="cart-price">{{ currency(item.type === 'single' ? item.values.single : item.values.combo) }}</span>
        <!-- Botão de excluir do carrinho -->
        <FontAwesomeIcon
          class="remove-icon"
          :icon="faTrash"
          @click="removeFromCart(index)"
        />
      </li>
    </ul>
    <div class="cart-total">
      <span>Total:</span>
      <span class="total-price">{{ currency(getCartTotal()) }}</span>
    </div>
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
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ff6600; 
  color: white;
  border-radius: 8px;
  position: relative;
}

.title {
  text-align: center;
  font-size: 36px;
  margin-bottom: 20px;
}

.hamburger-list {
  list-style-type: none;
  padding: 0;
}

.hamburger-item {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.1); 
  padding: 15px;
  border-radius: 8px;
}

.hamburger-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid white;
}

.hamburger-info {
  flex-grow: 1;
}

.hamburger-title {
  font-size: 24px;
  font-weight: bold;
}

.hamburger-description {
  font-size: 16px;
  margin-bottom: 10px;
}

.price {
  font-size: 18px;
  color: #ffdd57;
}

.hamburger-prices {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.cart-icon {
  color: #ffdd57;
  cursor: pointer;
  font-size: 20px;
  transition: transform 0.3s, color 0.3s;
}

.cart-icon:hover {
  color: #ffd700;
  transform: scale(1.2);
}

.cart-container {
  position: fixed;
  top: 10px;
  right: 15px;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 50px;
  max-width: 350px;
  width: 100%;
  z-index: 10;
  overflow-y: auto; 
}

.cart-title {
  font-size: 24px;
  margin-bottom: 15px;
}

.cart-list {
  list-style: none;
  padding: 0;
}

.cart-item {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  width: 100%;
  white-space: nowrap; 
}

.cart-price {
  color: #070600;
  font-size: 18px;
  white-space: nowrap; 
  padding: 0;
}

.remove-icon {
  color: #dc3545;
  cursor: pointer;
  font-size: 20px;
  transition: transform 0.3s, color 0.3s;
}

.remove-icon:hover {
  color: #c82333;
  transform: scale(1.2);
}

.cart-total {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 20px;
}

.total-price {
  font-weight: bold;
  color: #0c0a01;
}


.buttons-container {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.button {
  background-color: #28a745;
  color: white;
  font-size: 18px;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  flex: 1;
  margin: 0 10px;
}

.button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.button:hover {
  background-color: #218838;
}

.button:disabled:hover {
  background-color: #6c757d;
}
</style>
