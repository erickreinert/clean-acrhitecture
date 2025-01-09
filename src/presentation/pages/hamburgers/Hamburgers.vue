<script setup lang="ts">
 import { defineProps, PropType, ref, inject } from 'vue'
 import {Hamburgers} from "../../protocols"
 
 const { hamburgers } = defineProps({
    hamburgers: Object as PropType<Hamburgers>,
  })
  const listarHamburgers=async () => {
    try {
      const response=await hamburgers.get() 
      console.log(response)
    } catch (error) {
      console.error(error)
    } finally {
      console.log("Consulta Feita !")
    }
  }
</script>

<template>
  
   <div class="container"> <button @click="listarHamburgers"> ham </button> text</div>
  </template>

<style>
.container{
  background-color: red;
}
</style>
