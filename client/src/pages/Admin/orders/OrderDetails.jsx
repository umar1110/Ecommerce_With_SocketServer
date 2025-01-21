import axiosBackend from "@/utils/axiosInstanceBackend";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
function OrderDetails() {
  //  Get id from param
  const { id } = useParams();
  const orderStatus = {
    PROCESSING: 0,
    SHIPPED: 1,
    DELIVERED: 2,
    CANCELLED: 3,
    RETURNED: 4,
  };

  //  States
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState(null);

  //  Functions
  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axiosBackend.get(`/api/v1/order/${id}`, {
        withCredentials: true,
      });
      setOrder(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error.response?.data?.message);
      setLoading(false);
    }
  };

  //   Functions

  const handleStatusChange = async (status) => {
    try {
      toast.loading("Updating Order Status...");

      const { data } = await axiosBackend.put(
        `/api/v1/order/${order._id}/status`,
        {
          status,
        },
        { withCredentials: true }
      );
      toast.dismiss();
      toast.success(data.message);
      setOrder(data.data);
    } catch (error) {
      toast.dismiss();
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  return (
    <div className="w-full">
      {!loading ? (
        <>
          {order ? (
            <>
              <AlertDialog
                open={dialogOpen}
                onOpenChange={(open) => setDialogOpen(open)}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleStatusChange(action)}
                    >
                      Update
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <div className="w-full mx-auto  p-6 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold  border-b pb-4 mb-6">
                  Order Details
                </h2>

                {/* Shipping Information */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold  mb-4">
                    Shipping Information
                  </h3>
                  <div className="space-y-2">
                    <p className="">
                      <strong className="">Name:</strong>{" "}
                      {order.shippingInfo.name}
                    </p>
                    <p className="">
                      <strong className="">Address:</strong>{" "}
                      {order.shippingInfo.address}
                    </p>
                    <p className="">
                      <strong className="">City:</strong>{" "}
                      {order.shippingInfo.city}
                    </p>
                    <p className="">
                      <strong className="">Email:</strong>{" "}
                      {order.shippingInfo.email}
                    </p>
                    <p className="">
                      <strong className="">Phone No:</strong>{" "}
                      {order.shippingInfo.phoneNo}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold  mb-4">Order Items</h3>
                  <div className="flex-wrap flex  gap-6">
                    {order.orderItems.map((item) => (
                      <Link
                        to={`/product/${item.name.replace(/\s/g, "-")}`}
                        key={item._id}
                        className="block border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <p className=" font-semibold mb-2">
                            <strong>Product Name:</strong> {item.name}
                          </p>
                          <p className="">
                            <strong>Quantity:</strong> {item.quantity}
                          </p>
                          {item.selectedFeatures.length > 0 && (
                            <div className="mt-2">
                              <h4 className="text-sm font-semibold ">
                                Selected Features:
                              </h4>
                              <ul className="pl-4 list-disc ">
                                {item.selectedFeatures.map((feature) => (
                                  <li key={feature._id}>
                                    <strong>{feature.feature}:</strong>{" "}
                                    {feature.value}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <p className=" mt-2">
                            <strong>Price:</strong> Rs.{item.price}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="text-xl font-semibold  mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <p className="">
                      <strong className="">Items Price:</strong> Rs.
                      {order.itemsPrice}
                    </p>
                    <p className="">
                      <strong className="">Shipping Price:</strong> Rs.
                      {order.shippingPrice}
                    </p>
                    <p className="">
                      <strong className="">Total Price:</strong> Rs.
                      {order.totalPrice}
                    </p>
                  </div>
                </div>
                {/* Extra Note */}
                {order.extraNote && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold  mb-4">Extra Note</h3>
                    <p className="">{order.extraNote}</p>
                  </div>
                )}

                {/* Current Status */}

                <div className="mt-8">
                  <h3 className="text-xl font-semibold  mb-4">
                    Current Status
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className=" font-semibold">Status:</span>
                    <span className="text-lg font-semibold text-blue-500">
                      {order.orderStatus === orderStatus.PROCESSING &&
                        "Processing"}
                      {order.orderStatus === orderStatus.SHIPPED && "Shipped"}
                      {order.orderStatus === orderStatus.DELIVERED &&
                        "Delivered"}
                      {order.orderStatus === orderStatus.CANCELLED &&
                        "Cancelled"}
                      {order.orderStatus === orderStatus.RETURNED && "Returned"}
                    </span>
                  </div>
                  {/* {order.orderStatus === orderStatus.SHIPPED && (
                    <div className="flex items-center gap-4 mt-2">
                      <span className=" font-semibold">
                        Shipped At:
                      </span>
                      <span className="text-lg font-semibold text-blue-500">
                        {new Date(order.shippedAt).toLocaleString()}
                      </span>
                    </div>
                  )} */}
                  {order.orderStatus === orderStatus.DELIVERED && (
                    <div className="flex items-center gap-4 mt-2">
                      <span className=" font-semibold">Delivered At:</span>
                      <span className="text-lg font-semibold text-blue-500">
                        {new Date(order.deliveredAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                {/*  Actions */}
                {/*  Change status buttons Statuses are mentioned up */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold  mb-4">Actions</h3>
                  <div className="flex flex-wrap gap-4">
                    {order.orderStatus === orderStatus.PROCESSING && (
                      <button
                        onClick={() => {
                          setAction(orderStatus.SHIPPED);
                          setDialogOpen(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200"
                      >
                        Mark as Shipped
                      </button>
                    )}
                    {order.orderStatus === orderStatus.SHIPPED && (
                      <button
                        onClick={() => {
                          setAction(orderStatus.DELIVERED);
                          setDialogOpen(true);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    {order.orderStatus !== orderStatus.CANCELLED && (
                      <button
                        onClick={() => {
                          setAction(orderStatus.CANCELLED);
                          setDialogOpen(true);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200"
                      >
                        Cancel Order
                      </button>
                    )}
                    {/* order return button */}
                    {(order.orderStatus === orderStatus.DELIVERED ||
                      order.orderStatus == orderStatus.SHIPPED) && (
                      <button
                        onClick={() => {
                          setAction(orderStatus.RETURNED);
                          setDialogOpen(true);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-200"
                      >
                        Return Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <h1>Order not found</h1>
          )}
        </>
      ) : (
        <>Loading....</>
      )}
    </div>
  );
}

export default OrderDetails;
