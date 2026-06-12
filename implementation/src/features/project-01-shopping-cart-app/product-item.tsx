import type { Product } from "./type";

const ProductItem = ({
  product,
  onAddToCart,
  cartIds,
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
  cartIds: number[];
}) => {
  const { category, description, image, price, rating, title, id } = product;

  return (
    <div className="product-item-container">
      <div className="product-image-container">
        <img src={image} className="product-image" />
      </div>
      <div className="product-content-container">
        <p className="product-title">{title}</p>
        <p className="product-description" title={description}>
          {description}
        </p>
        <p className="product-price">
          <span className="product-labels">Price:</span> {price}₹
        </p>
        <p className="product-category">
          <span className="product-labels">Category:</span> {category}
        </p>
        <p className="product-rate">
          <span className="product-labels">Rating:</span> {rating.rate}/5
        </p>
      </div>
      {!cartIds.includes(id) && (
        <button
          onClick={() => onAddToCart(product)}
          className="add-to-cart-button"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductItem;
