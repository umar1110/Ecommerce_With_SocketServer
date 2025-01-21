import { Instagram } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.jpg";
function Footer() {
  const navigate = useNavigate();
  // const services = [
  //   "Finding Loads",
  //   "Assigning Loads",
  //   "Billing paperwork & Collection",
  //   "Factoring & Invoicing",
  //   "Quick Pay Assistance",
  //   "24/7 Dispatch",
  // ];

  const { mainCategories, mainCategoriesLoading } = useSelector(
    (state) => state.categories
  );

  return (
    <div>
      <div className="relative flex justify-start md:justify-center md:items-end py-11">
        <img
          className="absolute dark:hidden object-cover top-10 h-full w-full xl:mt-10 z-0 "
          src="https://res.cloudinary.com/dp5wq2vcw/image/upload/f_auto,q_auto/v1/Static/czcddwgehbkv14ma4npg"
          alt="background"
        />
        <div className="flex pt-36 md:pt-32 lg:pt-40 xl:pt-96   px-4 md:px-6  xl:px-20 flex-col justify-start items-start md:justify-center md:items-center relative z-10">
          <div className="flex  flex-col items-start justify-start xl:justify-center xl:space-x-8 xl:flex-row">
            <div className="flex justify-start items-center space-x-4">
              <div className="cursor-pointer w-12  overflow-hidden ">
                <img src={Logo} alt="logo" />
              </div>
              <p className="w-60 text-xl xl:text-2xl font-semibold leading-normal text-white uppercase">
                LuxuryLoom
              </p>
            </div>
            <div className="mt-12 xl:mt-0 grid grid-cols-1 sm:grid-cols-3 gap-y-12 sm:gap-y-0 w-full md:w-auto sm:gap-x-20 md:gap-x-28 xl:gap-8">
              <div className="sm:w-40 md:w-auto xl:w-72 flex justify-start items-start flex-col space-y-6">
                <h2 className="text-base xl:text-xl font-bold xl:font-semibold border-b-2 border-white leading-4 xl:leading-5 text-white">
                  Main Categories
                </h2>

                {!mainCategoriesLoading ? (
                  mainCategories.map((category) => {
                    return (
                      <button
                        onClick={() => {
                          navigate(
                            `products/${category.name.replace(/\s+/g, "-")}`
                          );
                          setTimeout(() => {
                            window.scroll({
                              top: 0,
                              behavior: "smooth",
                            });
                          }, 200);
                        }}
                        key={category._id}
                        className="text-left text-base hover:text-gray-400 leading-none text-gray-100"
                      >
                        {category.name}
                      </button>
                    );
                  })
                ) : (
                  <p>Loading...</p>
                )}
              </div>

              {/* <div className="sm:w-40 md:w-auto xl:w-72 flex justify-start items-start flex-col space-y-6">
                <h2 className="text-base xl:text-xl font-bold xl:font-semibold leading-4 xl:leading-5 text-white border-b-2 border-white">
                  Services
                </h2>

                {services.map((service) => {
                  return (
                    <button
                      onClick={() => {
                        navigate("services");
                      }}
                      key={service}
                      className="text-left text-base hover:text-gray-400 leading-none text-gray-100"
                    >
                      {service}
                    </button>
                  );
                })}
              </div> */}

              <div className=" xl:w-72 flex justify-start items-start flex-col space-y-6">
                <h2 className="text-base xl:text-xl font-bold xl:font-semibold leading-4 xl:leading-5 text-white border-b-2 border-white">
                  Contact Info
                </h2>
                <div className="flex text-base text-left hover:text-gray-400 leading-none text-gray-100 space-x-1">
                  <span>Tell:</span>
                  <a
                    href="https://wa.me/+923024962287"
                    target="_blank"
                    className="text-base text-left hover:text-gray-400 leading-none text-gray-100"
                  >
                    +92-3024962287
                  </a>
                  <a
                    href="https://wa.me/+923004043521"
                    target="_blank"
                    className="text-base text-left hover:text-gray-400 leading-none text-gray-100"
                  >
                    +92-3004043521
                  </a>
                </div>
                <a
                  href="mailto:luxuryloomshop424@gmail.com"
                  target="_blank"
                  className="text-base text-left hover:text-gray-400 leading-none text-gray-100"
                >
                  Email: luxuryloomshop424@gmail.com
                </a>
                <a
                  href="https://g.co/kgs/bf3oMdy"
                  target="_blank"
                  className="text-base text-left hover:text-gray-400 leading-none text-gray-100"
                >
                  Visit Us: Park View City Multan Road Lahore
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 py-8 px-8 flex  xl:justify-between xl:flex-row flex-col-reverse items-center xl:items-start w-full ">
            <p className="mt-10 md:mt-12 xl:mt-0 text-sm  text-white">
              &copy; Luxury Loom All Rights Reserved.
              <br />
              Developed by :{" "}
              <a
                href="mailto:umarworkbase1110@gmail.com"
                target="_blank"
                className="text-white hover:text-gray-300"
              >
                Umar Dev
              </a>
            </p>
            {/* <div className="mt-10 md:mt-12 xl:mt-0 md:flex-row flex-col flex md:justify-center w-full md:w-auto justify-start items-start space-y-4 md:space-y-0 md:items-center md:space-x-4 xl:space-x-6">
              <Link
                to={"/"}
                className="text-base leading-none text-white hover:text-gray-300"
              >
                Terms of service
              </Link>
              <Link
                to={"/"}
                className="text-base leading-none text-white hover:text-gray-300"
              >
                Privacy Policy
              </Link>
            </div> */}
            <div className="flex  justify-start md:justify-end items-start  w-full md:w-auto md:items-center space-x-6 ">
              <a
                href="https://www.instagram.com/luxuryloom123/"
                target="_blank"
                className="text-white hover:text-gray-200 w-6"
              >
                <Instagram />
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61557901529498&mibextid=ZbWKwL"
                target="_blank"
                className="text-white hover:text-gray-200 w-6"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M22.5 12.0645C22.5 6.26602 17.7984 1.56445 12 1.56445C6.20156 1.56445 1.5 6.26602 1.5 12.0645C1.5 17.3051 5.33906 21.649 10.3594 22.4374V15.1005H7.69266V12.0645H10.3594V9.75117C10.3594 7.12008 11.9273 5.66555 14.3255 5.66555C15.4744 5.66555 16.6763 5.87086 16.6763 5.87086V8.45508H15.3516C14.048 8.45508 13.6402 9.26414 13.6402 10.0957V12.0645H16.552L16.087 15.1005H13.6406V22.4384C18.6609 21.6504 22.5 17.3065 22.5 12.0645Z"
                    fill="currentColor"
                  />
                </svg>
              </a>

              <a
                href="http://tiktok.com/@luxuryloom763"
                // Open in new tab
                target="_blank"
                className="text-white hover:text-gray-200 w-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  id="tiktok"
                >
                  <path
                    d="M38.4 21.68V16c-2.66 0-4.69-.71-6-2.09a8.9 8.9 0 0 1-2.13-5.64v-.41l-5.37-.13V30.8a5 5 0 1 1-3.24-5.61v-5.5a10.64 10.64 0 0 0-1.7-.14 10.36 10.36 0 1 0 10.36 10.36 10.56 10.56 0 0 0-.08-1.27v-9.15a14.48 14.48 0 0 0 8.16 2.19Z"
                    fill="#f8f8f8"
                    class="color000000 svgShape"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
