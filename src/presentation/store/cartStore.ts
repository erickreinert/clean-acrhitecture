import { defineStore } from "pinia";
import type { HamburgersModel } from "../protocols";
import type { AppetizersModel } from "../protocols";
import type { DessertsModel } from "../protocols";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [] as Array<
      (HamburgersModel[number] & { type: "single" | "combo" }) |
      (AppetizersModel[number] & { size: "small" | "large" }) 
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
          return total + (item.size === "small" ? item.values.small : item.values.large);
        } 
        // Para sobremesas, assume-se que não há variação de preço, apenas o valor
        return total + item.value;
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
    addDessertsToCart(dessert: DessertsModel[number]) {
      // A sobremesa é adicionada diretamente sem o uso de 'size', já que esse campo não existe para sobremesas
      const cartItem = { ...dessert };
      this.cart.push(cartItem);
    },
    // Remover item genérico do carrinho
    removeFromCart(index: number) {
      this.cart.splice(index, 1);
    },
    // Limpar todo o carrinho
    clearCart() {
      this.cart = [];
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "cart",
        storage: localStorage,
      },
    ],
  },
});
