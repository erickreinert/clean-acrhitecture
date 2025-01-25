<script setup lang="ts">
import Categories from "../../../../presentation/pages/categories/Categories.vue";
import { MakeCurrentAccountAdapter } from "../../cache";
import {ListCategories} from "../../usecases/CategoriesFactory";

</script>
<template>
    <Categories :categories="ListCategories()" :currentAccount="MakeCurrentAccountAdapter()"/>
  </template>

