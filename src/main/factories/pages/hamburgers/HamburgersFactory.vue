<script setup lang="ts">
import Hamburgers from "../../../../presentation/pages/hamburgers/Hamburgers.vue";
import { MakeCurrentAccountAdapter } from "../../cache";
import {ListHamburgers} from "../../usecases/HamburgersFactory";

</script>
<template>
    <Hamburgers :hamburgers="ListHamburgers()" :currentAccount="MakeCurrentAccountAdapter()"/>
  </template>

