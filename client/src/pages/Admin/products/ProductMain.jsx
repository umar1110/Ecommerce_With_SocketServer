import { Input } from "@/components/ui/input";
import { clearTitleSearch, setTitleSearch } from "@/redux/slices/productsSlice";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";

function ProductMain() {
  const { title } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [search, setsearch] = useState("");

  useEffect(() => {
    return () => {
      dispatch(clearTitleSearch());
    };
  }, []);

  return (
    <div className="w-full  ">
      <div className=" flex flex-col pt-9 pb-4 md:pt-4 md:flex-row space-y-6 md:space-y-0  px-2 bg-gray-100 dark:bg-gray-800 w-full items-center justify-between ">
        <div className="space-x-4">
          <NavLink
            end
            className={({ isActive }) =>
              `${
                isActive
                  ? " bg-red-500  text-white font-semibold"
                  : " bg-red-200 text-black font-normal"
              }  shadow-lg  px-3 py-2 rounded-md  `
            }
            to="/admin/dashboard/products"
          >
            All Products
          </NavLink>
          <NavLink
            end
            className={({ isActive }) =>
              `${
                isActive
                  ? " bg-red-500  text-white font-semibold"
                  : " bg-red-200 text-black font-normal"
              }  shadow-lg  px-3 py-2 rounded-md  `
            }
            to="/admin/dashboard/products/add"
          >
            Add Product
          </NavLink>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(setTitleSearch(search));
          }}
          className="relative  md:w-[300px] "
        >
          <Input
            value={title}
            onChange={(e) => setsearch(e.target.value)}
            className=" bg-white text-black border-slate-500   "
            placeholder="Search Product"
          />
          <button
            type="submit"
            className=" absolute top-0 right-0 text-white h-full w-[50px] bg-black  flex items-center justify-center"
          >
            <Search className=" " />
          </button>
        </form>
      </div>
      <div className="overflow-x-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default ProductMain;
