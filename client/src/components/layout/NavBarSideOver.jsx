import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";

const NavBarSlideOver = ({
  isOpen,
  onClose,
  search,
  setSearch,
  handleSearch,
  categories,
  categoriesLoading,
}) => {
  const [openCategory, setOpenCategory] = useState(null);
  const [openSubCategory, setOpenSubCategory] = useState(null);

  const toggleCategory = (id) => {
    setOpenCategory((prev) => (prev === id ? null : id));
  };

  const toggleSubCategory = (id) => {
    setOpenSubCategory((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-gray-500/75 dark:bg-gray-800/75 transition-opacity z-10"
          aria-hidden="true"
        ></div>
      )}
      <div
        className={`pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10 z-30 transform transition ease-in-out duration-500 ${
          isOpen ? "-translate-x-0" : "-translate-x-[110%]"
        }`}
      >
        <div className="pointer-events-auto w-screen max-w-md ">
          <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-900 shadow-xl">
            <div className="px-4 py-6 sm:px-6">
              <div className="flex items-start justify-between">
                <h2
                  className="text-lg font-medium text-gray-900 dark:text-gray-100"
                  id="slide-over-title"
                >
                  NavBar
                </h2>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    className="-m-2 p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <svg
                      className="size-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="px-3">
              <form
                onSubmit={(e) => {
                  onClose();
                  handleSearch(e);
                }}
                className="relative"
              >
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="What are you looking for?"
                  className="bg-white py-5 text-black"
                />
                <button
                  type="submit"
                  className="absolute top-0 right-0 rounded-r-md bg-black h-full px-3 flex items-center"
                >
                  <Search className="text-white" />
                </button>
              </form>

              <div className="bg-white dark:bg-gray-900 w-full h-full overflow-y-auto p-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Categories
                </h2>
                {!categoriesLoading && categories?.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {categories.map((category) => (
                      <li key={category.mainCategory.id}>
                        {!category.mainCategory.isOffer && (
                          <>
                            <div className="flex justify-between items-center py-2 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer">
                              <Link
                                to={`/products/${category.mainCategory.name.replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                                onClick={() => {
                                  onClose();
                                  toggleCategory(category.mainCategory.id);
                                }}
                              >
                                {category.mainCategory.name}
                              </Link>
                              {openCategory === category.mainCategory.id ? (
                                <ChevronUp
                                  onClick={() =>
                                    toggleCategory(category.mainCategory.id)
                                  }
                                />
                              ) : (
                                <ChevronDown
                                  onClick={() =>
                                    toggleCategory(category.mainCategory.id)
                                  }
                                />
                              )}
                            </div>
                            {openCategory === category.mainCategory.id && (
                              <ul className="mt-2 ml-3 space-y-2">
                                {category.mainCategory.categories.map(
                                  (subCategory) => (
                                    <li key={subCategory.id}>
                                      <div className="flex justify-between items-center py-2 px-3 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer">
                                        <Link
                                          to={`/products/${category.mainCategory.name.replace(
                                            /\s+/g,
                                            "-"
                                          )}/${subCategory.name.replace(
                                            /\s+/g,
                                            "-"
                                          )}`}
                                          onClick={() => {
                                            onClose();

                                            toggleSubCategory(subCategory.id);
                                          }}
                                        >
                                          {subCategory.name}
                                        </Link>
                                        {openSubCategory === subCategory.id ? (
                                          <ChevronUp
                                            onClick={() =>
                                              toggleSubCategory(subCategory.id)
                                            }
                                          />
                                        ) : (
                                          <ChevronDown
                                            onClick={() =>
                                              toggleSubCategory(subCategory.id)
                                            }
                                          />
                                        )}
                                      </div>
                                      {openSubCategory === subCategory.id && (
                                        <ul className="mt-2 ml-4 space-y-2">
                                          {subCategory.subCategories.map(
                                            (subSubCategory) => (
                                              <li key={subSubCategory.id}>
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
                                                  onClick={() => {
                                                    onClose();
                                                  }}
                                                  className="block py-1 px-2 text-sm bg-gray-300 dark:bg-gray-600 rounded-lg"
                                                >
                                                  {subSubCategory.name}
                                                </Link>
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      )}
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 mt-4">
                    Loading...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBarSlideOver;
