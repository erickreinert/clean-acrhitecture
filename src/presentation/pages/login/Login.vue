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
      router.push('/Categories')  
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

<style src="../../styles/login.css"></style>
