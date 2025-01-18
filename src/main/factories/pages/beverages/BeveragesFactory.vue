<script setup lang="ts">
import Beverages from "../../../../presentation/pages/beverages/Beverages.vue";
import {ListBeverages} from "../../usecases/BeveragesFactory";

</script>
<template>
    <Beverages :beverages="ListBeverages()"/>
  </template>
