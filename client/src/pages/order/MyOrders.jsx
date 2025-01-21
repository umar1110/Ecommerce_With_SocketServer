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
import { Skeleton } from "@/components/ui/skeleton";
import axiosBackend from "@/utils/axiosInstanceBackend";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState("");

  const orderStatuses = {
    PROCESSING: 0,
    SHIPPED: 1,
    DELIVERED: 2,
    CANCELLED: 3,
    RETURNED: 4,
  };
  const { isAuthenticated, loading: userLoading } = useSelector(
    (state) => state.auth
  );
  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axiosBackend.get("/api/v1/order/orders/myorders", {
        withCredentials: true,
      });

      setOrders(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch orders:", error.response.data.message);
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      toast.loading("Updating Order Status...");

      const { data } = await axiosBackend.put(
        `/api/v1/order/${orderIdToDelete}/status`,
        {
          status: orderStatuses.CANCELLED,
        },
        { withCredentials: true }
      );
      fetchMyOrders();
      toast.dismiss();

      toast.success("Order has been cancelled successfully");
    } catch (error) {
      toast.dismiss();
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchMyOrders();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [isAuthenticated]);

  return (
    <div className="mt-16 md:mt-28 w-full b">
      {!loading ? (
        <>
          {orders.length > 0 ? (
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
                      This action cannot be undone. This will permanently Cancel
                      Order.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleStatusChange()}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                <div className="mx-auto max-w-full  2xl:px-0">
                  <div className="mx-auto w-full  lg:w-[85%] xl:w-[80%] ">
                    <div className="gap-4 sm:flex sm:items-center sm:justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl text-center">
                        My orders
                      </h2>
                    </div>

                    <div className="mt-6 px-3 flow-root sm:mt-8  w-full">
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {orders.map((order) => (
                          <div key={order._id} className="py-6">
                            <div className="flex   flex-wrap items-center gap-y-4">
                              <dl className="w-1/2 min-w-fit sm:w-1/4 lg:w-auto lg:flex-1">
                                <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                                  Order ID:
                                </dt>
                                <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                  <a href="#" className="hover:underline">
                                    {order._id}
                                  </a>
                                </dd>
                              </dl>

                              <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                                  Date:
                                </dt>
                                <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                  {order.createdAt.split("T")[0]}
                                </dd>
                              </dl>

                              <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                                  Price:
                                </dt>
                                <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                                  Rs{order.totalPrice}
                                </dd>
                              </dl>

                              <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                                <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                                  Status:
                                </dt>
                                <dd
                                  className={`me-2 mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${
                                    order.orderStatus === 0
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                      : order.orderStatus === 1
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                      : order.orderStatus === 2
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : order.orderStatus === 3
                                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                  }`}
                                >
                                  {order.orderStatus === 0 && (
                                    <svg
                                      className="me-1 h-3 w-3"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z"
                                      />
                                    </svg>
                                  )}
                                  {order.orderStatus === 1 && (
                                    <svg
                                      className="me-1 h-3 w-3"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                                      />
                                    </svg>
                                  )}
                                  {order.orderStatus === 2 && (
                                    <svg
                                      className="me-1 h-3 w-3"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 11.917 9.724 16.5 19 7.5"
                                      />
                                    </svg>
                                  )}
                                  {order.orderStatus === 3 && (
                                    <svg
                                      className="me-1 h-3 w-3"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M6 18 17.94 6M18 18 6.06 6"
                                      />
                                    </svg>
                                  )}
                                  {order.orderStatus === 4 && (
                                    <svg
                                      className="me-1 h-3 w-3"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-1 4h2m-2 2h2"
                                      />
                                    </svg>
                                  )}

                                  {/* Converted Stated */}
                                  {
                                    Object.keys(orderStatuses)[
                                      order.orderStatus
                                    ]
                                  }
                                </dd>
                              </dl>

                              <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                                {/* Cancel but before shipped */}
                                {order.orderStatus === 0 && (
                                  <button
                                    onClick={() => {
                                      setOrderIdToDelete(order._id);
                                      setDialogOpen(true);
                                    }}
                                    type="button"
                                    className="w-full rounded-lg border border-red-700 px-3 py-2 text-center text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900 lg:w-auto"
                                  >
                                    Cancel order
                                  </button>
                                )}
                                <Link
                                  to={`/myorder/${order._id}`}
                                  className="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
                                >
                                  View details
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pagination */}
                  </div>
                </div>
              </section>
            </>
          ) : (
            <div className="text-center text-2xl h-screen items-center flex justify-center">
              No orders found
            </div>
          )}
        </>
      ) : (
        <>
          {/* Loading of list of orders  */}
          <div className="grid gap-2 md:w-[90%] xl:w-[80%] mx-auto mt-6 ">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton className="w-full h-16" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default MyOrders;
