import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { fetchAllCategories } from "@/redux/slices/categoriesSlice";
import axiosBackend from "@/utils/axiosInstanceBackend";
import { Dot, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
function Categories() {
  const dispatch = useDispatch();
  // States
  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOffer, setIsOffer] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clickedBy, setClickedBy] = useState(0);

  const fetchMainCategoriess = async () => {
    try {
      setLoading(true);

      const { data } = await axiosBackend.get("/api/v1/category/maincategory");

      setMainCategories(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const fetchCategories = async (mainCategoryId) => {
    try {
      setCategoriesLoading(true);
      const { data } = await axiosBackend.put("/api/v1/category/category", {
        mainCategoryId,
      });

      setCategories(data.data);
      setCategoriesLoading(false);
    } catch (error) {
      setCategoriesLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      setSubCategoriesLoading(true);
      const { data } = await axiosBackend.put("/api/v1/category/subcategory", {
        categoryId,
      });

      setSubCategories(data.data);
      setSubCategoriesLoading(false);
    } catch (error) {
      setSubCategoriesLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  //   Handle Add
  const handleAddAnyCategory = async (clickedBy) => {
    try {
      if (clickedBy === 1) {
        const { data } = await axiosBackend.post(
          "/api/v1/category/maincategory",
          {
            name,
            description,
            isOffer,
            isFeatured,
          },
          { withCredentials: true }
        );
        setMainCategories([...mainCategories, data.data]);
      } else if (clickedBy === 2) {
        if (!selectedMainCategory) {
          return toast.error("Please select main category first");
        }
        const { data } = await axiosBackend.post(
          "/api/v1/category/category",
          {
            name,
            description,
            mainCategory: selectedMainCategory,
          },
          {
            withCredentials: true,
          }
        );
        setCategories([...categories, data.data]);
      } else if (clickedBy === 3) {
        if (!selectedCategory) {
          return toast.error("Please select category first");
        }
        const { data } = await axiosBackend.post(
          "/api/v1/category/subcategory",
          {
            name,
            description,
            category: selectedCategory,
          },
          {
            withCredentials: true,
          }
        );
        setSubCategories([...subCategories, data.data]);
      }
      dispatch(fetchAllCategories());
      toast.success("Category added successfully");
      setName("");
      setDescription("");
      setIsOffer(false);
      setIsFeatured(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  //    Handle change of isfeature or isoffer of main category
  const handleMainCategoryChange = async (id, isOffer, isFeatured) => {
    try {
      const { data } = await axiosBackend.put(
        "/api/v1/category/update/maincategory/featured/offer",
        {
          mainCategoryId: id,
          isOffer,
          isFeatured,
        },
        { withCredentials: true }
      );
      const updatedMainCategories = mainCategories.map((mainCategory) => {
        if (mainCategory._id === id) {
          return data.data;
        }
        return mainCategory;
      });
      setMainCategories(updatedMainCategories);
      dispatch(fetchAllCategories());

      toast.success("Main Category updated successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleDeleteMainCategory = async (id) => {
    try {
      await axiosBackend.delete(`/api/v1/category/delete/maincategory/${id}`, {
        withCredentials: true,
      });
      const updatedMainCategories = mainCategories.filter(
        (mainCategory) => mainCategory._id !== id
      );
      dispatch(fetchAllCategories());

      setMainCategories(updatedMainCategories);
      toast.success("Main Category deleted successfully");
      setCategories([]);
      setSubCategories([]);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axiosBackend.delete(`/api/v1/category/delete/category/${id}`, {
        withCredentials: true,
      });
      const updatedCategories = categories.filter(
        (category) => category._id !== id
      );
      setCategories(updatedCategories);
      dispatch(fetchAllCategories());

      toast.success("Category deleted successfully");
      setSubCategories([]);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleDeleteSubCategory = async (id) => {
    try {
      await axiosBackend.delete(`/api/v1/category/delete/subcategory/${id}`, {
        withCredentials: true,
      });
      const updatedSubCategories = subCategories.filter(
        (subCategory) => subCategory._id !== id
      );
      dispatch(fetchAllCategories());

      setSubCategories(updatedSubCategories);
      toast.success("Sub Category deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchMainCategoriess();
  }, []);

  useEffect(() => {
    if (selectedMainCategory && !loading) {
      fetchCategories(selectedMainCategory);
      setSubCategories([]);
    }
  }, [selectedMainCategory]);

  useEffect(() => {
    if (selectedCategory && selectedMainCategory && !categoriesLoading) {
      fetchSubCategories(selectedCategory);
    }
  }, [selectedCategory]);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {clickedBy === 1 && "Add Main Category"}
              {clickedBy === 2 && "Add Category"}
              {clickedBy === 3 && "Add Sub Category"}
            </DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                defaultValue="Pedro Duarte"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="descr" className="text-right">
                Description
              </label>
              <Input
                id="descr"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                defaultValue="Not Required"
                className="col-span-3"
              />
            </div>
            {clickedBy === 1 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="isOffer" className="text-right">
                  Is Offer
                </label>
                <input
                  type="checkbox"
                  id="isOffer"
                  checked={isOffer}
                  onChange={(e) => setIsOffer(e.target.checked)}
                  className="col-span-3"
                />
              </div>
            )}
            {clickedBy === 1 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="isFeatured" className="text-left">
                  Featured
                </label>
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="col-span-3"
                />
              </div>
            )}
            {}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                handleAddAnyCategory(clickedBy);
                setClickedBy(0);
                setIsDialogOpen(false);
              }}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-1 xl:grid-cols-2 w-full gap-4 2xl:grid-cols-3 justify-center">
        {/* Main Categories */}
        <div className="mainCateogires border-2 h-[80vh] overflow-y-auto ">
          <div className="bg-slate-900 dark:bg-slate-300 flex justify-between items-center px-3  mb-2 py-3 dark:text-black text-white font-semibold ">
            <div>Main Categories</div>
            {/* Add button */}
            <Button
              onClick={() => {
                setClickedBy(1);
                setIsDialogOpen(true);
              }}
            >
              Add
            </Button>
          </div>

          <div className=" divide-y-2 ">
            {/* by default selcted is first or no than on click selected maincategory change to its id 
            in buttons or div
            */}

            {!loading ? (
              <>
                {mainCategories.length > 0 ? (
                  mainCategories.map((mainCategory) => (
                    <div key={mainCategory._id}>
                      {selectedMainCategory === mainCategory._id ? (
                        <div
                          className=" py-2 bg-gray-200 
                    text-black px-2 flex justify-between flex-col items-end  "
                        >
                          <div className="flex w-full">
                            <Dot />
                            {mainCategory.name}
                          </div>
                          <div className="flex space-x-2">
                            {/*Checkboxes Input for isFeatured and offer */}

                            <label htmlFor="isOffer" className="text-right">
                              Offer
                            </label>
                            <input
                              onChange={(e) => {
                                handleMainCategoryChange(
                                  mainCategory._id,
                                  e.target.checked,
                                  mainCategory.isFeatured
                                );
                              }}
                              type="checkbox"
                              checked={mainCategory.isOffer}
                            />
                            <label htmlFor="isFeatured" className="text-right">
                              Featured
                            </label>
                            <input
                              onChange={(e) => {
                                handleMainCategoryChange(
                                  mainCategory._id,
                                  mainCategory.isOffer,
                                  e.target.checked
                                );
                              }}
                              type="checkbox"
                              checked={mainCategory.isFeatured}
                            />

                            <Trash
                              onClick={() =>
                                // first confirm by browser confirmer

                                confirm("Are you sure you want to delete") &&
                                handleDeleteMainCategory(mainCategory._id)
                              }
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className=" py-2 px-2 flex justify-between flex-col items-end ">
                          <div
                            onClick={() => {
                              setSelectedMainCategory(mainCategory._id);
                              setSelectedCategory("");
                            }}
                            className="flex w-full cursor-pointer "
                          >
                            <Dot />
                            {mainCategory.name}
                          </div>
                          <div className="flex space-x-2">
                            {/*Checkboxes Input for isFeatured and offer */}

                            <label htmlFor="isOffer" className="text-right">
                              Offer
                            </label>
                            <input
                              onChange={(e) => {
                                handleMainCategoryChange(
                                  mainCategory._id,
                                  e.target.checked,
                                  mainCategory.isFeatured
                                );
                              }}
                              type="checkbox"
                              checked={mainCategory.isOffer}
                            />
                            <label htmlFor="isFeatured" className="text-right">
                              Featured
                            </label>
                            <input
                              onChange={(e) => {
                                handleMainCategoryChange(
                                  mainCategory._id,
                                  mainCategory.isOffer,
                                  e.target.checked
                                );
                              }}
                              type="checkbox"
                              checked={mainCategory.isFeatured}
                            />
                            <Trash
                              onClick={() =>
                                // first confirm by browser confirmer

                                confirm("Are you sure you want to delete") &&
                                handleDeleteMainCategory(mainCategory._id)
                              }
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="my-10 text-center">
                    No Main Category Found
                  </div>
                )}
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        {/* Categories */}
        <div className="border-2 h-[80vh] overflow-y-auto">
          <div className="bg-slate-900 dark:bg-slate-300 flex justify-between items-center px-3  mb-2 py-3 dark:text-black  text-white font-semibold ">
            <div>Categories</div>
            {/* Add button */}
            <Button
              onClick={() => {
                setClickedBy(2);
                setIsDialogOpen(true);
              }}
            >
              Add
            </Button>
          </div>
          <div className=" divide-y-2 ">
            {/* by default selcted is first or no than on click selected maincategory change to its id 
            in buttons or div
            */}

            {!categoriesLoading ? (
              <>
                {categories.length > 0 ? (
                  <>
                    {categories.map((category) => (
                      <div key={category._id}>
                        {selectedCategory === category._id ? (
                          <div className=" py-2 text-black bg-gray-200 px-2 flex justify-between ">
                            <div className="flex">
                              <Dot />
                              {category.name}
                            </div>
                            <Trash
                              onClick={() =>
                                // first confirm by browser confirmer

                                confirm("Are you sure you want to delete") &&
                                handleDeleteCategory(category._id)
                              }
                              className="cursor-pointer"
                            />
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setSelectedCategory(category._id);
                            }}
                            className=" py-2 px-2 flex justify-between "
                          >
                            <div className="flex">
                              <Dot />
                              {category.name}
                            </div>
                            <Trash
                              onClick={() =>
                                // first confirm by browser confirmer

                                confirm("Are you sure you want to delete") &&
                                handleDeleteCategory(category._id)
                              }
                              className="cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="my-10 text-center">No Category Found</div>
                  </>
                )}
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        {/* Subcategories */}
        <div className="border-2 h-[80vh] overflow-y-auto">
          <div className="bg-slate-900 dark:bg-slate-300 flex justify-between items-center px-3  mb-2 py-3 dark:text-black  text-white font-semibold ">
            <div>Sub Categories</div>

            <Button
              onClick={() => {
                setClickedBy(3);
                setIsDialogOpen(true);
              }}
            >
              Add
            </Button>
          </div>{" "}
          <div className=" divide-y-2 ">
            {/* by default selcted is first or no than on click selected maincategory change to its id 
            in buttons or div
            */}

            {!subCategoriesLoading ? (
              <>
                {subCategories.length > 0 ? (
                  <>
                    {subCategories.map((category) => (
                      <div key={category._id}>
                        <div className=" py-2 px-2 flex justify-between ">
                          <div className="flex">
                            <Dot />
                            {category.name}
                          </div>
                          <Trash
                            onClick={() => {
                              confirm("Are you sure you want to delete") &&
                                handleDeleteSubCategory(category._id);
                            }}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="my-10 text-center">No Category Found</div>
                  </>
                )}
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Categories;
