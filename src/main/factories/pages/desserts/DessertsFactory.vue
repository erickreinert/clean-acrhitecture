<script setup lang="ts">
import Desserts from "../../../../presentation/pages/desserts/Desserts.vue";
import { MakeCurrentAccountAdapter } from "../../cache";
import {ListDesserts} from "../../usecases/DessertsFactory";

</script>
<template>
    <Desserts :desserts="ListDesserts()" :currentAccount="MakeCurrentAccountAdapter()"/>
  </template>

