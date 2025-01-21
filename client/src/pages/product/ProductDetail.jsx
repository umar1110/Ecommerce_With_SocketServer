import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { addToCart } from "@/redux/slices/cartSlice";
import { setCheckout } from "@/redux/slices/checkOutSlice";
import axiosBackend from "@/utils/axiosInstanceBackend";
import {
  ArrowBigLeft,
  ArrowBigRight,
  Check,
  Edit,
  Minus,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
function ProductDetail() {
  const {
    user,
    isAuthenticated,
    loading: userLoading,
  } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Get product Name from param
  const { productName } = useParams();
  //   convert back in form
  const productNameConverted = productName.replace(/-/g, " ");

  //   States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState([]);
  const [quantity, setquantity] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewImagesPreview, setReviewImagesPreview] = useState([]);
  const [reviewRatings, setreviewRatings] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  //   Functions
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axiosBackend.post(`/api/v1/product/details`, {
        title: productNameConverted,
      });
      setLoading(false);
      setProduct(response.data.data);
      setSuccess(true);
    } catch (error) {
      setLoading(false);

      toast.error(error.response?.data?.message || error.message);
      console.log(error.response?.data?.message || error.message);
    }
  };

  //   Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const limit = 10;
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [reviewsPagination, setReviewsPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });
  // get reviews
  const getReviews = async () => {
    try {
      setReviewsLoading(true);
      const { data } = await axiosBackend.get(
        `/api/v1/review?limit=${limit}&page=${currentReviewPage}&productId=${
          !loading && product && product._id
        }`
      );
      setReviews(data.data.reviews);
      setReviewsPagination(data.data.pagination);
      setReviewsLoading(false);
    } catch (error) {
      setReviewsLoading(false);
      console.log(error.message);
    }
  };

  const addToCartHandle = () => {
    if (!loading && success) {
      dispatch(
        addToCart({ product, selectedFeatures: selectedFeature, quantity })
      );
    }
  };

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
      const { data } = await axiosBackend.get(
        `/api/v1/review/reviews/details?productId=${product?._id}`
      );

      setTotalReviewsDetails(data.data);
      setReviewsDetailsLoading(false);
    } catch (error) {
      setReviewsDetailsLoading(false);
      console.log(error.message);
    }
  };

  const submitReview = async () => {
    if (reviewRatings < 1) {
      toast.error("Please select a rating");
      return;
    }
    if (reviewComment.trim().length < 1) {
      toast.error("Please enter a comment");
      return;
    }
    if (reviewImages.length < 1) {
      toast.error("Please select at least one image");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("productId", product._id);
      formData.append("productName", product.title);
      formData.append("rating", reviewRatings);
      formData.append("comment", reviewComment);
      reviewImages.forEach((image) => {
        formData.append("reviewImages", image);
      });
      toast.loading("Submitting review...");
      const { data } = await axiosBackend.post("/api/v1/review", formData, {
        withCredentials: true,
      });
      if (data.success) {
        setDrawerOpen(false);
        setReviewImages([]);
        setReviewImagesPreview([]);
        setreviewRatings(0);
        setReviewComment("");
        toast.dismiss();
        toast.success("Review submitted successfully");
        getReviews();
        getReviewDetails();
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      toast.loading("Deleting review...");
      const { data } = await axiosBackend.delete(`/api/v1/review/${reviewId}`, {
        withCredentials: true,
      });
      if (data.success) {
        toast.dismiss();
        toast.success("Review deleted successfully");
        getReviews();
        getReviewDetails();
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Use effects
  useEffect(() => {
    fetchProduct();
    // go up smoothly
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [productNameConverted]);

  useEffect(() => {
    if (product) {
      // Set initial selected features after product is fetched
      const initialSelectedFeature = product.features.map((feature) => {
        const value = feature.values.find((value) => value.stock > 0);
        if (!value) {
          return;
        }
        return {
          feature: feature.feature,
          value: value ? value.value : "No stock",
          stock: value.stock,
        };
      });

      // Remove null values
      const filtered = initialSelectedFeature.filter((el) => el != null);
      setSelectedFeature(filtered);

      // Fetch reviews when the product is available
      getReviews();
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      getReviewDetails();
    }
  }, [product]);

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
    if (product) {
      getReviews(); // Re-fetch reviews when the review page changes
    }
  }, [currentReviewPage, product]);

  useEffect(() => {}, [submitReview]);
  return (
    <div className="mt-16 md:mt-28">
      {/* Edit button on bar if user is admin */}

      {user?.role === 0 && (
        <div className=" fixed   bottom-4 right-4 z-50 flex justify-end  ">
          <Button
            variant="default"
            onClick={() => {
              // Navigate to edit page
              //   history.push(`/admin/products/edit/${product._id}`);
              navigate(`/admin/dashboard/products/edit/${product._id}`);
            }}
          >
            <Edit className="w-6 h-6" />
            Edit
          </Button>
        </div>
      )}

      {!loading ? (
        <>
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Enter Your Data for review.</DrawerTitle>
                <DrawerDescription>
                  Be honest and help others make better decisions.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerDescription>
                <div className="flex flex-col items-center gap-6 w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] mx-auto ">
                  {/* Rating Section */}
                  <div className="w-full">
                    <label
                      htmlFor="rating"
                      className="text-lg font-semibold text-gray-800 mb-2"
                    >
                      Rating:
                    </label>
                    <div className="flex items-center gap-3">
                      {[...Array(5)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setreviewRatings(index + 1)}
                          className="p-1 transition-all duration-200 hover:scale-110"
                        >
                          {index + 1 <= reviewRatings ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-7 h-7 text-yellow-500"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-7 h-7 text-gray-300"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Images Section */}
                  <div className="w-full">
                    <label
                      htmlFor="reviewImages"
                      className="text-lg font-semibold text-gray-800 mb-2"
                    >
                      Images:
                    </label>
                    <input
                      type="file"
                      id="reviewImages"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setReviewImages(files);
                        setReviewImagesPreview(
                          files.map((file) => URL.createObjectURL(file))
                        );
                      }}
                      className="block w-full p-2 border border-gray-300 rounded-md mb-3"
                    />
                    <div className="flex gap-3">
                      {reviewImagesPreview.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt="Review"
                            className="w-20 h-20 object-cover rounded-md border-2 border-gray-300"
                          />
                          <button
                            onClick={() => {
                              setReviewImages((prev) => {
                                const newImages = [...prev];
                                newImages.splice(index, 1);
                                return newImages;
                              });
                              setReviewImagesPreview((prev) => {
                                const newImages = [...prev];
                                newImages.splice(index, 1);
                                return newImages;
                              });
                            }}
                            className="absolute top-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-red-200 transition-all"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5 text-red-500"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6.343 5.657c.195-.195.451-.293.707-.293s.512.098.707.293l10 10c.391.391.391 1.023 0 1.414s-1.023.391-1.414 0l-10-10c-.391-.391-.391-1.023 0-1.414z"
                                clipRule="evenodd"
                              />
                              <path
                                fillRule="evenodd"
                                d="M16.343 5.657c.195-.195.451-.293.707-.293s.512.098.707.293l10 10c.391.391.391 1.023 0 1.414s-1.023.391-1.414 0l-10-10c-.391-.391-.391-1.023 0-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comment Section */}
                  <div className="w-full">
                    <label
                      htmlFor="comment"
                      className="text-lg font-semibold text-gray-800 mb-2"
                    >
                      Comment:
                    </label>
                    <textarea
                      id="comment"
                      maxLength={200}
                      className="w-full p-3 border border-gray-300 rounded-md shadow-sm resize-none"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                  </div>
                </div>
              </DrawerDescription>

              <DrawerFooter>
                <Button
                  onClick={() => {
                    submitReview();
                  }}
                  className=" w-[95%] md:w-[90%] lg:w-[85%] xl:w-[80%] mx-auto"
                >
                  Submit
                </Button>
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
          {success && (
            <>
              {/*  */}
              <div className="Product-Page py-20  md:pt-[5rem] lg:w-[90%] xl:w-[80%]  mx-auto">
                {/*Description all  */}
                <div className="image-feature-name md:flex mb-36  min-h-[70vh] md:space-x-6  md:items-center lg:items-start  w-fit mx-auto">
                  {/* Image */}
                  <Carousel
                    autoPlay={true}
                    infiniteLoop={true}
                    showStatus={false}
                    swipeable={true}
                    stopOnHover={true}
                    // hide buttons
                    showArrows={false}
                    renderThumbs={() =>
                      product.images.map((i) => (
                        <img
                          key={i.url}
                          src={i.url}
                          alt="Thumbnail"
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ))
                    }
                    className="w-full text-center h-fit md:w-1/2 lg:w-[40%] "
                  >
                    {product.images.map((i, idx) => (
                      <div
                        key={idx}
                        className="aspect-square overflow-hidden   "
                      >
                        <img
                          src={i.url}
                          alt={"Product Image"}
                          className="md:rounded-lg object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </Carousel>
                  <div className="name-features w-full md:w-1/2 px-4  h-full  md:px-0 flex flex-col  ">
                    <h2 className="text-3xl font-bold mb-2">{product.title}</h2>
                    {/* Out of stock badge */}
                    {product.stock < 1 && (
                      <div className="flex items-center gap-2 mb-4 ">
                        <svg
                          className="w-6 h-6"
                          viewBox="0 0 48 48"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          stroke="#ef4444 "
                        >
                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M18.7071 4.69719C19.0976 4.30667 19.7308 4.30667 20.1213 4.69719L28.6066 13.1825C28.9971 13.573 28.9971 14.2062 28.6066 14.5967C28.216 14.9872 27.5829 14.9872 27.1924 14.5967L18.7071 6.1114C18.3166 5.72088 18.3166 5.08771 18.7071 4.69719Z"
                              fill="#ef4444 "
                            ></path>{" "}
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M28.7071 4.7068C29.0976 5.09733 29.0976 5.73049 28.7071 6.12102L20.2218 14.6063C19.8313 14.9968 19.1981 14.9968 18.8076 14.6063C18.4171 14.2158 18.4171 13.5826 18.8076 13.1921L27.2929 4.7068C27.6834 4.31628 28.3166 4.31628 28.7071 4.7068Z"
                              fill="#ef4444 "
                            ></path>{" "}
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M24.3162 15.0513C24.111 14.9829 23.8891 14.9829 23.6838 15.0513L8.86851 19.9889C8.64603 20.063 8.463 20.2102 8.34247 20.3985L4.39805 25.4613C4.1985 25.7175 4.13573 26.0545 4.2297 26.3653C4.32367 26.6761 4.56269 26.922 4.87072 27.0246L8.19325 28.1319L8.19595 36.7634C8.19636 38.0544 9.02257 39.2003 10.2473 39.6085L23.6291 44.0691C23.7475 44.1164 23.8738 44.1406 24.0009 44.1405C24.1293 44.141 24.2569 44.1168 24.3765 44.069L37.7577 39.6086C38.9827 39.2003 39.8089 38.054 39.809 36.7628L39.8096 28.1328L43.1346 27.0246C43.4427 26.922 43.6817 26.6761 43.7757 26.3653C43.8696 26.0545 43.8069 25.7175 43.6073 25.4613L39.6117 20.3327C39.4927 20.176 39.3274 20.0542 39.1315 19.9889L24.3162 15.0513ZM9.54341 22.1112L22.346 26.378L19.6478 29.8413L6.8452 25.5745L9.54341 22.1112ZM24.0025 24.8203L35.6526 20.9376L24 17.0541L12.35 20.9367L24.0025 24.8203ZM10.196 36.7628L10.1935 28.7986L19.686 31.9622C20.088 32.0962 20.5307 31.9623 20.7911 31.6281L23.0003 28.7924L23.0001 41.7513L10.8797 37.7112C10.4715 37.5751 10.1961 37.1931 10.196 36.7628ZM37.8095 28.7993L28.3193 31.9622C27.9174 32.0962 27.4747 31.9623 27.2143 31.6281L25.0013 28.7876L25.0049 41.7514L37.1252 37.7113C37.5336 37.5752 37.809 37.1931 37.809 36.7627L37.8095 28.7993ZM28.3576 29.8413L25.6583 26.3767L38.4609 22.1099L41.1602 25.5745L28.3576 29.8413Z"
                              fill="#ef4444 "
                            ></path>{" "}
                          </g>
                        </svg>
                        <span className="text-red-500">Out of Stock</span>
                      </div>
                    )}
                    <div className="mb-4">
                      <span className="text-2xl font-bold mr-2">
                        Rs. {product.salePrice}
                      </span>
                      <span className="text-gray-500 line-through">
                        Rs. {product.beforeDiscountPrice}
                      </span>
                    </div>
                    {/* Ratings  */}
                    <div className="flex items-center mb-4">
                      {[...Array(Math.floor(product.ratings))].map(
                        (_, index) => (
                          <svg
                            key={index}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 text-yellow-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )
                      )}
                      {[...Array(5 - Math.floor(product.ratings))].map(
                        (_, index) => (
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
                        )
                      )}
                      <span className="ml-2 text-gray-600">
                        {product.ratings} ({product.numOfReviews} reviews)
                      </span>
                    </div>
                    {/* Small description  */}
                    <div>{product.smallDescription} </div>
                    {/* Features list and user can select one value fro each featutre  */}
                    <div className="mb-6  ">
                      {product.features?.map((feature, idx) => (
                        <div key={idx} className="mb-4 capitalize">
                          <label
                            htmlFor={feature.feature}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            {feature.feature}
                          </label>
                          <div id={feature.feature}>
                            {/* Selected feature value have button with default varient and unseleteds are outline */}
                            <div className="flex gap-4 flex-wrap">
                              {feature.values.map((value, index) => (
                                <Button
                                  key={index}
                                  disabled={value.stock < 1}
                                  className={`${
                                    value.stock < 1
                                      ? "cursor-not-allowed line-through"
                                      : "cursor-pointer "
                                  }`}
                                  variant={
                                    selectedFeature[idx]?.value === value.value
                                      ? "default"
                                      : "outline"
                                  }
                                  onClick={() => {
                                    setSelectedFeature((prev) => {
                                      const newSelectedFeature = [...prev];
                                      newSelectedFeature[idx] = {
                                        feature: feature.feature,
                                        value: value.value,
                                        stock: value.stock,
                                      };
                                      return newSelectedFeature;
                                    });
                                  }}
                                >
                                  {value.value}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quantity Select  */}
                    <div className="mb-6">
                      <label
                        htmlFor="quantity"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Quantity:
                      </label>
                      {/* quantity input but with inc dec buttons */}
                      <div className="flex items-center justify-between w-36">
                        <button
                          onClick={() => {
                            setquantity((prev) => {
                              if (prev < 2) return prev;
                              return prev - 1;
                            });
                          }}
                          disabled={quantity < 2}
                          className={`${
                            quantity < 2
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <Minus className="w-6 h-6" />
                        </button>
                        <input
                          type="number"
                          // value={quantity}
                          // onChange={(e) => {
                          //   if (e.target.value > product.stock) return;
                          //   setquantity(Number(e.target.value));
                          // }}
                          disabled
                          placeholder={quantity}
                          className="w-16 h-10 text-center"
                        />
                        <button
                          onClick={() => {
                            //  Also check if soome of selected feature value stock is leff than no increment
                            const minStock = selectedFeature.reduce(
                              (acc, curr) => {
                                return Math.min(acc, curr.stock);
                              },
                              Infinity
                            );

                            if (quantity + 1 > minStock) return;

                            if (product.stock < quantity + 1) return;
                            setquantity((prev) => {
                              return prev + 1;
                            });
                          }}
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                    {/* Buttons */}
                    <div className="flex space-x-4 mb-6 ">
                      <button
                        onClick={addToCartHandle}
                        disabled={product.stock < 1}
                        className={` ${
                          product.stock < 1
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        } bg-indigo-600 flex overflow-hidden gap-2 items-center text-white px-6 py-2 relative rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      `}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                          />
                        </svg>
                        {/* Overlay button with transparent background like shady  with cross if stock is <1 */}
                        {product.stock < 1 && (
                          <div className="absolute top-0 left-0 w-full h-full bg-gray-600 bg-opacity-50 flex items-center justify-center"></div>
                        )}
                        Add to Cart
                      </button>
                      <button
                        onClick={() => {
                          dispatch(
                            setCheckout({
                              products: [
                                {
                                  ...product,
                                  quantity,
                                  selectedFeatures: selectedFeature,
                                },
                              ],
                            })
                          );
                          navigate(`/checkout`);
                        }}
                        disabled={product.stock < 1}
                        className={`${
                          product.stock < 1
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        } bg-yellow-500 relative flex gap-2 items-center text-white px-6 overflow-hidden py-2 rounded-md hover:bg-yellow-700  focus:outline-none focus:ring-2 focus:ring-yellow-500  focus:ring-offset-2
                      `}
                      >
                        {/* Overlay button with transparent background like shady  with cross if stock is <1 */}
                        {product.stock < 1 && (
                          <div className="absolute top-0 left-0 w-full h-full bg-gray-600 bg-opacity-50 flex items-center justify-center"></div>
                        )}
                        <Check className="w-6 h-6" />
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description as description in html */}
                <div className="description  w-full p-3  ">
                  <h2 className="text-2xl font-bold mb-4">Description</h2>
                  <div
                    className="  !max-w-[100%]  overflow-x-scroll "
                    dangerouslySetInnerHTML={{
                      __html: product.description,
                    }}
                  ></div>
                </div>
                {/* Reviews */}

                <div className=" bg-slate-100 dark:bg-slate-900 divide-y-2  ">
                  <div className="px-3 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-28 bg-slate-100 dark:bg-slate-900 divide-y-2  ">
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
                              Lorem ipsum dolor, sit amet consectetur
                              adipisicing elit. Beatae veritatis quos iste,
                              quaerat aut quasi ipsam earum, nemo placeat
                              delectus obcaecati debitis atque blanditiis.
                              Veniam velit excepturi mollitia minima esse sit
                              beatae iure maxime nisi tempora, quam quisquam
                              quos fuga fugit porro dignissimos assumenda.
                            </div>
                          </div>
                          {/* S1.2 */}
                          {!reviewsDetailsLoading && (
                            <>
                              <div className="flex flex-col items-center md:items-start mt-4 space-y-3">
                                <p className="text-lg font-semibold">
                                  Based on {totalReviewsDetails.totalReviews}{" "}
                                  reviews
                                </p>
                                <p className="flex items-center space-x-2">
                                  <span className="text-2xl">
                                    {reviewsPercentage.overallRating} /5
                                  </span>
                                  <span className="flex">
                                    {[
                                      ...Array(
                                        Math.floor(
                                          reviewsPercentage.overallRating
                                        )
                                      ),
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
                                        5 -
                                          Math.floor(
                                            reviewsPercentage.overallRating
                                          )
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
                                        {reviewsPercentage.fiveStarReviews.toFixed(
                                          1
                                        )}
                                        %
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
                                        {reviewsPercentage.fourStarReviews.toFixed(
                                          1
                                        )}
                                        %
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
                                        {reviewsPercentage.threeStarReviews.toFixed(
                                          1
                                        )}
                                        %
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
                                        {reviewsPercentage.twoStarReviews.toFixed(
                                          1
                                        )}
                                        %
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
                                        {reviewsPercentage.oneStarReviews.toFixed(
                                          1
                                        )}
                                        %
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
                      <> Loading...</>
                    )}
                    {/* Section 2 reviews */}
                    {!reviewsLoading ? (
                      <>
                        <div className="py-6 ">
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
                                ? 33
                                : window.innerWidth > 1024
                                ? 33
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
                              <div
                                key={r._id}
                                className="relative mx-2 w-[300px] h-full  dark:bg-slate-800 rounded-lg shadow-lg p-6 flex flex-col items-center sm:items-start"
                              >
                                {/* Product Images */}
                                <div className="h-[200px]  my-2  w-full aspect-square overflow-hidden">
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
                                  <div className="text-gray-600 min-h-fit  dark:text-gray-200 text-center sm:text-left">
                                    <p>{r.comment}</p>
                                  </div>
                                </div>
                                {isAuthenticated &&
                                  (user?._id === r.user || user?.role == 0) && (
                                    <>
                                      <div
                                        onClick={() => {
                                          deleteReview(r._id);
                                        }}
                                        className="absolute text-red-400 top-0 right-3 cursor-pointer flex items-center space-x-2"
                                      >
                                        <Trash />
                                      </div>
                                    </>
                                  )}
                              </div>
                            ))}

                            {/* If total reviews reached */}
                            {reviewsPagination.page <
                              reviewsPagination.pages && (
                              <span className="flex items-center h-full">
                                <button
                                  onClick={() => {
                                    if (
                                      reviewsPagination.page <
                                      reviewsPagination.pages
                                    ) {
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
                            {reviewsPagination.page ===
                              reviewsPagination.pages && (
                              <span className="flex items-center  h-full font-semibold">
                                Reviews Ended
                              </span>
                            )}
                          </Carousel>
                        </div>
                      </>
                    ) : (
                      <>Loading...</>
                    )}
                  </div>

                  {/* Review Add Button  */}
                  <div className="text-end bg-slate-100 dark:bg-slate-900 right-0 py-8 px-5 ">
                    <Button
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast.error("Please login to write  review");
                          return;
                        }
                        setDrawerOpen(true);
                      }}
                      variant="default"
                    >
                      <Pencil /> Write Review
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Skeleton */}
              <div className="w-full h-80 md:h-[70vh]">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>

              {/* Product Info Skeleton */}
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
          {/* Reiews */}

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {/* Review cards */}
            <Skeleton className="w-full h-72 rounded-lg" />
            <Skeleton className="w-full h-72 rounded-lg" />
            <Skeleton className="w-full h-72 rounded-lg" />
            <Skeleton className="w-full h-72 rounded-lg" />
            <Skeleton className="w-full h-72 rounded-lg" />
            <Skeleton className="w-full h-72 rounded-lg" />
          </div>
        </>
      )}
    </div>
  );
}

export default ProductDetail;
