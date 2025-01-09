<script setup lang="ts">
import Hamburgers from "../../../../presentation/pages/hamburgers/Hamburgers.vue";
import {ListHamburgers} from "../../usecases/HamburgersFactory";

</script>
<template>
    <Hamburgers :hamburgers="ListHamburgers()"/>
  </template>

