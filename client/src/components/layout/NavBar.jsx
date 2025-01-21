import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CartSlideOver from "@/pages/Cart/CartSlideOver";
import { logoutUser } from "@/redux/slices/authSlice";
import {
  BaggageClaim,
  ChevronDown,
  ChevronUp,
  CircleUserRound,
  LayoutDashboard,
  ListOrdered,
  LogIn,
  LogOut,
  Menu,
  Search,
} from "lucide-react";
import Logo from "../../assets/Logo.jpg";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { ModeToggle } from "../ui/ThemeHandler";
import NavBarSlideOver from "./NavBarSideOver";

function NavBar() {
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    user,
    loading: userLoading,
  } = useSelector((state) => state.auth);

  const { cart } = useSelector((state) => state.cart);
  const { allCategories: categories, allCategoriesLoading: categoriesLoading } =
    useSelector((state) => state.categories);
  const navigate = useNavigate();
  // States

  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [cartSlideOverOpen, setCartSlideOverOpen] = useState(false);
  const [navbarslideoveropen, setNavbarSlideOverOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?keyword=${search}`);
  };

  useEffect(() => {
    let lastScrollTop = 0;
    const navbar = document.getElementById("nav-bar");
    const threshold = 70;
    let scrollDiff = 0;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollChange = scrollTop - lastScrollTop;

      // Accumulate the scroll difference
      scrollDiff += scrollChange;

      // If scrolled more than the threshold, hide or show the navbar
      if (scrollDiff > threshold) {
        navbar.style.top = "-100%";
        scrollDiff = 0; // Reset scroll difference after hiding
      } else if (scrollDiff < -threshold) {
        navbar.style.top = "0%";
        scrollDiff = 0; // Reset scroll difference after showing
      }

      lastScrollTop = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {}, [cart, cartSlideOverOpen]);

  return (
    <nav
      onClick={() => {
        // setCartSlideOverOpen(true);
      }}
    >
      <CartSlideOver
        isOpen={cartSlideOverOpen}
        onClose={() => {
          setCartSlideOverOpen(false);
        }}
      />

      <div
        className={`bg-slate-200 dark:bg-slate-900 px-2 fixed top-0 left-0 right-0 z-20  `}
      >
        {/* For Mobile */}
        <div className="flex justify-between md:hidden py-4 items-center  ">
          <NavBarSlideOver
            categories={categories}
            categoriesLoading={categoriesLoading}
            handleSearch={handleSearch}
            search={search}
            setSearch={setSearch}
            isOpen={navbarslideoveropen}
            onClose={() => {
              setNavbarSlideOverOpen(false);
            }}
          />
          <button
            onClick={() => {
              setNavbarSlideOverOpen(true);
            }}
            className=""
          >
            <Menu />
          </button>
          <Link to="/" className="absolute left-[50%] -translate-x-[50%] ">
            <img src={Logo} alt="" className=" w-12 " />
          </Link>

          <div className="buttons space-x-2 flex items-center ">
            {/* dark mode shift  */}
            <ModeToggle />
            {/* Cart Button */}
            <button
              onClick={() => {
                setCartSlideOverOpen(true);
              }}
              className="relative "
            >
              {/* Total items */}
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {cart.length}
              </span>
              <BaggageClaim />
            </button>
            {/* Login / Profile button */}

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <>
                  {!userLoading && (
                    <>
                      {isAuthenticated ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.img?.url} />
                          <AvatarFallback>
                            {user.name[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <CircleUserRound />
                      )}
                    </>
                  )}
                </>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem>
                      <Link
                        to={"/myorders"}
                        className="flex items-center space-x-1"
                      >
                        <ListOrdered className="h-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <button
                        onClick={() => {
                          dispatch(logoutUser());
                        }}
                        className="flex items-center space-x-1"
                      >
                        <LogOut className="h-4" />
                        <span>Logout</span>
                      </button>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem>
                    <Link to={"/login"} className="flex items-center space-x-1">
                      <LogIn className="h-4" />
                      <span>Login</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                {/* <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* For Desktop */}
        <div className="hidden  bg-slate-200 py-3 px-2 dark:bg-slate-900  md:flex justify-between items-center space-x-6 2xl:space-x-14 ">
          <Link to={"/"}>
            <img src={Logo} alt="" className=" w-12  " />
          </Link>
          {/* Categories Dropdown */}
          <DropdownMenu
            modal={false}
            open={categoriesDropdownOpen}
            onOpenChange={setCategoriesDropdownOpen} // Sync with state
          >
            <DropdownMenuTrigger
              asChild
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
            >
              <div className="flex space-x-1 items-center">
                <div>Categories</div>
                <div className="py-1 h-7">
                  {!categoriesDropdownOpen ? <ChevronDown /> : <ChevronUp />}
                </div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              onMouseLeave={(e) => {
                setCategoriesDropdownOpen(false);
              }}
            >
              {!categoriesLoading && categories?.length > 0 ? (
                categories.map((category) => (
                  <div key={category.mainCategory.id}>
                    {
                      <div>
                        <>
                          {category?.mainCategory?.categories?.length > 0 ? (
                            <DropdownMenuSub key={category.mainCategory.id}>
                              {/* Main Category Trigger */}
                              <DropdownMenuSubTrigger>
                                <Link
                                  to={`/products/${category.mainCategory.name.replace(
                                    /\s+/g,
                                    "-"
                                  )}`}
                                  className="flex items-center space-x-1"
                                >
                                  <span>{category.mainCategory.name}</span>
                                </Link>
                              </DropdownMenuSubTrigger>

                              {/* Submenu for Categories */}
                              <DropdownMenuSubContent>
                                {category.mainCategory.categories.map(
                                  (subCategory) => (
                                    <div key={subCategory.id}>
                                      {subCategory?.subCategories?.length >
                                      0 ? (
                                        <DropdownMenuSub>
                                          {/* Subcategory Trigger */}
                                          <DropdownMenuSubTrigger>
                                            <Link
                                              to={`/products/${category.mainCategory.name.replace(
                                                /\s+/g,
                                                "-"
                                              )}/${subCategory.name.replace(
                                                /\s+/g,
                                                "-"
                                              )}`}
                                              className="flex items-center space-x-1"
                                            >
                                              <span>{subCategory.name}</span>
                                            </Link>
                                          </DropdownMenuSubTrigger>

                                          {/* Submenu for Subcategories */}
                                          <DropdownMenuSubContent>
                                            {subCategory.subCategories.map(
                                              (subSubCategory) => (
                                                <DropdownMenuItem
                                                  key={subSubCategory.id}
                                                >
                                                  <Link
                                                    to={`/products/${category.mainCategory.name.replace(
                                                      /\s+/g,
                                                      "-"
                                                    )}/${subCategory.name.replace(
                                                      /\s+/g,
                                                      "-"
                                                    )}/${subSubCategory.name.replace(
                                                      /\s+/g,
                                                      "-"
                                                    )}`}
                                                    className="flex items-center space-x-1"
                                                  >
                                                    {subSubCategory.name}
                                                  </Link>
                                                </DropdownMenuItem>
                                              )
                                            )}
                                          </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                      ) : (
                                        <DropdownMenuItem key={subCategory.id}>
                                          <Link
                                            to={`/category/${subCategory.name.replace(
                                              /\s+/g,
                                              "-"
                                            )}`}
                                            className="flex items-center space-x-1"
                                          >
                                            {subCategory.name}
                                          </Link>
                                        </DropdownMenuItem>
                                      )}
                                    </div>
                                  )
                                )}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          ) : (
                            <DropdownMenuItem key={category.mainCategory.id}>
                              <Link
                                to={`/products/${category.mainCategory.name.replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                                className="flex items-center space-x-1"
                              >
                                {category.mainCategory.name}
                              </Link>
                            </DropdownMenuItem>
                          )}
                        </>
                      </div>
                    }
                  </div>
                ))
              ) : (
                <></>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/*Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="What are you looking for ? "
              className=" bg-white overflow-hidden py-5 text-black "
            />
            <button
              type="submit"
              className=" absolute top-0 right-0 rounded-r-md bg-black h-full px-3 flex items-center"
            >
              <Search className="text-white" />
            </button>
          </form>

          {/* Buttons */}
          <div className="flex space-x-3 items-center">
            <button
              onClick={() => {
                setCartSlideOverOpen(true);
              }}
              className="relative mr-2 "
            >
              {/* Cart products Count */}
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {cart.length}
              </span>
              <BaggageClaim />
            </button>
            <ModeToggle />

            {isAuthenticated && user.role === 0 && (
              <Link to="/admin/dashboard" className="text-blue-500">
                <LayoutDashboard />
              </Link>
            )}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <>
                  {!userLoading && (
                    <>
                      {isAuthenticated ? (
                        <Avatar>
                          <AvatarImage src={user?.img?.url} />
                          <AvatarFallback>
                            {user.name[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <CircleUserRound />
                      )}
                    </>
                  )}
                </>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem>
                      <Link
                        to={"/myorders"}
                        className="flex items-center space-x-1"
                      >
                        <ListOrdered className="h-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <button
                        onClick={() => {
                          dispatch(logoutUser());
                        }}
                        className="flex items-center space-x-1"
                      >
                        <LogOut className="h-4" />
                        <span>Logout</span>
                      </button>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem>
                    <Link to={"/login"} className="flex items-center space-x-1">
                      <LogIn className="h-4" />
                      <span>Login</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                {/* <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* Offers  */}
      <div
        id="nav-bar"
        className="z-10 hidden md:block  left-0 right-0 top-0 fixed my-16  dark:bg-slate-300 bg-slate-800 py-3 shadow-lg  "
      >
        <div className="flex text-black justify-center space-x-2 min-w-fit    ">
          {categories &&
            categories.length > 0 &&
            categories.map((category) => (
              <div key={category.mainCategory.id}>
                {category.mainCategory.isOffer && (
                  <Link
                    to={`/products/${category.mainCategory.name.replace(
                      /\s+/g,
                      "-"
                    )}`}
                    className="flex items-center   space-x-1  px-3 py-1 rounded-lg hover:bg-slate-100 bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700  cursor-pointer"
                  >
                    <span>{category.mainCategory.name}</span>
                  </Link>
                )}
              </div>
            ))}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
