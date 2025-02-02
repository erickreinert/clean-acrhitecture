<script setup lang="ts">
import { defineProps, PropType, ref, onMounted } from "vue";
import { faShoppingCart, faTrash, faCreditCard, faHome, faGlassMartini, faBowlFood, faHamburger  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from "vue-router";
import { useCartStore } from "../../store/cartStore";
import {Desserts, DessertsModel} from "../../protocols"


const { desserts, currentAccount } = defineProps({
  desserts: Object as PropType<Desserts>,
  currentAccount: Function as PropType<any>,
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

const addToCart = (dessert) => {
  cartStore.addDessertToCart(dessert); // Usa a ação de adicionar sobremesa do Pinia
};

// Navegar para a tela inicial
const goToHome = () => {
  router.push("/categories");
};

// Ir para Hamburgers
const goToHamburgers = () => {
  router.push("/hamburgers");
};

// Ir para  Appertizers
const goToAppetizers = () => {
  router.push("/appetizers");
};

// Ir para Bebidas
const goToBeverages = () => {
  router.push("/beverages");
};

// Ir para Pagamento 
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
    listarDesserts()
  }
);

</script>

<template>
  <div class="desserts-container">
    <h1 class="title">Sobremesas</h1>
    <ul class="desserts-list">
      <li v-for="dessert in listaDesserts" :key="dessert.id" class="dessert-item">
        <img :src="dessert.image" alt="Imagem da sobremesa" class="dessert-image" />
        <div class="dessert-info">
          <h2 class="dessert-title">{{ dessert.title }}</h2>
          <p class="dessert-description">{{ dessert.text }}</p>
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
    <div class="top-buttons">      
      <!-- Botão de voltar -->
      <button class="circle-button left" @click="goToHome" title= 'Ir para o Home'>
        <FontAwesomeIcon :icon="faHome" />
      </button>
      <button class="circle-button center" @click="goToHamburgers" title= 'Ir para o Hamburgers'>
        <FontAwesomeIcon :icon="faHamburger" /> 
      </button>
      <button class="circle-button center" @click="goToAppetizers" title= 'Ir para o Porções'>
        <FontAwesomeIcon :icon="faBowlFood" /> 
      </button>
      <button class="circle-button center" @click="goToBeverages" title= 'Ir para o Bebidas'>
        <FontAwesomeIcon :icon="faGlassMartini" /> 
      </button>
      <!-- Botão de pagamento -->
      <button class="circle-button rigth" @click="goToPayment" :disabled="cartStore.cart.length === 0" :title="cartStore.cart.length === 0 ? 'Adicione itens ao carrinho para prosseguir com o pagamento' : 'Ir para o pagamento'">
        <FontAwesomeIcon :icon="faCreditCard" />
      </button>
    </div>
  </div>

  <!-- Carrinho -->
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

<style src="../../styles/desserts.css"></style>
