<script setup lang="ts">
import { defineProps, PropType, ref, onMounted } from "vue";
import { faArrowLeft, faArrowRight, faCreditCard, faHome } from "@fortawesome/free-solid-svg-icons";
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

const goToNextPage = () => {
  router.push("/desserts");
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
    <div class="top-buttons">
      <button class="circle-button left" @click="goToHome">
        <FontAwesomeIcon :icon="faHome" /> 
      </button>
      <button class="circle-button center" @click="goToNextPage">
        <FontAwesomeIcon :icon="faArrowRight" /> 
      </button>
      <button class="circle-button rigth" @click="goToPayment" :disabled="cartStore.cart.length === 0" :title="cartStore.cart.length === 0 ? 'Adicione itens ao carrinho para prosseguir com o pagamento' : 'Ir para o pagamento'">
          <FontAwesomeIcon :icon="faCreditCard" />
      </button>
    </div>
  </div>
</template>

<style src="../../styles/beverages.css"></style>
