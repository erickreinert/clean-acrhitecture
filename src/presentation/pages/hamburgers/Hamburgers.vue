<script setup lang="ts">
import { defineProps, PropType, ref, onMounted } from "vue";
// import axios from "axios";
import { faShoppingCart, faTrash, faArrowLeft, faArrowRight, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from "vue-router";
import { useCartStore } from "../../store/cartStore";

import { Hamburgers, HamburgersModel } from "../../protocols";

const { hamburgers } = defineProps({
    hamburgers: Object as PropType<Hamburgers>,
  })

const listaHamburgers = ref<HamburgersModel>([]);
const cartStore = useCartStore();
const router = useRouter();

// Função para listar os hambúrgueres
const listarHamburgers = async () => {
  if (hamburgers) {

    try {
      // const response = await axios.get<Hamburgers>("https://burgerlivery-api.vercel.app/hamburgers");
        const response = await hamburgers.get() 
        listaHamburgers.value = response;
    } catch (error) {
      console.error("Erro ao buscar hambúrgueres:", error);
    }
  }
};

// Navegar para a próxima tela
const goToNextPage = () => {
  router.push("/appetizers");
};

// Finalizar o pedido
const goToPayment = () => {
  router.push({ name: "payment" });
};

onMounted(listarHamburgers);
</script>

<template>
  <div class="hamburger-container">
    <h1 class="title">Hambúrgueres</h1>
    <ul class="hamburger-list">
      <li v-for="hamburger in listaHamburgers" :key="hamburger.id" class="hamburger-item">
        <img
          v-if="hamburger.image && hamburger.image.length > 0"
          :src="hamburger.image[0]"
          alt="Imagem do hambúrguer"
          class="hamburger-image"
        />
        <div class="hamburger-info">
          <h2 class="hamburger-title">{{ hamburger.title }}</h2>
          <p class="hamburger-description">{{ hamburger.description }}</p>

          <div class="hamburger-prices">
            <span class="price">Preço (Single): {{ currency(hamburger.values.single) }}</span>
            <FontAwesomeIcon
              class="cart-icon"
              :icon="faShoppingCart"
              @click="cartStore.addHamburgerToCart(hamburger, 'single')"
            />
          </div>

          <div class="hamburger-prices">
            <span class="price">Preço (Combo): {{ currency(hamburger.values.combo) }}</span>
            <FontAwesomeIcon
              class="cart-icon"
              :icon="faShoppingCart"
              @click="cartStore.addHamburgerToCart(hamburger, 'combo')"
            />
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
html, body {
  height: 100%;
  margin: 0;
}

.hamburger-container {
  font-family: 'Arial', sans-serif;
  height: 100%; /* Garantir que o contêiner ocupe 100% da altura da tela */
  width: 100%; 
  margin: 0;
  padding: 0;
  background-color: #ff7f32; 
  border-radius: 0; /* Corrigir border-radius para 0 ou valor desejado */
  position: relative;
  background-image: url('/assets/images/hambuger_page.jpg');
  background-size: cover;  /* Garantir que a imagem cubra todo o espaço */
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

.hamburger-list {
  list-style-type: none;
  padding: 0;
}

.hamburger-item {
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

.hamburger-item:hover {
  transform: translateY(-5px);
}

.hamburger-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
}

.hamburger-info {
  flex-grow: 1;
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

.price {
  font-size: 18px;
  color: #28a745;
}

.hamburger-prices {
  font-size: 16px;
  font-weight: bold;
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
