<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { PaymentModel, OrderItem, OrderRequest } from "@/protocols";

// Estado reativo para armazenar itens do pedido
const items = ref<OrderItem[]>([
  { title: "Hambúrguer X", value: 28 },
  { title: "Refrigerante", value: 10 },
]);

// Estado reativo para as opções de pagamento e a opção selecionada
const paymentModel = ref<PaymentModel[]>([]);
const selectedPaymentModel = ref<string>("");

// Carregar opções de pagamento
const loadPaymentModel = async () => {
  try {
    const response = await axios.get<PaymentModel[]>("https://burgerlivery-api.vercel.app/payment/options");
    paymentModel.value = response.data; // Atualiza as opções de pagamento
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
    items: items.value,
    paymentModel: selectedPaymentModel.value,
  };

  try {
    const response = await axios.post("https://burgerlivery-api.vercel.app/order/create-order", orderData);
    alert("Pedido realizado com sucesso!");
    console.log("Resposta do pedido:", response.data);
  } catch (error) {
    console.error("Erro ao finalizar pedido:", error);
  }
};

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
      <!-- Renderiza os itens do pedido -->
      <li v-for="item in items" :key="item.title">
        {{ item.title }} - {{ currency(item.value) }}
      </li>
    </ul>

    <h2>Forma de Pagamento</h2>
    <div>
      <!-- Renderiza as opções de pagamento -->
      <label
        v-for="option in paymentModel"
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
