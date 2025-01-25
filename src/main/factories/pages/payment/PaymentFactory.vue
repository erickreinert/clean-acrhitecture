<script setup lang="ts">
import Payment from "../../../../presentation/pages/payment/Payment.vue";
import { MakeCurrentAccountAdapter } from "../../cache";
import {ListPayment, CreateOrder, } from "../../usecases/PaymentFactory";

</script>
<template>
    <Payment :payment="ListPayment()" :order="CreateOrder()" :currentAccount="MakeCurrentAccountAdapter()"/>
  </template>

