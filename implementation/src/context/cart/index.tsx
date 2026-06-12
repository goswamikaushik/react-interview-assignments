import {
  useReducer,
  type PropsWithChildren,
  createContext,
  useEffect,
} from "react";
import type {
  ActionType,
  CartContextType,
  State,
} from "../../features/project-01-shopping-cart-app/type";
import { localStorageAction } from "../../utils";

const reducer = (state: State, action: ActionType): State => {
  const { cartItems } = state;
  const { payload, type } = action;
  switch (type) {
    case "add-to-cart":
      return {
        ...state,
        cartItems: [...cartItems, { product: payload, quantity: 1 }],
      };
    case "increase-quantity":
      return {
        ...state,
        cartItems: cartItems.map((c) =>
          c.product.id === payload ? { ...c, quantity: c.quantity + 1 } : c,
        ),
      };
    case "decrease-quantity":
      return {
        ...state,
        cartItems: cartItems.map((c) =>
          c.product.id === payload ? { ...c, quantity: c.quantity - 1 } : c,
        ),
      };
    case "remove-from-cart":
      return {
        ...state,
        cartItems: cartItems.filter((c) => c.product.id !== payload),
      };
    default:
      return state;
  }
};

const initialValue: State = {
  cartItems: [],
};

const init = (): State => {
  const { get } = localStorageAction();
  try {
    const stored = get("cart-state");
    return stored ? JSON.parse(stored) : initialValue;
  } catch {
    return initialValue;
  }
};

const CartContext = createContext<CartContextType | null>(null);
const CartProvider = ({ children }: PropsWithChildren) => {
  const { set } = localStorageAction();
  const [state, dispatch] = useReducer(reducer, initialValue, init);

  const cartIds = state.cartItems.map((c) => c.product.id);

  useEffect(() => {
    set("cart-state", JSON.stringify(state));
  }, [state, set]);

  return (
    <CartContext.Provider value={{ state, dispatch, cartIds }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, CartContext };
