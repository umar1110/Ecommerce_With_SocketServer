import {
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "@/redux/slices/cartSlice";
import { setCheckout } from "@/redux/slices/checkOutSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CartSlideOver = ({ isOpen, onClose }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let total = cart.reduce(
    (acc, item) => acc + item.salePrice * item.quantity,
    0
  );

  let totalSaved = cart.reduce((acc, item) => {
    if (item.beforeDiscountPrice) {
      return acc + (item.beforeDiscountPrice - item.salePrice) * item.quantity;
    }
    return acc;
  }, 0);
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-gray-500/75 dark:bg-gray-800/75 transition-opacity z-10"
          aria-hidden="true"
        ></div>
      )}

      {/* Slide Over Panel */}
      <div
        className={`pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 z-30 transform transition ease-in-out duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-[110%]"
        }`}
      >
        <div className="pointer-events-auto w-screen max-w-md">
          <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-900 shadow-xl">
            {/* Header */}
            <div className=" overflow-y-auto px-4 py-6 sm:px-6">
              <div className="flex items-start justify-between">
                <h2
                  className="text-lg font-medium text-gray-900 dark:text-gray-100"
                  id="slide-over-title"
                >
                  Shopping cart
                </h2>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <svg
                      className="size-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {cart.length > 0 ? (
              <div>
                <div
                  onClick={() => {
                    dispatch(clearCart());
                  }}
                  className="w-full  text-end pr-7 underline cursor-pointer text-blue-600 "
                >
                  Clear Cart
                </div>
                {/* Cart Items */}
                <div className="mt-8 px-4 py-6 sm:px-6">
                  <div className="flow-root">
                    <ul
                      role="list"
                      className="-my-6 divide-y divide-gray-200 dark:divide-gray-700"
                    >
                      {cart.map((item, i) => (
                        <li key={item._id} className="flex py-6">
                          <button
                            onClick={() => {
                              onClose();
                              navigate(
                                `/product/${item.title.replace(/\s+/g, "-")}`
                              );
                            }}
                            className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700"
                          >
                            <img
                              src={item.images[0]?.url}
                              alt={item.title}
                              className="size-full object-cover"
                            />
                          </button>

                          <div className="ml-4 flex flex-1 flex-col">
                            {/* Title and price */}
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-100">
                                <h3>
                                  <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                      navigate(
                                        `/product/${item.title.replace(
                                          /\s+/g,
                                          "-"
                                        )}`
                                      );
                                      onClose();
                                    }}
                                  >
                                    {item.title}
                                  </div>
                                </h3>
                                <div className="relative">
                                  <p className="ml-4">Rs. {item.salePrice}</p>
                                  {/* Price before discount */}
                                  {item.beforeDiscountPrice && (
                                    <p className="absolute right-0 bottom-[-70%] line-through text-gray-500 dark:text-gray-400 text-sm">
                                      Rs. {item.beforeDiscountPrice}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {item.beforeDiscountPrice && (
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="text-green-500 font-medium">
                                    {Math.floor(
                                      ((item.beforeDiscountPrice -
                                        item.salePrice) /
                                        item.beforeDiscountPrice) *
                                        100
                                    )}
                                    % off
                                  </span>
                                </p>
                              )}
                              {/*  List Selected features with values */}
                              <div className="flex flex-wrap mt-1 my-2 ">
                                {item.selectedFeatures?.map((feature, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-center px-2 py-1 mr-2 text-xs font-medium text-white bg-indigo-600 rounded-full"
                                  >
                                    {feature?.feature}: {feature?.value}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Quantity and Remove */}
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center justify-center">
                                {/* Decrement button */}
                                <button
                                  onClick={() => {
                                    if (item.quantity === 1) return;
                                    dispatch(decrementQuantity(item._id));
                                  }}
                                  className="group py-1 px-1 rounded-l-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                  <svg
                                    className="stroke-gray-900 dark:stroke-gray-300 group-hover:stroke-black dark:group-hover:stroke-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 22 22"
                                    fill="none"
                                  >
                                    <path
                                      d="M16.5 11H5.5"
                                      strokeWidth="1.6"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                                <input
                                  type="text"
                                  disabled
                                  className="border-y border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-300 text-center w-[50px] bg-transparent"
                                  placeholder={item.quantity}
                                />
                                {/* Increment button */}
                                <button
                                  onClick={() => {
                                    dispatch(incrementQuantity(item._id));
                                  }}
                                  className="group py-1 px-1 rounded-r-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                  <svg
                                    className="stroke-gray-900 dark:stroke-gray-300 group-hover:stroke-black dark:group-hover:stroke-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 22 22"
                                    fill="none"
                                  >
                                    <path
                                      d="M11 5.5V16.5M16.5 11H5.5"
                                      strokeWidth="1.6"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                              </div>

                              {/* Remove */}
                              <div className="flex">
                                <button
                                  onClick={() =>
                                    dispatch(removeFromCart(item._id))
                                  }
                                  type="button"
                                  className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-100">
                    <p>Subtotal</p>
                    <p>Rs. {total}</p>
                  </div>
                  <div className="flex justify-between text-sm line-through font-medium text-gray-900 dark:text-gray-100">
                    <p></p>
                    <p>Rs. {totalSaved + total}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                    Shipping charges calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        dispatch(setCheckout({ products: cart }));
                        onClose();
                        navigate("/checkout");
                      }}
                      className="flex items-center w-full justify-center rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700"
                    >
                      Checkout
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      or{" "}
                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        onClick={onClose}
                      >
                        Continue Shopping &rarr;
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96">
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  Your cart is empty
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSlideOver;
