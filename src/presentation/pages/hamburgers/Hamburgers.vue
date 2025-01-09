<script  setup lang="ts">
 import { defineProps, PropType, ref, inject } from 'vue'
 import {Hamburgers} from "../../protocols"
 
 const { hamburgers } = defineProps({
    hamburgers: Object as PropType<Hamburgers>,
  })
</script>

<template>
   <div class="container"> text</div>
  </template>

<style>
.container{
  background-color: red;
}
</style>
