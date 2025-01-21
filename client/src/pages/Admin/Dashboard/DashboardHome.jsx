import React, { useEffect } from "react";

function DashboardHome() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div className=" flex justify-center items-center w-full text-2xl font-semibold">
      DashboardHome
    </div>
  );
}

export default DashboardHome;
