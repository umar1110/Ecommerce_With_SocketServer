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
import axiosBackend from "@/utils/axiosInstanceBackend";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "./productCard";
function SearchedProducts() {
  // Get keyword from query
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const navigate = useNavigate();
  // States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pagination, setpagination] = useState({
    totalProducts: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 0,
  });
  const [pageStart, setPageStart] = useState(1);
  const [currentPage, setcurrentPage] = useState(1);

  //   Constants
  const limit = 20;
  const totalPages = !loading & success ? pagination?.totalPages : 1;

  //   Functions
  const fetchProducts = async () => {
    try {
      // Fetch products
      setLoading(true);
      const response = await axiosBackend.get(
        `/api/v1/product?limit=${limit}&page=${currentPage}&title=${keyword?.trim()}`
      );
      setProducts(response.data.data.products);
      setpagination(response.data.data.pagination);
      console.log(response.data.data);
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      setLoading(false);
      setSuccess(false);
      console.log(error.response?.data?.message || error.message);
    }
  };

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

  useEffect(() => {
    if (keyword === undefined || keyword === null) {
      navigate("/");
    }
    fetchProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [keyword, currentPage]);

  return (
    <div className="mt-16 md:mt-40">
      {
        <>
          <h1 className="text-2xl font-semibold  my-4 text-center">
            Searched Products
          </h1>
          <div className="text-center mb-4">
            Total products ({pagination.totalProducts})
          </div>
        </>
      }

      {!loading ? (
        <>
          {products.length > 0 ? (
            <div className="xl:w-[92%] md:w-[95%] mx-auto ">
              <div className="cards flex flex-wrap justify-evenly xl:justify-center space-x-1 xl:space-x-3">
                {products.map((product, idx) => (
                  <ProductCard key={idx} product={product} />
                ))}
              </div>
              {!loading && success && pagination.totalProducts > limit && (
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
              )}
            </div>
          ) : (
            <div className="w-full h-96 flex justify-center items-center">
              <h2 className="text-xl font-semibold">No Products Found</h2>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-wrap justify-evenly xl:justify-center space-x-2 xl:space-x-3">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col w-[10.5rem] xl:w-48 my-2 pb-3"
              >
                <Skeleton type="card" className="h-[200px]" />
                {/* For title */}
                <Skeleton type="text" className="h-5 w-3/4 mt-2" />
                {/* For price */}
                <Skeleton type="text" className="h-4 w-1/2 mt-2" />

                {/* For buttons */}
                <div className="flex justify-between flex-col md:flex-row">
                  <Skeleton
                    type="button"
                    className="mt-2 w-full md:w-[48%] h-8"
                  />
                  <Skeleton
                    type="button"
                    className="w-full md:w-[48%] mt-2 h-8"
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchedProducts;
