<script setup lang="ts">
  import { defineProps, PropType, ref, inject } from 'vue'
  import { Authentication, Validation } from "../../protocols"
  import { useRouter } from 'vue-router'  // Importando o Vue Router

  const { authentication, currentAccount, validation } = defineProps({
    authentication: Object as PropType<Authentication>,
    validation: Object as PropType<Validation>,
    currentAccount: Function as PropType<any>,
  })

  const email = ref<string>('')
  const password = ref<string>('')
  const fieldErrror = ref<string>('')
  const valid = ref<boolean>(true)

  // Obtendo o objeto do router
  const router = useRouter()

  const changeValue = (event: Event) => {
    const { name, value } = event.target as HTMLInputElement
    fieldErrror.value = validation.validate(name, value)
    valid.value = Boolean(validation.validate(name, value))
  }

  const login = async () => {
    const params = {
      login: email.value,
      password: password.value
    }

    try {
      const response = await authentication.auth(params) 
      currentAccount.set(response)

      // Redireciona para a página home
      router.push('/Home')  
    } catch (error) {
      console.error(error)
    } finally {
      console.log('finally')
    }
  }
</script>

<template>
  <div class="login-container">
    <div class="login-form">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="email">E-mail</label>
          <input type="text" id="email" name="email" v-model="email" @input="changeValue" placeholder="Username" />
          <span class="error-message">{{ fieldError }}</span>
        </div>
        <div class="input-group">
          <label for="password">Senha</label>
          <input type="password" id="password" name="password" v-model="password" @input="changeValue" placeholder="Password" />
        </div>
        <button type="submit" :disabled="valid">Login</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Estilo para o layout da tela */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  width: 100%; 
  background-image: url('/assets/images/hamburger_capa.jpg');
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat; 
  margin: 0; 
  padding: 0; 
}

.login-form {
  background: rgba(255, 255, 255, 0.349);
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgb(3, 79, 244);
}

h1 {
  text-align: center;
  margin-bottom: 1rem;
  font-family: 'Arial', sans-serif;
  color: #3901f0;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: #3901f0;
}

.input-group input {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: bold;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.error-message {
  color: rgb(2, 0, 0);
  font-size: 1rem;
  font-weight: bold;
  margin-top: 0.5rem;
}

button {
  width: 100%;
  padding: 1rem;
  background-color: #1246ff;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #e69800;
}
</style>