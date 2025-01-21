import { Skeleton } from "@/components/ui/skeleton";
import axiosBackend from "@/utils/axiosInstanceBackend";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function MyOrderDetails() {
  //  Get id from param
  const { id } = useParams();
  const OrderStatuses = {
    PROCESSING: 0,
    SHIPPED: 1,
    DELIVERED: 2,
    CANCELLED: 3,
    RETURNED: 4,
  };
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    // Fetch order details
    try {
      setLoading(true);
      const { data } = await axiosBackend.get(`/api/v1/order/${id}`, {
        withCredentials: true,
      });
      setOrder(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Something went wrong");
      navigate("/myorders");
    }
  };

  useEffect(() => {
    if (!id || id === "" || id === "undefined") {
      navigate("/myorders");
    }
    fetchOrderDetails();
    window.scrollTo({
      top: 0,
    });
  }, [id]);
  return (
    <div className="mt-16 md:mt-28">
      {!loading ? (
        <>
          {order && (
            <section className="py-24 relative">
              <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
                <h2 className="font-manrope font-bold text-4xl leading-10 text-center">
                  Payment Cash On Delivery
                </h2>
                <p className="mt-4 font-normal text-lg leading-8 text-gray-500 mb-11 text-center">
                  Thanks for making a purchase you can check our order summary
                  from below
                </p>
                <div className="main-box border border-gray-200 rounded-xl pt-6 max-w-xl max-lg:mx-auto lg:max-w-full">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200">
                    <div className="data">
                      <p className="font-semibold text-base leading-7">
                        Order Id:{" "}
                        <span className="text-indigo-600 font-medium">
                          {order._id}
                        </span>
                      </p>
                      {/* Status */}
                      <p className="font-semibold text-base leading-7 mt-4">
                        Order Status:{" "}
                        <span className="text-gray-400 font-medium">
                          {order.orderStatus === OrderStatuses.PROCESSING
                            ? "Processing"
                            : order.orderStatus === OrderStatuses.SHIPPED
                            ? "Shipped"
                            : order.orderStatus === OrderStatuses.DELIVERED
                            ? "Delivered"
                            : order.orderStatus === OrderStatuses.CANCELLED
                            ? "Cancelled"
                            : order.orderStatus === OrderStatuses.RETURNED
                            ? "Returned"
                            : ""}
                        </span>
                      </p>
                      <p className="font-semibold text-base leading-7 mt-4">
                        Order Submitted :{" "}
                        <span className="text-gray-400 font-medium">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="w-full px-3 min-[400px]:px-6">
                    {order.orderItems.map((item) => (
                      <div
                        className="flex flex-col lg:flex-row items-center justify-between border-b border-gray-200 py-6"
                        key={item._id}
                      >
                        <div className="flex items-center">
                          <img
                            src={item.image}
                            alt=""
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="ml-4">
                            <p className="font-semibold text-lg leading-6">
                              {item.name}
                            </p>
                            <p className="font-normal text-base leading-6 text-gray-500">
                              {item.quantity} x ${item.price}
                            </p>
                            <p className="font-normal capitalize text-base leading-6 text-gray-500">
                              <br />
                              {item.selectedFeatures.map((feature) => (
                                <span key={feature.feature}>
                                  {feature.feature}: {feature.value}
                                  <br />
                                </span>
                              ))}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-lg leading-6">
                          ${item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="w-full border-t border-gray-200 px-6 flex flex-col lg:flex-row items-center justify-between">
                    <div className="flex flex-col sm:flex-row items-center max-lg:border-b border-gray-200">
                      <p className="font-medium text-lg pl-6 py-3 max-lg:text-center">
                        Cash On delivery
                      </p>
                    </div>
                    <p className="font-semibold text-lg py-6">
                      Total Price:{" "}
                      <span className="text-indigo-600">
                        ${order.totalPrice}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <>
          <div className="w-full max-w-7xl px-4 md:px-5 space-y-3 mt-16 lg-6 mx-auto">
            <Skeleton className=" w-[40%] md:h-16 h-10  mx-auto " />
            <Skeleton className=" w-[70%] md:h-12 h-8 mx-auto " />

            <Skeleton className={"h-6 w-full"} />
            <div className="flex space-x-2">
              <Skeleton className=" w-full md:w-1/2 h-60 " />
              <Skeleton className=" w-full hidden md:flex md:w-1/2 h-60 " />
            </div>

            <Skeleton className={"h-6 w-full"} />
          </div>
        </>
      )}
    </div>
  );
}

export default MyOrderDetails;
