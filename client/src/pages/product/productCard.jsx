import { Button } from "@/components/ui/button";
import { addToCart } from "@/redux/slices/cartSlice";
import { setCheckout } from "@/redux/slices/checkOutSlice";
import { CircleCheckBig, LucideBaggageClaim } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const selectedFeature = product?.features?.map((feature) => ({
    feature: feature?.feature,
    value: feature?.values[0]?.value,
  }));
  const navigate = useNavigate();

  const addToCartHandle = (product) => {
    dispatch(addToCart({ product }));
  };
  return (
    <div
      key={product._id}
      className="featured-product-card w-[10.5rem] sm:w-44 xl:w-50 2xl:w-56 my-2 pb-3 shadow-sm shadow-slate-200 dark:shadow-slate-800 space-y-1 bg-slate-100 flex flex-col justify-between dark:bg-slate-900 relative rounded-md hover:shadow-xl overflow-hidden hover:scale-[1.002]"
    >
      <Link to={`/product/${product.title.replace(/\s+/g, "-")}`}>
        {/* Sale tag */}
        {product.beforeDiscountPrice && product.stock > 1 && (
          <div className="absolute top-0 right-0 bg-red-500 text-white font-semibold px-1 py-0.5">
            {Math.floor(
              ((product.beforeDiscountPrice - product.salePrice) /
                product.beforeDiscountPrice) *
                100
            )}
            % off
          </div>
        )}
        {product.stock < 1 && (
          <div className="absolute top-0 right-0 bg-red-400 rounded-lg text-white font-semibold px-1 py-0.5">
            Out of stock
          </div>
        )}

        {/* Image */}
        <img
          src={product.images[0]?.url}
          alt={product.title}
          className="w-full h-40 xl:h-44 2xl:h-52 object-cover"
        />
        {/* Title */}
        <h2 className="font-semibold mb-5 text-start line-clamp-2 px-1">
          {product.title}
        </h2>
        {/* Price & Ratings*/}
        <div className="flex justify-between items-start pr-3 px-1">
          <div>
            <div className="font-semibold text-md">
              <span className="font-mono">Rs.</span>
              <span className="font-serif text-lg">{product.salePrice}</span>
            </div>
            {product.beforeDiscountPrice && (
              <div className="font-semibold text-sm line-through -translate-y-2 text-red-500">
                <span className="font-mono">Rs.</span>
                <span className="font-serif">
                  {product.beforeDiscountPrice}
                </span>
              </div>
            )}
          </div>
          <span className="font-sans text-sm mt-1 flex">
            <svg
              className="w-4 h-4 text-yellow-300 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <span className="w-1 h-1 mr-1.5 rounded-full ">
              ({product.ratings})
            </span>
          </span>
        </div>
      </Link>
      {/* Add to cart or buy Now */}
      <div className="flex justify-between items-center flex-col space-y-1">
        <Button
          onClick={(e) => {
            addToCartHandle(product);
          }}
          disabled={product.stock < 1}
          variant="outline"
          className="btn btn-primary hover:text-black hover:bg-gray-50 w-full flex justify-between"
        >
          <LucideBaggageClaim /> <span>Add to Cart</span>
          <span></span>
        </Button>
        <Button
          onClick={() => {
            dispatch(
              setCheckout({
                products: [
                  {
                    ...product,
                    quantity: 1,
                    selectedFeatures: selectedFeature,
                  },
                ],
              })
            );
            navigate(`/checkout`);
          }}
          disabled={product.stock < 1}
          className="btn btn-secondary w-full flex justify-between"
        >
          <CircleCheckBig />
          <span>Buy Now</span>
          <span></span>
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
