<script setup lang="ts">
import { defineProps, PropType, ref, onMounted } from "vue";
import { faShoppingCart, faTrash, faArrowLeft, faArrowRight, faCreditCard, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from "vue-router";
import { useCartStore } from "../../store/cartStore";


import { AppetizersBeverages, AppetizersModel } from "../../protocols";

const { appetizers, currentAccount } = defineProps({
  appetizers: Object as PropType<AppetizersBeverages>,
  currentAccount: Function as PropType<any>,
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
  router.push("/beverages");
};

// Finalizar o pedido
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
    listarAppetizers()
  }
);

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

    <div class="top-buttons">
      <button class="circle-button left" @click="router.push('/Categories')">
        <FontAwesomeIcon :icon="faHome" /> 
      </button>
      <button class="circle-button center" @click="goToNextPage">
        <FontAwesomeIcon :icon="faArrowRight" /> 
      </button>
      <button class="circle-button rigth" @click="goToPayment" :disabled="cartStore.cart.length === 0"  :title="cartStore.cart.length === 0 ? 'Adicione itens ao carrinho para prosseguir com o pagamento' : 'Ir para o pagamento'">
             <FontAwesomeIcon :icon="faCreditCard" /> 
      </button>
    </div>
  </div>
  <div class="cart-container">
  <h2 class="cart-title">Resumo do Pedido</h2>
  <ul class="cart-list">
    <li v-for="(item, index) in cartStore.cart" :key="index" class="cart-item">
      <span>
        {{ item.title }}
        <span v-if="item.type">({{ item.type }})</span>
        <span v-if="item.size">({{ item.size }})</span>
      </span>
      <span class="cart-price">
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

<style src="../../styles/appetizers.css"></style>
