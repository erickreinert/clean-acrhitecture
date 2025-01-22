<script setup lang="ts">
import { defineProps, PropType, ref, onMounted } from "vue";
import { faShoppingCart, faTrash, faArrowLeft, faArrowRight, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from "vue-router";
import { useCartStore } from "../../store/cartStore";

import { AppetizersBeverages, AppetizersModel } from "../../protocols";

const { appetizers } = defineProps({
  appetizers: Object as PropType<AppetizersBeverages>,
});

const listaAppetizers = ref<AppetizersModel>([]);
const cartStore = useCartStore();
const router = useRouter();

// Função para listar os aperitivos
const listarAppetizers = async () => {
  try {
    // Simula a obtenção dos dados. Você pode descomentar e usar um método para buscar os dados da API, como foi feito em Hamburgers.
    const response = await appetizers.get();
    listaAppetizers.value = response;
  } catch (error) {
    console.error("Erro ao buscar aperitivos:", error);
  }
};

// Navegar para a próxima tela
const goToNextPage = () => {
  router.push("/hamburgers");
};

// Finalizar o pedido
const goToPayment = () => {
  router.push({ name: "payment" });
};

onMounted(listarAppetizers);
</script>

<template>
  <div class="appetizer-container">
    <h1 class="title">Aperitivos</h1>
    <ul class="appetizer-list">
      <li v-for="appetizer in listaAppetizers" :key="appetizer.id" class="appetizer-item">
        <img
          v-if="appetizer.image && appetizer.image.length > 0"
          :src="appetizer.image"
          alt="Imagem do aperitivo"
          class="appetizer-image"
        />
        <div class="appetizer-info">
          <h2 class="appetizer-title">{{ appetizer.title }}</h2>
          <p class="appetizer-description">{{ appetizer.description }}</p>

          <div class="appetizer-prices">
            <strong v-if="appetizer.values.small !== null" class="price-small">
            <span class="price">Preço (Pequeno): {{ currency(appetizer.values.small) }}</span>
            <i class="fas fa-cart-plus"></i> <!-- Ícone do carrinho -->
            <FontAwesomeIcon
              class="cart-icon"
              :icon="faShoppingCart"
              @click="cartStore.addAppetizerToCart(appetizer, 'small')"
            />
          </strong>
          </div>

          <div class="appetizer-prices">
            <strong v-if="appetizer.values.large !== null" class="price-large">
            <span class="price">Preço (Grande): {{ currency(appetizer.values.large) }}</span>
            <FontAwesomeIcon
              class="cart-icon"
              :icon="faShoppingCart"
              @click="cartStore.addAppetizerToCart(appetizer, 'large')"
            />
            </strong>
          </div>
        </div>
      </li>
    </ul>

    <div class="buttons-container">
      <button class="button" @click="router.push('/Categories')">
        <FontAwesomeIcon :icon="faArrowLeft" /> Voltar para a Início
      </button>
      <button class="button" @click="goToNextPage">
        <FontAwesomeIcon :icon="faArrowRight" /> Avançar
      </button>
      <button class="button" @click="goToPayment" :disabled="cartStore.cart.length === 0">
        <FontAwesomeIcon :icon="faCreditCard" /> Finalizar Pedido
      </button>
    </div>
  </div>

  <div class="cart-container">
  <h2 class="cart-title">Resumo do Pedido</h2>
  <ul class="cart-list">
    <li v-for="(item, index) in cartStore.cart" :key="index" class="cart-item">
      <span>{{ item.title }} 
        <!-- Exibe o tipo para hambúrgueres e tamanho para aperitivos -->
        <span v-if="item.type">({{ item.type }})</span> 
        <span v-if="item.size">({{ item.size }})</span>
      </span>
      <span class="cart-price">
        <!-- Exibe o valor dependendo do tipo do item (hambúrguer ou aperitivo) -->
        {{ item.type 
          ? currency(item.type === "single" ? item.values.single : item.values.combo) 
          : currency(item.size === "small" ? item.values.small : item.values.large) }}
      </span>
      <FontAwesomeIcon
        class="remove-icon"
        :icon="faTrash"
        @click="cartStore.removeFromCart(index)"
      />
    </li>
  </ul>
  <div class="cart-total">
    <span>Total:</span>
    <span class="total-price">{{ currency(cartStore.cartTotal) }}</span>
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
.appetizer-container {
  font-family: 'Arial', sans-serif;
  height: 100vh; 
  width: 100%; 
  margin: 0;
  padding: 0;
  background-color: #ff7f32; 
  border-radius: px;
  position: relative;
  background-image: url('/assets/images/porçoes.jpg');
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat; 
    
}

.title {
  text-align: center;
  font-size: 36px;
  color: #fff; /* Cor do título em branco para contraste */
  margin-bottom: 20px;
  font-weight: bold;
}

.appetizer-list {
  list-style-type: none;
  padding: 0;
}

.appetizer-item {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7); /* Fundo branco com transparência */
  margin: 15px;
  padding: 15px;
  width: 50%;
  border-radius: 25px; /* Menor arredondamento */
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1); /* Sombra reduzida */
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

.price {
  font-size: 18px;
  color: #28a745;
}

.appetizer-prices {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.cart-icon {
  color: #28a745;
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
  top: 200px;
  right: 15px;
  background-color: rgba(255, 255, 255, 0.7); /* Fundo branco com transparência */
  padding: 20px;
  border-radius: 50px;
  max-width: 500px;
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
