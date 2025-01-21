import { Skeleton } from "@/components/ui/skeleton";
import FeaturedProducts from "@/pages/home/FeaturedProducts";
import LandingPage from "@/pages/home/LandingPage";
import axiosBackend from "@/utils/axiosInstanceBackend";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";

function HomePage() {
  //  Featured Products
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [fetchProductsLoading, setFetchProductsLoading] = useState(true);
  const getFeaturedProducts = async () => {
    try {
      setFetchProductsLoading(true);
      const { data } = await axiosBackend.get(
        "/api/v1/product/products/featured"
      );
      setFetchProductsLoading(false);
      setFeaturedProducts(data.data.products);
    } catch (error) {
      setFetchProductsLoading(false);
      console.log(error);
    }
  };

  // CAtegory Products
  const { mainCategories, mainCategoriesLoading } = useSelector(
    (state) => state.categories
  );
  const [featuredMainCategories, setFeaturedMainCategories] = useState([]);
  const [productsFeaturedCategories, setproductsFeaturedCategories] = useState(
    []
  );
  // Of size feature products
  const [
    productsFeaturedCategoriesLoading,
    setProductsFeaturedCategoriesLoading,
  ] = useState([]);
  const [fetchMainCategoriesLoading, setFetchMainCategoriesLoading] =
    useState(true);

  // Functions
  const getMainCategories = async (name, index) => {
    try {
      const { data } = await axiosBackend.get(
        `/api/v1/product?mainCategory=${name}&limit=${10}`
      );

      setproductsFeaturedCategories((prev) => [
        ...prev,
        { name: name, products: data.data.products },
      ]);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    } finally {
      setProductsFeaturedCategoriesLoading((prev) => {
        prev[index] = false;
        return [...prev];
      });
    }
  };

  // Reviews
  const limit = 10;
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsPagination, setReviewsPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });
  const [totalReviewsDetails, setTotalReviewsDetails] = useState({
    totalReviews: 0,
    fiveStarReviews: 0,
    fourStarReviews: 0,
    threeStarReviews: 1,
    twoStarReviews: 0,
    oneStarReviews: 0,
  });

  //  percentage of reviews
  const [reviewsPercentage, setReviewsPercentage] = useState({
    fiveStarReviews: 0,
    fourStarReviews: 0,
    threeStarReviews: 0,
    twoStarReviews: 0,
    oneStarReviews: 0,
    overallRating: 0,
  });

  const [reviewsDetailsLoading, setReviewsDetailsLoading] = useState(true);

  const getReviewDetails = async () => {
    try {
      setReviewsDetailsLoading(true);
      const { data } = await axiosBackend.get("/api/v1/review/reviews/details");
      setTotalReviewsDetails(data.data);
      setReviewsDetailsLoading(false);
    } catch (error) {
      setReviewsDetailsLoading(false);
      console.log(error.message);
    }
  };

  const getReviews = async () => {
    try {
      setReviewsLoading(true);
      const { data } = await axiosBackend.get(
        `/api/v1/review?limit=${limit}&page=${currentReviewPage}`
      );
      // Add in review list as clicking on load more
      setReviews((prev) => [...prev, ...data.data.reviews]);
      setReviewsPagination(data.data.pagination);
      setReviewsLoading(false);
    } catch (error) {
      setReviewsLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (totalReviewsDetails.totalReviews > 0) {
      setReviewsPercentage({
        fiveStarReviews:
          (totalReviewsDetails.fiveStarReviews /
            totalReviewsDetails.totalReviews) *
          100,
        fourStarReviews:
          (totalReviewsDetails.fourStarReviews /
            totalReviewsDetails.totalReviews) *
          100,
        threeStarReviews:
          (totalReviewsDetails.threeStarReviews /
            totalReviewsDetails.totalReviews) *
          100,
        twoStarReviews:
          (totalReviewsDetails.twoStarReviews /
            totalReviewsDetails.totalReviews) *
          100,
        oneStarReviews:
          (totalReviewsDetails.oneStarReviews /
            totalReviewsDetails.totalReviews) *
          100,
        overallRating:
          (5 * totalReviewsDetails.fiveStarReviews +
            4 * totalReviewsDetails.fourStarReviews +
            3 * totalReviewsDetails.threeStarReviews +
            2 * totalReviewsDetails.twoStarReviews +
            1 * totalReviewsDetails.oneStarReviews) /
            totalReviewsDetails.totalReviews || 0,
      });
    }
  }, [totalReviewsDetails]);

  useEffect(() => {
    if (reviewsPagination && currentReviewPage > reviewsPagination?.pages) {
      // Stop fetching if current page exceeds total pages
      return;
    }
    getReviews();
  }, [currentReviewPage]);

  useEffect(() => {
    getFeaturedProducts();
    getReviewDetails();
    // Go up smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (
      mainCategories.length > 0 &&
      !mainCategoriesLoading &&
      featuredMainCategories.length === 0
    ) {
      const featuredMainCategories = mainCategories.filter(
        (category) => category.isFeatured
      );
      setFeaturedMainCategories(featuredMainCategories);
      setFetchMainCategoriesLoading(false);
      // console.log(featuredMainCategories);
    }
    // console.log(mainCategories);
  }, [mainCategories]);

  useEffect(() => {
    if (
      !fetchMainCategoriesLoading &&
      featuredMainCategories.length > 0 &&
      productsFeaturedCategories.length === 0
    ) {
      featuredMainCategories.forEach((category, index) => {
        // Loading true for index same as it array index

        setProductsFeaturedCategoriesLoading((prev) => [...prev, true]);
        getMainCategories(category.name, index);
      });
    }
  }, [featuredMainCategories]);

  return (
    <div className="mt-16 md:mt-28   ">
      {/* Banner  */}

      <LandingPage />

      <div className=" divide-y-4 space-y-9 ">
        <FeaturedProducts
          products={featuredProducts}
          loading={fetchProductsLoading}
          title="Featured"
        />

        {productsFeaturedCategories.length > 0 &&
          productsFeaturedCategories.map((category, index) => (
            <FeaturedProducts
              key={index}
              products={category.products}
              loading={productsFeaturedCategoriesLoading[index]}
              title={category.name}
            />
          ))}
      </div>

      {/* Ratings  */}
      <div className="px-3 py-6 sm:px-6 md:px-8 xl:px-16 2xl:px-20 bg-slate-100 dark:bg-slate-900 divide-y-2  ">
        {/* Section1 */}
        {!reviewsDetailsLoading ? (
          <>
            <div className="grid pb-8 grid-cols-1 md:grid-cols-2 items-center gap-4">
              {/* S1.1 */}
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-center md:text-start">
                  Customer Reviews
                </h2>
                <div>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Beatae veritatis quos iste, quaerat aut quasi ipsam earum,
                  nemo placeat delectus obcaecati debitis atque blanditiis.
                  Veniam velit excepturi mollitia minima esse sit beatae iure
                  maxime nisi tempora, quam quisquam quos fuga fugit porro
                  dignissimos assumenda.
                </div>
              </div>
              {/* S1.2 */}
              {!reviewsDetailsLoading && (
                <>
                  <div className="flex flex-col items-center md:items-start mt-4 space-y-3">
                    <p className="text-lg font-semibold">
                      Based on {totalReviewsDetails.totalReviews} reviews
                    </p>
                    <p className="flex items-center space-x-2">
                      <span className="text-2xl">
                        {reviewsPercentage.overallRating.toFixed(1)} /5
                      </span>
                      <span className="flex">
                        {[
                          ...Array(Math.floor(reviewsPercentage.overallRating)),
                        ].map((_, index) => (
                          <svg
                            key={index}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 text-yellow-400"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                        {[
                          ...Array(
                            5 - Math.floor(reviewsPercentage.overallRating)
                          ),
                        ].map((_, index) => (
                          <svg
                            key={index}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 text-gray-300"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                      </span>
                    </p>
                    {/* Reviews percentage with bars */}
                    <div className="w-full flex flex-col space-y-3">
                      <div>
                        <div className="flex justify-between">
                          <span>5 stars</span>
                          <span>
                            {" "}
                            {reviewsPercentage.fiveStarReviews.toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-gray-200 h-2 rounded-full">
                          <div
                            style={{
                              width: `${reviewsPercentage.fiveStarReviews}%`,
                            }}
                            className={`bg-yellow-400 h-2 rounded-full`}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span>4 stars</span>
                          <span>
                            {" "}
                            {reviewsPercentage.fourStarReviews.toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-gray-200 h-2 rounded-full">
                          <div
                            style={{
                              width: `${reviewsPercentage.fourStarReviews}%`,
                            }}
                            className={`bg-yellow-400 h-2 rounded-full `}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span>3 stars</span>
                          <span>
                            {" "}
                            {reviewsPercentage.threeStarReviews.toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-gray-200 h-2 rounded-full">
                          <div
                            style={{
                              width: `${reviewsPercentage.threeStarReviews}%`,
                            }}
                            className={`bg-yellow-400 h-2 rounded-full`}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span>2 stars</span>
                          <span>
                            {" "}
                            {reviewsPercentage.twoStarReviews.toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-gray-200 h-2 rounded-full">
                          <div
                            style={{
                              width: `${reviewsPercentage.twoStarReviews}%`,
                            }}
                            className={`bg-yellow-400 h-2 rounded-full`}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span>1 stars</span>
                          <span>
                            {" "}
                            {reviewsPercentage.oneStarReviews.toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-gray-200 h-2 rounded-full">
                          <div
                            style={{
                              width: `${reviewsPercentage.oneStarReviews}%`,
                            }}
                            className={`bg-yellow-400 h-2 rounded-full `}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="container mx-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LEft Skeleton */}
                <div className="w-full h-52 md:h-[70vh]">
                  <Skeleton className="w-full h-full rounded-lg" />
                </div>

                {/* Right Info Skeleton */}
                <div className="space-y-4">
                  <Skeleton className="w-3/4 h-6" />
                  <Skeleton className="w-1/2 h-8" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-5/6 h-4" />
                  <Skeleton className="w-2/3 h-6" />
                  <Skeleton className="w-1/4 h-8" />
                </div>
                {/* Reviews section */}
              </div>
            </div>
          </>
        )}
        {/* Section 2 reviews */}
        {!reviewsLoading ? (
          <>
            <div className="py-6">
              <Carousel
                showArrows={true}
                showThumbs={false}
                showIndicators={false}
                showStatus={false}
                infiniteLoop={false}
                autoPlay={false}
                emulateTouch
                centerMode={true}
                centerSlidePercentage={
                  (window.innerWidth > 1024) &
                  (reviews.length > 3) &
                  !reviewsLoading
                    ? 25
                    : window.innerWidth > 1024
                    ? 15
                    : window.innerWidth > 768
                    ? 33
                    : window.innerWidth > 640
                    ? 60
                    : 90
                } // Adjust percentage based on screen width
                className="rounded-lg shadow-lg  "
                renderArrowPrev={(onClickHandler, hasPrev) => (
                  <button
                    className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10 text-3xl text-gray-700 bg-white p-2 rounded-full shadow-md hover:text-gray-900 hover:bg-gray-100"
                    onClick={onClickHandler}
                  >
                    <ArrowBigLeft />
                  </button>
                )}
                renderArrowNext={(onClickHandler, hasNext) => (
                  <button
                    className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10 text-3xl text-gray-700 bg-white p-2 rounded-full shadow-md hover:text-gray-900 hover:bg-gray-100"
                    onClick={onClickHandler}
                  >
                    <ArrowBigRight />
                  </button>
                )}
              >
                {reviews.map((r, index) => (
                  <Link
                    to={`/product/${r.productName?.replace(/\s/g, "-")}`}
                    key={r._id}
                    className=" mx-2 w-[300px]  h-full dark:bg-slate-800 rounded-lg shadow-lg p-6 flex flex-col items-center sm:items-start"
                  >
                    {/* Product Images */}
                    <div className="h-[200px] aspect-square  my-2 overflow-hidden w-full">
                      <Carousel
                        autoPlay={false}
                        interval={4000}
                        showIndicators={true}
                        showStatus={false}
                        stopOnHover={true}
                        infiniteLoop
                        showThumbs={false}
                        showArrows={false}
                        className="carousel-wrapper"
                      >
                        {r.images?.map((i, idx) => (
                          <img
                            key={idx}
                            src={i.url}
                            alt={`product-${idx}`}
                            className="object-cover w-full h-full rounded-lg"
                          />
                        ))}
                      </Carousel>
                    </div>
                    {/* Name of user */}
                    <div className="text-left w-full  ">
                      <div className="flex items-end space-x-2 mb-2">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                          {r.name}
                        </h2>
                        <span className="text-sm text-gray-400">
                          {r.createdAt?.split("T")[0]}
                        </span>
                      </div>
                      {/* Rating */}
                      <div className="flex justify-center my-2">
                        {[...Array(r.rating)].map((_, idx) => (
                          <svg
                            key={idx}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 text-yellow-400"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                        {[...Array(5 - r.rating)].map((_, idx) => (
                          <svg
                            key={idx}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 text-gray-300"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                      </div>
                      {/* Review */}
                      <div className="text-gray-600 dark:text-gray-200 text-center sm:text-left h-full ">
                        <p>{r.comment}</p>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* If total reviews reached */}
                {reviewsPagination.page < reviewsPagination.pages && (
                  <span className="flex items-center h-full">
                    <button
                      onClick={() => {
                        if (reviewsPagination.page < reviewsPagination.pages) {
                          setCurrentReviewPage((prev) => prev + 1);
                        }
                      }}
                      className="px-4 py-2 bg-gray-800  text-white rounded-lg shadow-md hover:bg-gray-700"
                    >
                      Load More
                    </button>
                  </span>
                )}
                {/* Else if maximum page reached */}
                {reviewsPagination.page === reviewsPagination.pages && (
                  <span className="flex items-center  h-full font-semibold">
                    Reviews Ended
                  </span>
                )}
              </Carousel>
            </div>
          </>
        ) : (
          <>
            {" "}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {/* Review cards */}
              <Skeleton className="w-full h-72 rounded-lg" />
              <Skeleton className="w-full h-72 rounded-lg" />
              <Skeleton className="w-full h-72 rounded-lg" />
              <Skeleton className="w-full h-72 rounded-lg" />
            </div>
            .
          </>
        )}
      </div>

      <div className="h-[10vh]"></div>
    </div>
  );
}

export default HomePage;
