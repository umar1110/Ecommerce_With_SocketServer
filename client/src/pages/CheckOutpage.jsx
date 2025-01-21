import { Input } from "@/components/ui/Input";
import { clearCart } from "@/redux/slices/cartSlice";
import {
  cleareCheckout,
  deleteProductFromCheckout,
  getCheckout,
} from "@/redux/slices/checkOutSlice";
import axiosBackend from "@/utils/axiosInstanceBackend";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CheckOutpage() {
  const { products } = useSelector((state) => state.checkOut);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const total = products.reduce(
    (acc, product) => acc + product.salePrice * product.quantity,
    0
  );
  const deliveryCharge = total > 3000 || total == 0 ? 0 : 250;
  const grandTotal = total + deliveryCharge;
  const navigate = useNavigate();
  // states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [extraNote, setExtraNote] = useState("");

  const [loading, setLoading] = useState(false);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (products.length === 0) {
      toast.error("No product selected");
      return;
    }

    try {
      toast.loading("Placing order...");
      setLoading(true);
      const orderItems = products.map((product) => ({
        product: product._id,
        name: product.title,
        //  selected features but only feature and value

        selectedFeatures: product.selectedFeatures.map((feature) => ({
          feature: feature?.feature,
          value: feature?.value,
        })),

        quantity: product.quantity,
        price: product.salePrice,
        image: product.images[0]?.url,
      }));
      const response = await axiosBackend.post(
        "/api/v1/order",
        {
          orderItems,
          shippingInfo: {
            name,
            email,
            address,
            city,
            phoneNo,
          },
          itemsPrice: total,
          extraNote,
          shippingPrice: deliveryCharge,
          totalPrice: grandTotal,
        },
        { withCredentials: true }
      );

      toast.dismiss();
      toast.success(response.data.message);

      //  Clear the cart
      dispatch(cleareCheckout());
      dispatch(clearCart());

      //  Navigate to myoreders page
      navigate("/myorders");
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getCheckout());
    // Scroll up smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div>
      <div className="font-[sans-serif]  mt-16 md:mt-28 ">
        <div className="max-lg:max-w-xl mx-auto w-full">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 max-lg:order-1 md:p-6 p-4 md:!pr-0 max-w-4xl mx-auto w-full">
              <div className="text-center max-lg:hidden">
                <h2 className="text-3xl font-extrabold  inline-block border-b-2 border-gray-800 pb-1">
                  Checkout
                </h2>
              </div>

              <form onSubmit={handleOrderSubmit} className="lg:mt-16">
                <div>
                  <h2 className="text-xl font-bold ">Shipping info</h2>

                  <div className="grid sm:grid-cols-2 gap-8 mt-8  w-full ">
                    <div>
                      <Input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="p-2   w-full text-sm border-b focus:border-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <Input
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Email address"
                        className="p-2   w-full text-sm border-b focus:border-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <Input
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                        type="text"
                        placeholder="Home address"
                        className="p-2   w-full text-sm border-b focus:border-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        value={city}
                        required
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="p-2   w-full text-sm border-b focus:border-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={phoneNo}
                        required
                        onChange={(e) => setPhoneNo(e.target.value.toString())}
                        placeholder="Phone Number"
                        className="p-2   w-full text-sm border-b focus:border-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <textarea
                        value={extraNote}
                        onChange={(e) => setExtraNote(e.target.value)}
                        maxLength={500}
                        type="text"
                        placeholder="Extra Note"
                        className="p-2 dark:bg-slate-950  outline-gray-200 dark:outline-slate-700 outline-[0.1px]   w-full text-sm border-b focus:border-blue-600 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-16">
                  <h2 className="text-xl font-bold ">Payment method</h2>

                  <div className="grid gap-4 sm:grid-cols-2 mt-4">
                    <div className="flex items-center">
                      <Input
                        type="radio"
                        className="w-5 h-5 cursor-pointer"
                        id="cashondelivery"
                        checked
                      />
                      <label
                        htmlFor="cashondelivery"
                        className="ml-4 flex gap-2 cursor-pointer"
                      >
                        Cash On Delivery
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <button
                    disabled={loading}
                    type="submit"
                    className="min-w-[150px] xl:px-16 py-3.5 text-sm px-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Confirm Order <br />
                    Rs.{grandTotal}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-gray-100 dark:bg-slate-700 lg:h-screen lg:sticky lg:top-0">
              <div className="relative h-full">
                <div className="p-6 overflow-auto max-lg:max-h-[400px] lg:h-[calc(100vh-60px)] max-lg:mb-8">
                  <h2 className="text-xl font-bold ">Order Summary</h2>

                  <div className="space-y-8 mt-8 pb-16  capitalize ">
                    {products.length > 0 ? (
                      <>
                        {products.map((product) => (
                          <div
                            key={product._id}
                            className="flex flex-col gap-4"
                          >
                            <div className="flex gap-4 items-start justify-between">
                              <div
                                onClick={() => {
                                  navigate(
                                    `/product/${product.title.replace(
                                      /\s+/g,
                                      "-"
                                    )}`
                                  );
                                }}
                                className="max-w-[140px]  overflow-hidden shrink-0 bg-gray-200 rounded-lg"
                              >
                                <img
                                  src={product.images[0]?.url}
                                  alt={product.title}
                                  className="w-full object-cover"
                                />
                              </div>
                              {/*  cremove button */}
                              <button
                                onClick={() => {
                                  dispatch(
                                    deleteProductFromCheckout(product._id)
                                  );
                                }}
                                className="  hover:text-red-600 "
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-5 h-5"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="w-full">
                              <h3 className="text-base  font-bold">
                                {product.title}
                              </h3>
                              <ul className="text-sm divide-y-2 divide-slate-300 space-y-3   mt-2">
                                <ul className="capitalize">
                                  {product.selectedFeatures?.map(
                                    (feature, idx) => (
                                      <li
                                        key={idx}
                                        className="flex flex-wrap gap-4"
                                      >
                                        {feature?.feature}{" "}
                                        <span className="ml-auto">
                                          {feature?.value}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                                <li className="flex flex-wrap gap-4">
                                  Quantity{" "}
                                  <span className="ml-auto">
                                    {product.quantity}
                                  </span>
                                </li>
                                <li className="flex flex-wrap gap-4">
                                  Unit Price{" "}
                                  <span className="ml-auto">
                                    {product.salePrice}
                                  </span>
                                </li>
                              </ul>
                              {/* Price */}
                              <h4 className="flex flex-wrap gap-4 text-base  font-bold mt-4">
                                Total Price{" "}
                                <span className="ml-auto">
                                  Rs.{product.salePrice * product.quantity}
                                </span>
                              </h4>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center ">
                        <h3>No products in cart</h3>
                        <Link to="/" className="text-blue-600 hover:underline">
                          Continue shopping
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:absolute lg:left-0 space-y-3 lg:bottom-0 bg-gray-200 dark:bg-slate-800 w-full p-4">
                  {/* Delivery charges */}
                  <h4 className="flex flex-wrap gap-4 text-base  font-bold">
                    Delivery Charges{" "}
                    <span className="ml-auto">Rs. {deliveryCharge}</span>
                  </h4>
                  {/*  Grand total */}
                  <h4 className="flex flex-wrap gap-4 text-base  font-bold">
                    Total <span className="ml-auto">Rs. {grandTotal}</span>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOutpage;
