<script setup lang="ts">
import { defineProps, PropType, ref, onMounted } from "vue";
// import axios from "axios";
import { faShoppingCart, faTrash, faArrowLeft, faArrowRight, faCreditCard, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from "vue-router";
import { useCartStore } from "../../store/cartStore";

import { Hamburgers, HamburgersModel } from "../../protocols";


const { hamburgers, currentAccount } = defineProps({
    hamburgers: Object as PropType<Hamburgers>,  
    currentAccount: Function as PropType<any>,

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

const verificarAuthenticacao = async () => {
  if (!currentAccount.get()) {
    alert("Faça login antes!")
    location.href = "/login"
  } 
}

// Carregar opções de pagamento ao montar o componente
onMounted(() => {
    verificarAuthenticacao()
    listarHamburgers()
  }
);

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

    <div class="top-buttons">
      <button class="circle-button left" @click="router.push('/Categories')">
        <FontAwesomeIcon :icon="faHome" /> 
      </button>
      <button class="circle-button center" @click="goToNextPage">
        <FontAwesomeIcon :icon="faArrowRight" /> 
      </button>
      <button class="circle-button rigth" @click="goToPayment" :disabled="cartStore.cart.length === 0">
        <FontAwesomeIcon :icon="faCreditCard" /> 
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

<style src="../../styles/hamburgers.css"></style>
