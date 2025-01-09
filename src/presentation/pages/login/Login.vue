<script  setup lang="ts">   
  import { defineProps, PropType, ref, inject } from 'vue'
  import { Authentication, Validation } from "../../protocols"

  const { authentication, currentAccount, validation } = defineProps({
    authentication: Object as PropType<Authentication>,
    validation: Object as PropType<Validation>,
    currentAccount: Function as PropType<any>,
  })

  const email = ref<string>('')
  const password = ref<string>('')
  const fieldErrror = ref<string>('')
  const valid = ref<boolean>(true)

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
    } catch (error) {
      console.error(error)
    } finally {
      console.log('finally')
    }
  }

</script>
<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="login">
          <div>
            <label for="email">email</label>
            <input type="text" id="email" name="email" v-model="email" @input="changeValue" placeholder="Username" />
            <span>{{fieldErrror}}</span>
          </div>
          <div>
            <label for="password">Senha</label>
            <input type="password" id="password" name="password" v-model="password" @input="changeValue" placeholder="Password" />
          </div>
            <button type="submit" :disabled="valid">Login</button>
        </form>
    </div>
</template>
<style scoped>
  
</style>
