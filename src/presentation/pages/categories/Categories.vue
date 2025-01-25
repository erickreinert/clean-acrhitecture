<script setup lang="ts">
import { defineProps, PropType, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import CustomAlert from "../../components/CustomAlert.vue";
import axios from "axios";

// Define as propriedades recebidas pelo componente
import { Categories, CategoriesModel } from "../../protocols";

const {categories, currentAccount} = defineProps({
  categories: Object as PropType<Categories>,
  currentAccount: Function as PropType<any>
});

const listaCategories = ref<CategoriesModel>([])

// Instância do Vue Router para navegação
const router = useRouter();
const showCustomAlert = ref(false);
const alertMessage = ref(''); // Mensagem que será exibida no alerta

const onAlertClose = async () => {
  showCustomAlert.value = false; // Fecha o alerta
};


// Função para listar as categorias usando a propriedade injetada
const listarCategories = async () => {
  if (categories) {

    try {
      const response = await categories.get();
      listaCategories.value = response; // Atualiza o estado reativo
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    } finally {
      console.log("Consulta concluída!");
    }
  }
};

// Função para navegar para a tela correspondente
const navigateToCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case "bebidas":
      router.push("/Beverages"); // Navega para a página de Bebidas
      break;
    case "combos":
    alertMessage.value = `Produto indisponível, no momento.\nPor favor, explore os outros menus para realizar o seu pedido.\nAgradecemos a sua compreensão!`;
    showCustomAlert.value = true;
      return;
    case "sobremesas":
      router.push("/Desserts"); // Navega para a página de Sobremesas
      break;
    case "burgers":
      router.push("/Hamburgers"); // Navega para a página de Burgers
      break;
    case "porções":
      router.push("/Appetizers"); // Navega para a página de Porções
      break;
    default:
      console.error("Categoria não encontrada.");
  }
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
    listarCategories()
  }
);
</script>

<template>
  <div class="categories-container">
    <br></br>
    <h1 class="title">Categorias</h1>
    <ul class="categories-list">
      <!-- Renderiza a lista de categorias -->
      <li
        v-for="category in listaCategories"
        :key="category.id"
        class="category-item"
        @click="navigateToCategory(category.text)"
      >
        <div class="category-card">
          <h2 class="category-title">{{ category.text }}</h2>
        </div>
      </li>
    </ul>
    <CustomAlert 
      v-if="showCustomAlert" 
      :key="alertMessage" 
      :message="alertMessage" 
      :isVisible="showCustomAlert" 
      @close="onAlertClose" 
    />
  </div>
</template>

<style src="../../styles/categories.css"></style>


       