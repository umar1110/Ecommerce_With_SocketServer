import { Skeleton } from "../../components/ui/skeleton";
import ProductCard from "../product/productCard";

function FeaturedProducts({ products, loading, title }) {
  return (
    <div className="py-9">
      <h2 className="w-fit mx-auto md:text-2xl text-xl font-semibold font-sans">
        {title} Products
      </h2>

      {!loading ? (
        <>
          {products.length > 0 ? (
            <div className="xl:w-[92%] md:w-[95%] mx-auto ">
              <div className="cards flex flex-wrap justify-evenly xl:justify-center space-x-1 xl:space-x-3">
                {products.map((product, idx) => (
                  <ProductCard key={idx} product={product} />
                ))}
              </div>
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

export default FeaturedProducts;
