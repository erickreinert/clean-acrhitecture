export interface OrderItem {
    title: string;
    value: number;
  }
  
  export interface OrderRequest {
    items: OrderItem[];
    paymentOption: string;
  }
  
  // Define o protocolo para a resposta da criação de pedido
  export interface OrderResponse {
    orderNumber: string;
    createdAt: string;
    message: string;
    details: object;
  }
  