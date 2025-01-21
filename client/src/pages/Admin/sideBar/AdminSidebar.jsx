import {
  ArrowLeftFromLine,
  ChartBarStacked,
  Home,
  Shirt,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";
function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      <div
        id="sidebar"
        className={`" relative min-h-screen transition-all  shadow-xl   max-w-screen  flex justify-center  overflow-x-hidden  duration-300 ease-in-out border-r-2 ${
          isOpen ? "w-40" : "w-0"
        } `}
      >
        {/* Closing button */}

        <div
          onClick={onClose}
          className="text-end cursor-pointer absolute top-0 right-0 p-2 pt-4"
        >
          <ArrowLeftFromLine />
        </div>

        <div className="space-y-6 md:space-y-10 mt-10">
          <h1 className="font-bold text-3xl text-center "></h1>

          <div id="menu" className="flex flex-col space-y-2 items-start ">
            <Link
              to="/admin/dashboard"
              className="text-sm  flex space-x-2 font-medium  py-2 px-2 hover:bg-teal-500 hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out"
            >
              <Home />
              <span className="">Dashboard</span>
            </Link>
            <Link
              to="/admin/dashboard/products"
              className="text-sm flex space-x-2 font-medium  py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
            >
              <Shirt />

              <span className="">Edit Products</span>
            </Link>
            <Link
              to="/admin/dashboard/orders"
              className="text-sm flex space-x-2 font-medium  py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
            >
              <ShoppingBag />

              <span className="">Orders</span>
            </Link>
            <Link
              to="/admin/dashboard/categories"
              className="text-sm flex space-x-2 font-medium  py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
            >
              <ChartBarStacked />
              <span className="">Categories</span>
            </Link>
            {/* <Link
              to="/admin/dashboard/services"
              className="text-sm flex space-x-2 font-medium  py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
            >
              <svg
                className="w-6 h-6 fill-current inline-block"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="">Services</span>
            </Link> */}
            {/* <Link
              to="/admin/dashboard/messages"
              className="text-sm flex space-x-2 font-medium  py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
            >
              <svg
                className="w-6 h-6 fill-current inline-block"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
              </svg>
              <span className="">Messages</span>
            </Link> */}

            {/* <Link
              to="/admin/dashboard/users"
              className="text-sm flex space-x-2 font-medium  py-2 px-2 hover:bg-teal-500 hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
            >
              <Users />

              <span className="">Users</span>
            </Link> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;
