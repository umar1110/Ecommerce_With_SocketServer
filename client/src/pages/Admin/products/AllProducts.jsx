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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProducts } from "@/redux/slices/productsSlice";
import axiosBackend from "@/utils/axiosInstanceBackend";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
function AllProducts() {
  const { products, success, loading, titleSearch } = useSelector(
    (state) => state.products
  );
  const limit = 15;
  const dispatch = useDispatch();
  const [pageStart, setPageStart] = useState(1);

  const [currentPage, setcurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState("");
  const totalPages = !loading & success ? products?.pagination?.totalPages : 1;
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

  // change feature status of a product
  const handleFeatureChange = async (id) => {
    try {
      toast.loading("Changing feature status...");
      const res = await axiosBackend.post(
        `/api/v1/product/changefeaturestatus`,
        {
          id,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.dismiss();
        toast.success(res.data.message);
        dispatch(
          fetchProducts({ title: titleSearch, page: currentPage, limit })
        );
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleProductDelete = async (id) => {
    try {
      toast.loading("Deleting product...");
      const res = await axiosBackend.delete(`/api/v1/product/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.dismiss();
        toast.success(res.data.message);
        dispatch(
          fetchProducts({ title: titleSearch, page: currentPage, limit })
        );
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || error.message);
    }
  };
  useEffect(() => {
    document.title = "All Products";
    window.scrollTo({ top: 0, behavior: "smooth" });

    dispatch(fetchProducts({ title: titleSearch, page: currentPage, limit }));
  }, [dispatch, currentPage, titleSearch]);

  return (
    <div className="flex flex-wrap -mx-3 mb-5">
      <AlertDialog
        open={dialogOpen}
        onOpenChange={(open) => setDialogOpen(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleProductDelete(productIdToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="w-full max-w-full px-3 mb-6 mx-auto">
        <div className="relative flex-[1_auto] flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white dark:bg-gray-800 m-5">
          <div className="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 dark:border-stone-700 bg-light/30 dark:bg-gray-700/30">
            {/* Card header */}
            <div className="px-9 pt-5 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
              <h3 className="flex flex-col items-start justify-center m-2 ml-0 font-medium text-xl/tight text-dark dark:text-white">
                <span className="mr-3 font-semibold text-dark dark:text-white">
                  All Products ({products?.pagination?.totalProducts})
                </span>
                <span className="mt-1 font-medium text-secondary-dark dark:text-secondary-light text-lg/normal"></span>
              </h3>
            </div>
            {/* Card Body */}
            <div className="flex-auto block py-8 pt-6 px-9">
              <div className="overflow-x-auto">
                <table className="w-full my-0 align-middle text-dark dark:text-white border-neutral-200 dark:border-neutral-600">
                  <thead className="align-bottom">
                    <tr className="font-semibold text-[0.95rem] text-secondary-dark dark:text-secondary-light">
                      <th className="pb-3 text-start min-w-[175px]">Product</th>
                      <th className="pb-3 text-end min-w-[100px]">
                        Cost Price
                      </th>
                      <th className="pb-3 pr-12 text-end min-w-[100px]">
                        Sale Price
                      </th>
                      <th className="pb-3 text-end min-w-[100px]">Sold</th>
                      <th className="pb-3 text-end min-w-[100px]">Stock</th>
                      <th className="pb-3 text-end min-w-[100px]">Featured</th>
                      <th className="pb-3 text-end min-w-[180px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading ? (
                      <>
                        {success && products.products.length > 0 ? (
                          <>
                            {products.products.map((product) => (
                              <tr
                                key={product._id}
                                className="border-b border-dashed last:border-b-0 dark:border-stone-700"
                              >
                                <td className="p-3 pl-0">
                                  <div className="flex items-center">
                                    <div className="relative inline-block shrink-0 rounded-2xl me-3">
                                      <img
                                        src={product.images[0]?.url}
                                        className="w-[60px] h-[50px] inline-block shrink-0 rounded-md"
                                        alt={product.title}
                                      />
                                    </div>
                                    <div className="flex flex-col justify-start">
                                      <a className="mb-1 font-semibold transition-colors duration-200 ease-in-out text-lg/normal text-secondary-inverse hover:text-primary dark:text-secondary-light dark:hover:text-primary">
                                        {product.title}
                                      </a>
                                    </div>
                                  </div>
                                </td>

                                <td className="p-3 pr-0 text-end">
                                  <span className="text-center align-baseline inline-flex px-2 py-1 mr-auto items-center font-semibold text-base/none text-success bg-success-light rounded-lg">
                                    Rs. {product.costPrice}
                                  </span>
                                </td>
                                <td className="p-3 pr-0 text-end">
                                  <span className="text-center align-baseline inline-flex px-4 py-3 mr-auto items-center font-semibold text-[.95rem] leading-none text-primary bg-primary-light rounded-lg">
                                    {" "}
                                    Rs. {product.salePrice}
                                  </span>
                                </td>
                                <td className="pr-0 text-end">
                                  <span className="font-semibold text-light-inverse text-md/normal dark:text-white">
                                    {product.soldCount}{" "}
                                  </span>
                                </td>
                                <td className="pr-0 text-end">
                                  <span
                                    className={`font-semibold text-light-inverse text-md/normal dark:text-white ${
                                      product.stock < 5
                                        ? "text-red-700"
                                        : "text-green-700"
                                    } `}
                                  >
                                    {product.stock}
                                  </span>
                                </td>
                                <td className="pr-0 text-end">
                                  <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-primary dark:text-primary"
                                    checked={product.isFeatured}
                                    onChange={() =>
                                      handleFeatureChange(product._id)
                                    }
                                  />
                                </td>
                                <td className="p-3 pr-0 text-end flex justify-end space-x-4">
                                  <button
                                    onClick={() => {
                                      setDialogOpen(true);
                                      setProductIdToDelete(product._id);
                                    }}
                                  >
                                    <Trash2 />
                                  </button>
                                  <Link
                                    to={`/admin/dashboard/products/edit/${product._id}`}
                                  >
                                    <Edit />
                                  </Link>
                                  <Link
                                    to={`/product/${product.title.replace(
                                      /\s+/g,
                                      "-"
                                    )}`}
                                    className="relative text-secondary-dark bg-light-dark hover:text-primary dark:bg-dark-dark dark:text-white flex items-center h-[25px] w-[25px] text-base font-medium leading-normal text-center align-middle cursor-pointer rounded-2xl transition-colors duration-200 ease-in-out shadow-none border-0 justify-center"
                                  >
                                    <span className="flex items-center justify-center p-0 m-0 leading-none shrink-0 ">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                        />
                                      </svg>
                                    </span>
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <tr className="text-center text-xl dark:text-white">
                            <td colSpan="8">No products found</td>
                          </tr>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Skeleton of products with same width etc as table */}
                        {Array.from({ length: 15 }).map((_, i) => (
                          <tr
                            key={i}
                            className="border-b border-dashed last:border-b-0 dark:border-stone-700"
                          >
                            <td>
                              <Skeleton className="w-full h-[50px] inline-block shrink-0 rounded-2xl" />
                            </td>
                            <td>
                              <Skeleton className="w-full h-[50px] inline-block shrink-0 rounded-2xl" />
                            </td>
                            <td>
                              <Skeleton className="w-full h-[50px] inline-block shrink-0 rounded-2xl" />
                            </td>
                            <td>
                              <Skeleton className="w-full h-[50px] inline-block shrink-0 rounded-2xl" />
                            </td>
                            <td>
                              <Skeleton className="w-full h-[50px] inline-block shrink-0 rounded-2xl" />
                            </td>
                            <td>
                              <Skeleton className="w-full h-[50px] inline-block shrink-0 rounded-2xl" />
                            </td>
                            <td className="flex justify-end space-x-4">
                              <Skeleton className="w-[50px] h-[50px] inline-block shrink-0 rounded-xl" />
                              <Skeleton className="w-[50px] h-[50px] inline-block shrink-0 rounded-xl" />
                              <Skeleton className="w-[50px] h-[50px] inline-block shrink-0 rounded-xl" />
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>

                {!loading &&
                  success &&
                  products.pagination.totalProducts > limit && (
                    <>
                      {/* Pagination */}
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
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllProducts;
