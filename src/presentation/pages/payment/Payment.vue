<script setup lang="ts">
import { ref, onMounted, computed, defineProps, PropType } from "vue";
import { useCartStore } from "../../store/cartStore";
import { PaymentModel, Payment, Order, Authentication } from "../../protocols";
import { faArrowLeft, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from "vue-router";

const { payment, order, currentAccount } = defineProps({
  payment: Object as PropType<Payment>,
  order: Object as PropType<Order>,
  currentAccount: Function as PropType<any>,
});

// Obtenha a store do carrinho
const cartStore = useCartStore();

// Estado reativo para as opções de pagamento e a opção selecionada
const listaPayment = ref<PaymentModel[]>([]);
const selectedPaymentModel = ref<string>("");

// Carregar opções de pagamento
const loadPaymentModel = async () => {
  if (payment) {

    try {
      const response = await payment.get();
      listaPayment.value = response;
    } catch (error) {
      console.error("Erro ao carregar opções de pagamento:", error);
    }
  }
};

// Finalizar pedido
const finalizeOrder = async () => {
  if (!selectedPaymentModel.value) {
    alert("Selecione uma opção de pagamento.");
    return;
  }

  const orderData = {
    items: cartStore.cart.map((item) => ({
      title: item.title,
      value: "type" in item 
        ? (item.type === "single" ? Number(item.values.single) : Number(item.values.combo)) 
        : ("size" in item 
          ? (item.size === "small" ? Number(item.values.small) : Number(item.values.large))
          : item.value),
    })),
    paymentOption: selectedPaymentModel.value,
  };

  try {
    const token = currentAccount.get().token
    if (token) {
      const response = await order?.createOrder(orderData, token);
      alert("Pedido realizado com sucesso!\nNúmero do pedido: " + response?.orderNumber);
    }
    cartStore.clearCart(); // Limpa o carrinho após finalizar o pedido
    location.href = "/Categories"
  } catch (error) {
    console.error("Erro ao finalizar pedido:", error);
  }
};

// Computed para calcular o total do pedido
const totalOrder = computed(() =>
  cartStore.cart.reduce(
    (total, item) =>
      total + ("type" in item 
        ? (item.type === "single" ? item.values.single : item.values.combo) 
        : ("size" in item 
            ? (item.size === "small" ? item.values.small : item.values.large) 
            : item.value // Para bebidas
        )
    ), 
  0)
);

const verificarAuthenticacao = async () => {
  if (!currentAccount.get()) {
    alert("Faça login antes!")
    location.href = "/login"
  } 
}

// Carregar opções de pagamento ao montar o componente
onMounted(() => {
    verificarAuthenticacao()
    loadPaymentModel()
  }
);

// Função auxiliar para formatar valores monetários
const currency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Navegação
const router = useRouter();
const goBack = () => {
  router.push("/Categories");
};
</script>

<template>
  <div class="payment-container">
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
    <div class="order-total">
      <strong>Total do Pedido:</strong> {{ currency(totalOrder) }}
    </div>

    <h2 class="payment-title">Forma de Pagamento</h2>
    <div class="payment-options">
      <label v-for="option in listaPayment" :key="option.id" class="payment-option">
        <input type="radio" :value="option.text" v-model="selectedPaymentModel" />
        {{ option.text }}
      </label>
    </div>

    <div class="buttons-container">
      <button class="button" @click="goBack">
        <FontAwesomeIcon :icon="faArrowLeft" /> Voltar para a Início
      </button>
      <button class="button" @click="finalizeOrder">
        <FontAwesomeIcon :icon="faCreditCard" /> Confirmar Pedido
      </button>
    </div>
  </div>

</template>

<style scoped>
.payment-container {
  font-family: 'Arial', sans-serif;
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color:#fff;
  position: relative;
  background-image: url('/assets/images/pagamento.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.title {
  text-align: center;
  font-size: 36px;
  color: #fff;
  margin-bottom: 20px;
  font-weight: bold;
}

.cart-title {
  text-align: center;
  list-style: none;
  padding: 0;
  color: #fff;
}

.cart-list {
  list-style: none;
  padding: 5;
  color: #fff;
}

.cart-item {
  margin-bottom: 10px;
}

.order-total {
  text-align: center;
  font-size: 20px;
  color: #fff;
}

.payment-title {
  text-align: center;
  font-size: 20px;
  color: #fff;
  margin-top: 20px;
}

.payment-option {
  display: block;
  margin-bottom: 10px;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}

.payment-options {
  padding: 25px;
}

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

.cart-container {
  position: fixed;
  top: 200px;
  right: 15px;
  background-color: rgba(255, 255, 255, 0.7);
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

.cart-item {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  white-space: nowrap;
}

.cart-price {
  color: #fff;
  font-size: 18px;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 20px;
}

.total-price {
  font-weight: bold;
  color: #fff;
}
</style>
