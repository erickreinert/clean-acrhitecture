<script setup lang="ts">
import Beverages from "../../../../presentation/pages/beverages/Beverages.vue";
import { MakeCurrentAccountAdapter } from "../../cache";
import {ListBeverages} from "../../usecases/BeveragesFactory";

</script>
<template>
    <Beverages :beverages="ListBeverages()" :currentAccount="MakeCurrentAccountAdapter()"/>
  </template>
