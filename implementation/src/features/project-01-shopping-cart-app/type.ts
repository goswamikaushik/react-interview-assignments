import type { Dispatch } from "react";

export interface State {
  cartItems: CartItem[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  state: State;
  dispatch: Dispatch<ActionType>;
  cartIds: number[];
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export type ActionType =
  | { type: "add-to-cart"; payload: Product }
  | { type: "increase-quantity"; payload: number }
  | { type: "decrease-quantity"; payload: number }
  | { type: "remove-from-cart"; payload: number };
