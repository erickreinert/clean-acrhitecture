<script setup lang="ts">
import Appetizers from "../../../../presentation/pages/appetizers/Appetizers.vue";
import { MakeCurrentAccountAdapter } from "../../cache";
import {ListAppetizers} from "../../usecases/AppetizersFactory";

</script>
<template>
    <Appetizers :appetizers="ListAppetizers()" :currentAccount="MakeCurrentAccountAdapter()"/>
  </template>
