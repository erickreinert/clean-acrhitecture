<script setup lang="ts">
import { defineProps, PropType, ref, onMounted } from "vue";
import { faShoppingCart, faTrash, faArrowLeft, faArrowRight, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from "vue-router";
import { useCartStore } from "../../store/cartStore";
import {Desserts, DessertsModel} from "../../protocols"


const { desserts } = defineProps({
  desserts: Object as PropType<Desserts>,
  })

  const router = useRouter();
  const cartStore = useCartStore();

const listaDesserts = ref<DessertsModel>([])

const listarDesserts = async () => {
  if (desserts) {

      try {
        const response = await desserts.get();
        listaDesserts.value = response;
      } catch (error) {
        console.error("Erro ao buscar desserts:", error);
      }
  }
};

const currency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};


const addToCart = (dessert: any) => {
  console.log("Adicionando ao carrinho:", dessert); // Log de depuração
  cartStore.addToCart({
    id: dessert.id,
    title: dessert.title,
    value: dessert.value,
    type: "dessert",
  });
};

const goToNextPage = () => {
  router.push("/beverages");
};

const goToPayment = () => {
  router.push({ name: "payment" });
};

onMounted(listarDesserts);
</script>

<template>
  <div class="desserts-container">
    <h1 class="title">Sobremesas</h1>
    <ul class="desserts-list">
      <li v-for="dessert in listaDesserts" :key="dessert.id" class="dessert-item">
        <img :src="dessert.image" alt="Imagem da sobremesa" class="dessert-image" />
        <div class="dessert-info">
          <h2 class="dessert-title">{{ dessert.title }}</h2>
          <p class="dessert-description">{{ dessert.description }}</p>
          <div class="dessert-bottom">
            <span class="dessert-price">{{ currency(dessert.value) }}</span>
            <FontAwesomeIcon
              class="cart-icon"
              :icon="faShoppingCart"
              @click="addToCart(dessert)"
            />
          </div>
        </div>
      </li>
    </ul>

    <!-- Botões de navegação -->
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

  <!-- Carrinho -->
  <div class="cart-container">
    <h2 class="cart-title">Resumo do Pedido</h2>
    <ul class="cart-list">
      <li v-for="(item, index) in cartStore.cart" :key="index" class="cart-item">
        <span>{{ item.title }}</span>
        <span class="cart-price">{{ currency(item.value) }}</span>
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

<style scoped>
.desserts-container {
  font-family: 'Arial', sans-serif;
  height: 100vh; 
  width: 100%; 
  margin: 0;
  padding: 0;
  background-color: #ff7f32; 
  border-radius: px;
  position: relative;
  background-image: url('/assets/images/sobremesa.jpg');
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

.desserts-list {
  list-style-type: none;
  padding: 0;
}

.dessert-item {
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

.dessert-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
}

.dessert-info {
  display: flex;
  flex-direction: column;
}

.dessert-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.dessert-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.dessert-bottom {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dessert-price {
  font-size: 16px;
  font-weight: bold;
  color: #28a745;
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

/* Botões de navegação */
.buttons-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
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

/* Carrinho */
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

</style>
