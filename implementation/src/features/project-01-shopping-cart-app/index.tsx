import { useEffect, useState } from "react";
import "./index.css";
import type { Product } from "./type";
import { useCart } from "../../context/cart/use-cart";
import { useDebounce } from "../../hooks";
import ProductItem from "./product-itemt";
import Loader from "./loader";

const ShoppingCart = () => {
  const [data, setData] = useState<{ product: Product[]; category: string[] }>({
    product: [],
    category: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<{ search: string; category: string }>({
    search: "",
    category: "",
  });
  const { state, dispatch, cartIds } = useCart();

  const onAddToCart = (product: Product) =>
    dispatch({ type: "add-to-cart", payload: product });

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://fakestoreapi.com/products/categories",
      );
      const data = await response.json();
      setData((prev) => ({ ...prev, category: data }));
    } catch (error) {
      console.error("Error while fetching product category", error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setData((prev) => ({ ...prev, product: data }));
    } catch (error) {
      setError(true);
      console.error("Error while fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.allSettled([fetchProduct(), fetchCategories()]);
    };
    loadData();
  }, []);

  const onChange = (value: string, action: "search" | "category") => {
    switch (action) {
      case "search":
        return setFilter((prev) => ({ ...prev, search: value }));
      case "category":
        return setFilter((prev) => ({ ...prev, category: value }));
      default:
        return;
    }
  };

  const debouncedSearch = useDebounce(filter.search, 800);

  const getFilteredProducts = () => {
    const { category } = filter;
    const { product } = data;
    let filtered = product;

    if (filter.category) {
      filtered = product.filter((p) => p.category === category);
    }

    return filtered.filter(
      ({ title, description }) =>
        title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        description.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  };

  const onIncreaseQuantity = (id: number) =>
    dispatch({ type: "increase-quantity", payload: id });

  const onDecreaseQuantity = (id: number) =>
    dispatch({ type: "decrease-quantity", payload: id });

  const onRemoveFromCart = (id: number) =>
    dispatch({ type: "remove-from-cart", payload: id });

  if (error) {
    return <div className="error">Error Occur While Fetching Products</div>;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <h1 className="head-product">Products</h1>
      <div className="main-container">
        {/* Product List and Filters */}
        <div className="product-list-filter-container">
          <div className="filter-actions">
            <select
              className="category-select"
              onChange={(e) => onChange(e.target.value, "category")}
            >
              <option key={"All Categories"} value={""}>
                All Categories
              </option>
              {data.category.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              placeholder="search by title or description"
              type="text"
              className="search-input"
              value={filter.search}
              onChange={(e) => onChange(e.target.value, "search")}
            />
          </div>
          <div className="products-container">
            {getFilteredProducts().map((p) => (
              <ProductItem
                cartIds={cartIds}
                product={p}
                key={p.id}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
        {/* Cart Actions */}
        <div className="cart-container">
          <h2 className="item-cart-head-text">Item Cart</h2>
          {state.cartItems.map(({ product, quantity }) => (
            <div key={product.id} className="cart">
              <p>{product.title}</p>
              <div className="button-container">
                <button
                  onClick={() => onIncreaseQuantity(product.id)}
                  className="plus-button"
                >
                  +
                </button>
                <p>{quantity}</p>
                <button
                  onClick={() => {
                    if (quantity - 1 <= 0) {
                      onRemoveFromCart(product.id);
                    }
                    onDecreaseQuantity(product.id);
                  }}
                  className="minus-button"
                >
                  -
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
