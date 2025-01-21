import axiosBackend from "@/utils/axiosInstanceBackend";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { Eye, Trash, View } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
function AdminOrders() {
  const [orders, setorders] = useState([]);
  const [loading, setloading] = useState(true);
  const [pagination, setpagination] = useState({});
  const [searchOrderId, setsearchOrderId] = useState("");
  // Ref to input
  const searchInput = useRef(null);
  const navigate = useNavigate();
  const orderStatus = {
    ALL: "all",
    PROCESSING: 0,
    SHIPPED: 1,
    DELIVERED: 2,
    CANCELLED: 3,
    RETURNED: 4,
  };

  const limit = 15;
  const totalPages = !loading & (orders.length > 0) ? pagination?.pages : 5;

  const [pageStart, setPageStart] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState("");
  const [currentPage, setcurrentPage] = useState(1);
  const [selectedStatus, setselectedStatus] = useState("all");
  //  Functions
  const handleNext = () => {
    if (pageStart + 10 > totalPages) return;
    setPageStart(pageStart + 10);
  };
  const handlePrev = () => {
    if (pageStart - 10 < 0) return;
    setPageStart(pageStart - 10);
  };
  const handlePageChange = (page) => {
    setcurrentPage(page);
    if (page > totalPages - 9) return;
    // setPageStart(page);
  };

  const getOrders = async () => {
    try {
      setloading(true);
      const { data } = await axiosBackend.get(
        `/api/v1/order?page=${currentPage}&limit=${limit}&status=${selectedStatus}&searchOrderId=${searchOrderId}`,
        {
          withCredentials: true,
        }
      );

      setorders(data.data.orders);
      setpagination(data.data.pagination);
      setloading(false);
    } catch (error) {
      setsearchOrderId("");
      console.log(error);
      toast.error(error.response?.data?.message);
      setloading(false);
    }
  };

  const handleDelete = async (id) => {
    if (id == "") return;
    try {
      setloading(true);
      toast.loading("Deleting Order");

      await axiosBackend.delete(`/api/v1/order/${id}`, {
        withCredentials: true,
      });
      toast.dismiss();
      toast.success("Order Deleted Successfully");
      getOrders();
      setloading(false);
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error(error.response?.data?.message);
      setloading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, [currentPage, selectedStatus, searchOrderId]);

  return (
    <div className="w-full">
      <AlertDialog
        open={dialogOpen}
        onOpenChange={(open) => setDialogOpen(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete Order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(orderIdToDelete)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-between items-center py-3 bg-slate-200 px-4 w-full">
        <div className="flex justify-between w-full">
          <div className="flex space-x-6">
            <button
              className={`btn p-2 px-5 rounded-lg  ${
                selectedStatus === "all"
                  ? "bg-red-500 text-white "
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => setselectedStatus("all")}
            >
              All
            </button>
            <button
              className={`btn p-2 rounded-lg ${
                selectedStatus === orderStatus.PROCESSING
                  ? "bg-red-500 text-white "
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => setselectedStatus(orderStatus.PROCESSING)}
            >
              Processing
            </button>
            <button
              className={`btn p-2 rounded-lg ${
                selectedStatus === orderStatus.SHIPPED
                  ? "bg-red-500 text-white "
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => setselectedStatus(orderStatus.SHIPPED)}
            >
              Shipped
            </button>
            <button
              className={`btn p-2 rounded-lg ${
                selectedStatus === orderStatus.DELIVERED
                  ? "bg-red-500 text-white "
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => setselectedStatus(orderStatus.DELIVERED)}
            >
              Delivered
            </button>
            <button
              className={`btn p-2 rounded-lg ${
                selectedStatus === orderStatus.RETURNED
                  ? "bg-red-500 text-white "
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => setselectedStatus(orderStatus.RETURNED)}
            >
              Returned
            </button>
            <button
              className={`btn p-2 rounded-lg ${
                selectedStatus === orderStatus.CANCELLED
                  ? "bg-red-500 text-white "
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => setselectedStatus(orderStatus.CANCELLED)}
            >
              Cancelled
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              setsearchOrderId(searchInput.current.value);
            }}
          >
            <input
              ref={searchInput}
              // value={searchOrderId}
              // onChange={(e) => setsearchOrderId(e.target.value)}
              type="text"
              placeholder="Enter Order id "
              className="p-3 rounded-lg"
            />
            <Button type="submit" className="btn p-3 rounded-lg">
              Search
            </Button>
          </form>
        </div>
      </div>
      {/*  Orders table */}
      {!loading ? (
        <>
          <div className="flex-auto block py-8 pt-6 px-9">
            <div className="overflow-x-auto">
              {orders.length > 0 ? (
                <>
                  <table className="w-full my-0 align-middle text-dark dark:text-white border-neutral-200 dark:border-neutral-600">
                    <thead className="align-bottom">
                      <tr className="font-semibold text-[0.95rem] text-secondary-dark dark:text-secondary-light">
                        <th className="pb-3 text-start min-w-[100px]">
                          Order Id
                        </th>
                        <th className="pb-3 text-start min-w-[175px]">
                          Products
                        </th>
                        <th className="pb-3 text-end min-w-[100px]">
                          Total Order Price
                        </th>
                        <th className="pb-3 text-end min-w-[100px]">
                          Ordered At
                        </th>
                        <th className="pb-3 pr-12 text-end min-w-[100px]">
                          Order Status
                        </th>
                        <th className="pb-3 text-end min-w-[180px]">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-b border-neutral-200 dark:border-neutral-600"
                        >
                          <td className="text-start">
                            <p className="font-semibold">{order._id}</p>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center  space-x-4">
                              {/* For single Item Order */}
                              {order.orderItems.length === 1 && (
                                <div className="w-12 h-12 flex-shrink-0">
                                  <img
                                    src={order.orderItems[0].image}
                                    alt={order.orderItems[0].name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              {/* If multiple items order  */}
                              <div className="w-40 max-w-[50%] gap-2 flex-wrap  flex-shrink-0 flex  ">
                                {order.orderItems.length > 1 &&
                                  order.orderItems.map((item, index) => (
                                    <img
                                      key={index}
                                      src={item.image}
                                      alt={item.name}
                                      className="w-10 h-10  object-cover"
                                    />
                                  ))}
                              </div>

                              <div>
                                {order.orderItems.length === 1 ? (
                                  <>
                                    <p className="font-semibold text-sm">
                                      {order.orderItems[0].name}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                      {order.orderItems[0].quantity} x{" "}
                                      {order.orderItems[0].price}
                                    </p>
                                  </>
                                ) : (
                                  order.orderItems.map((item, index) => (
                                    <div key={index}>
                                      <p className="font-semibold text-sm">
                                        {item.name}
                                      </p>
                                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {item.quantity} x {item.price}
                                      </p>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="text-end">
                            <p className="font-semibold">{order.totalPrice}</p>
                          </td>
                          <td className="text-end">
                            <p className="font-semibold">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </td>

                          <td className="text-end">
                            <p className="font-semibold">
                              {
                                // String of order status
                                Object.keys(orderStatus).find(
                                  (key) =>
                                    orderStatus[key] === order.orderStatus
                                )
                              }
                            </p>
                          </td>
                          <td className="text-end space-x-4">
                            <button
                              onClick={() => {
                                navigate(`/admin/dashboard/order/${order._id}`);
                              }}
                              className="btn"
                            >
                              <Eye />
                            </button>

                            <button
                              onClick={() => {
                                setOrderIdToDelete(order._id);
                                setDialogOpen(true);
                              }}
                              className="btn"
                            >
                              <Trash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          className={`${
                            pageStart === 1
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePrev();
                          }}
                        />
                      </PaginationItem>

                      {/* Pagination Links */}
                      {Array.from(
                        { length: totalPages - pageStart + 1 },
                        (_, index) => {
                          const page = index + pageStart;
                          if (page > pageStart + 10) return;
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                // isActive={page === currentPageState}
                                isActive={page === currentPage}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(page);
                                }}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      )}

                      {/* Ellipsis if needed */}
                      {pageStart + 10 < totalPages && (
                        <PaginationItem
                          onClick={(e) => {
                            e.preventDefault();
                            setPageStart(pageStart + 10);
                          }}
                        >
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          className={`${
                            pageStart + 11 > totalPages
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }  `}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNext();
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </>
              ) : (
                <div className="text-center text-2xl font-semibold">
                  No Orders Found
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>Loading.....</>
      )}
    </div>
  );
}

export default AdminOrders;
