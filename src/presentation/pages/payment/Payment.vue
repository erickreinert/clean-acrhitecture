<script setup lang="ts">
import { ref, onMounted, computed, defineProps, PropType } from "vue";
import { useCartStore } from "../../store/cartStore";
import { PaymentModel, Payment, Order, Authentication } from "../../protocols";
import { faArrowLeft, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from "vue-router";
import CustomAlert from "../../components/CustomAlert.vue";

const { payment, order, currentAccount } = defineProps({
  payment: Object as PropType<Payment>,
  order: Object as PropType<Order>,
  currentAccount: Function as PropType<any>,
});

const cartStore = useCartStore();

const showCustomAlert = ref(false);
const alertMessage = ref(''); // Mensagem que será exibida no alerta
const alertType = ref(""); 

const onAlertClose = async () => {
  showCustomAlert.value = false; // Fecha o alerta
  if (alertType.value === "success") {
    router.push("/Categories"); // Só redireciona para categorias se o alerta for de sucesso
  }
};


const listaPayment = ref<PaymentModel[]>([]);
const selectedPaymentModel = ref<string>("");


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
const finalizeOrder = async () => {
  if (!selectedPaymentModel.value) {
    alertMessage.value = "Selecione uma opção de pagamento. Por favor!";
    showCustomAlert.value = true; // Exibe o alerta customizado
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
    const token = currentAccount.get().token;
    if (token) {
      const response = await order?.createOrder(orderData, token);
      // Exibe a mensagem de sucesso
      alertMessage.value = `Pedido realizado com sucesso! Número do pedido: ${response?.orderNumber} !`;
      showCustomAlert.value = true; 
      alertType.value = "success";
      cartStore.clearCart(); 
      return; 
    }
  } catch (error) {
    console.error("Erro ao finalizar pedido:", error);
  }
};

const totalOrder = computed(() =>
  cartStore.cart.reduce(
    (total, item) =>
      total + ("type" in item 
        ? (item.type === "single" ? item.values.single : item.values.combo) 
        : ("size" in item 
            ? (item.size === "small" ? item.values.small : Number(item.values.large))
            : item.value)
    ), 
  0)
);

const verificarAuthenticacao = async () => {
  if (!currentAccount.get()) {
    alert("Faça login antes!");
    location.href = "/login";
  } 
}

onMounted(() => {
  verificarAuthenticacao();
  loadPaymentModel();
});

const currency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

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

    <CustomAlert 
      v-if="showCustomAlert" 
      :key="alertMessage" 
      :message="alertMessage" 
      :isVisible="showCustomAlert" 
      @close="onAlertClose" 
    />
  </div>
</template>

<style src="../../styles/payment.css"></style>
