<script setup lang="ts">
import Appetizers from "../../../../presentation/pages/appetizers/Appetizers.vue";
import {ListAppetizers} from "../../usecases/AppetizersFactory";

</script>
<template>
    <Appetizers :appetizers="ListAppetizers()"/>
  </template>
