<script setup lang="ts">
import { ref, onMounted, computed, defineProps } from "vue";
import axios from "axios";
import { useCartStore } from "../../store/cartStore"; // Importe a store do carrinho
import { PaymentModel, Payment } from "../../protocols";

const { payment } = defineProps({
  payment: Object as PropType<Payment>,
})

// Obtenha a store do carrinho
const cartStore = useCartStore();

// Estado reativo para as opções de pagamento e a opção selecionada
const listaPayment = ref<PaymentModel[]>([]);
const selectedPaymentModel = ref<string>("");

// Carregar opções de pagamento
const loadPaymentModel = async () => {
  try {
    const response = await payment.get();
    listaPayment.value = response; // Atualiza as opções de pagamento
  } catch (error) {
    console.error("Erro ao carregar opções de pagamento:", error);
  }
};

// Finalizar pedido
const finalizeOrder = async () => {
  if (!selectedPaymentModel.value) {
    alert("Selecione uma opção de pagamento.");
    return;
  }

  const orderData: OrderRequest = {
    items: cartStore.cart.map((item) => ({
      title: item.title,
      value: "type" in item 
        ? (item.type === "single" ? item.values.single : item.values.combo) 
        : ("size" in item 
          ? (item.size === "small" ? item.values.small : item.values.large)
          : item.value // Para bebidas
        ),
    })),
    paymentModel: selectedPaymentModel.value,
  };

  try {
    const response = await axios.post("https://burgerlivery-api.vercel.app/order/create-order", orderData);
    alert("Pedido realizado com sucesso!");
    console.log("Resposta do pedido:", response.data);
    cartStore.clearCart(); // Limpa o carrinho após finalizar o pedido
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

// Carregar opções de pagamento ao montar o componente
onMounted(loadPaymentModel);

// Função auxiliar para formatar valores monetários
const currency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
</script>

<template>
  <div>
    <h1>Resumo do Pedido</h1>
    <ul>
      <!-- Renderiza os itens do carrinho, diferenciando hambúrgueres, aperitivos e bebidas -->
      <li v-for="item in cartStore.cart" :key="item.title">
        {{ item.title }} 
        <span v-if="item.type">{{ item.type }}</span> <!-- Exibe tipo do hambúrguer -->
        <span v-if="item.size">{{ item.size }}</span> <!-- Exibe tamanho do aperitivo -->
        <span v-if="item.value">{{ currency(item.value) }}</span> <!-- Exibe preço da bebida -->
        - {{ currency("type" in item 
          ? (item.type === "single" ? item.values.single : item.values.combo) 
          : ("size" in item 
              ? (item.size === "small" ? item.values.small! : item.values.large!) 
              : item.value)) }}
      </li>
    </ul>

    <div class="order-total">
      <strong>Total do Pedido:</strong> {{ currency(totalOrder) }}
    </div>

    <h2>Forma de Pagamento</h2>
    <div>
      <!-- Renderiza as opções de pagamento -->
      <label
        v-for="option in listaPayment"
        :key="option.id"
        class="payment-option"
      >
        <input
          type="radio"
          :value="option.text"
          v-model="selectedPaymentModel"
        />
        {{ option.text }} - {{ currency(option.value) }}
      </label>
    </div>

    <button @click="finalizeOrder" class="finalize-button">Finalizar Pedido</button>
  </div>
</template>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 0.5rem;
}

.payment-option {
  display: block;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.finalize-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.finalize-button:hover {
  background-color: #0056b3;
}
</style>
