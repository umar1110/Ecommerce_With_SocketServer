import {
  ArrowRightFromLine,
  ChartBarStacked,
  Home,
  Shirt,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "../sideBar/AdminSidebar.jsx";
function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Scroll to top smoothly on route change

  return (
    <>
      <div className="flex  flex-row mt-16 md:mt-28 w-full ">
        <div className="">
          <AdminSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        <div className=" relative flex dashboard-details min-h-screen flex-1 ">
          {!sidebarOpen && (
            <div className="p-4 space-y-3 bg-white dark:bg-slate-900 border-r border-t  ">
              <button
                className="mb-10 -mt-4"
                onClick={() => setSidebarOpen(true)}
              >
                <ArrowRightFromLine />
              </button>

              <Home
                className="cursor-pointer"
                onClick={() => {
                  navigate("/admin/dashboard");
                }}
              />

              <Shirt
                className="cursor-pointer"
                onClick={() => {
                  navigate("/admin/dashboard/products");
                }}
              />
              <ShoppingBag
                className="cursor-pointer"
                onClick={() => {
                  navigate("/admin/dashboard/orders");
                }}
              />

              <ChartBarStacked
                className="cursor-pointer"
                onClick={() => {
                  navigate("/admin/dashboard/categories");
                }}
              />

              {/* <Users /> */}
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
