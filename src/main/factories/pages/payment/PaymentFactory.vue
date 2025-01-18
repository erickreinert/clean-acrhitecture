<script setup lang="ts">
import Payment from "../../../../presentation/pages/payment/Payment.vue";
import {ListPayment} from "../../usecases/PaymentFactory";

</script>
<template>
    <Payment :payment="ListPayment()"/>
  </template>

