<script setup lang="ts">
import { defineProps, PropType, ref, onMounted } from "vue";
import { faArrowLeft, faArrowRight, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from "vue-router";
import { Beverages, BeveragesModel } from "../../protocols";
import { useCartStore } from "../../store/cartStore";
import { faShoppingCart, faTrash } from "@fortawesome/free-solid-svg-icons";


const { beverages, currentAccount } = defineProps({
  beverages: Object as PropType<Beverages>,
  currentAccount: Function as PropType<any>,
});

const listaBeverages = ref<BeveragesModel>([]);
const router = useRouter();
const cartStore = useCartStore();

// Função para listar as bebidas
const listarBeverages = async () => {
  if (beverages) {
    try {
      const response = await beverages.get();
      listaBeverages.value = response;
    } catch (error) {
      console.error("Erro ao buscar bebidas:", error);
    }
  }
};

// Função auxiliar para formatar valores monetários
const currency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Navegar para a tela inicial
const goToHome = () => {
  router.push("/categories");
};


// Navegar para a tela de pagamento
const goToPayment = () => {
  router.push({ name: "payment" });
};

const verificarAuthenticacao = async () => {
  if (!currentAccount.get()) {
    alert("Faça login antes!")
    location.href = "/login"
  } 
}

// Carregar opções de pagamento ao montar o componente
onMounted(() => {
    verificarAuthenticacao()
    listarBeverages()
  }
);
</script>

<template>
  <div class="beverages-container">
    <h1 class="title">Bebidas</h1>
    <ul class="beverages-list">
      <li v-for="beverage in listaBeverages" :key="beverage.id" class="beverage-item">
        <img :src="beverage.image" alt="Imagem da bebida" class="beverage-image" />    <!-- Imagem da bebida -->
        <div class="beverage-card">
          <!-- Detalhes da bebida -->
          <div class="beverage-details">
            <h2 class="beverage-title">{{ beverage.title }}</h2>
            <p class="beverage-description">{{ beverage.description }}</p>
            <div class="beverage-actions">
              <strong class="beverage-price">{{ currency(beverage.value) }}</strong>
              <FontAwesomeIcon
               class="cart-icon"
               :icon="faShoppingCart"
               @click="cartStore.addBeverageToCart(beverage)"
              />
            </div>
          </div>
        </div>
      </li>
    </ul>

    <!-- Resumo do pedido -->
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
          <!-- Exibe o valor dependendo do tipo do item (hambúrguer, aperitivo, bebida) -->
          {{ item.type 
           ? currency(item.type === "single" ? item.values.single : item.values.combo) 
           : item.size 
           ? currency(item.size === "small" ? item.values.small : item.values.large) 
           : currency(item.value) 
          }}
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

    <!-- Botões de navegação -->
    <div class="buttons-container">
      <button class="button" @click="goToHome">
        <FontAwesomeIcon :icon="faArrowLeft" /> Voltar para Inicio
      </button>
      <button class="button" @click="goToPayment" :disabled="cartStore.cart.length === 0">
        <FontAwesomeIcon :icon="faCreditCard" /> Finalizar Pedido
      </button>
    </div>
  </div>
</template>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
}

.beverages-container {
  font-family: 'Arial', sans-serif;
  height: 100%; /* Garantir que o contêiner ocupe 100% da altura da tela */
  width: 100%; 
  margin: 0;
  padding: 0;
  border-radius: 0; /* Corrigir border-radius para 0 ou valor desejado */
  position: relative;
  background-image: url('/assets/images/bebidas.jpg');
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

.beverages-list {
  list-style-type: none;
  padding: 0;
}

.beverage-item {
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

.beverage-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
}

.beverage-details {
  display: flex;
  flex-direction: column;
}

.beverage-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.beverage-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  align-items: center;
}

.beverage-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.beverage-price {
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
/* Resumo do Pedido */
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

/* Botões */
.buttons-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.button {
  background-color: #1d0eec;
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
  background-color: #6960ec;
  cursor: not-allowed;
}

.button:hover {
  background-color: #6960ec;
}
</style>
