import { defineStore } from "pinia";
import type { HamburgersModel, AppetizersModel, DessertsModel, BeveragesModel } from "../protocols";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [] as Array<
      (HamburgersModel[number] & { type: "single" | "combo" }) |
      (AppetizersModel[number] & { size: "small" | "large" }) |
      DessertsModel[number] |
      BeveragesModel[number]
    >,
  }),
  getters: {
    cartTotal: (state) =>
      state.cart.reduce((total, item) => {
        if ("type" in item) {
          // É um hambúrguer
          return total + (item.type === "single" ? item.values.single : item.values.combo);
        } else if ("size" in item) {
          // É um aperitivo
          return total + (item.size === "small" && item.values.small != null ? item.values.small : (item.size === "large" && item.values.large != null ? item.values.large : 0));
        } else {
          return total + item.value;
        }
      }, 0),
  },
  actions: {
    // Adicionar um hambúrguer ao carrinho
    addHamburgerToCart(hamburger: HamburgersModel[number], type: "single" | "combo") {
      const cartItem = { ...hamburger, type };
      this.cart.push(cartItem);
    },
    // Adicionar um aperitivo ao carrinho
    addAppetizerToCart(appetizer: AppetizersModel[number], size: "small" | "large") {
      const cartItem = { ...appetizer, size };
      this.cart.push(cartItem);
    },
    // Adicionar uma sobremesa ao carrinho
    addDessertToCart(dessert: DessertsModel[number]) {
      const cartItem = { ...dessert };
      this.cart.push(cartItem);   
    },
    // Adicionar uma bebida ao carrinho
    addBeverageToCart(beverage: BeveragesModel[number]) {
      const cartItem = { ...beverage };
       this.cart.push(cartItem);   
    },
    // Remover item do carrinho
    removeFromCart(index: number) {
      this.cart.splice(index, 1);
    },
    // Limpar todo o carrinho
    clearCart() {
      this.cart = [];
    },
  },
  persist: true, // Ativa a persistência diretamente aqui
});
