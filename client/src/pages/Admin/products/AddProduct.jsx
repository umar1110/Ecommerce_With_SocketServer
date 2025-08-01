import { Input } from "@/components/ui/input";
import axiosBackend from "@/utils/axiosInstanceBackend";
import JoditEditor from "jodit-react";
import { BadgeX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function AddProduct() {
  const descriptionRef = useRef();
  const [description, setdescription] = useState("");
  const [title, settitle] = useState("");
  const [costPrice, setcostPrice] = useState("");
  const [salePrice, setsalePrice] = useState("");
  const [isFeatured, setisFeatured] = useState(true);
  const [beforeDiscountPrice, setbeforeDiscountPrice] = useState(0);
  const [mainCategories, setmainCategories] = useState([]);
  const [categories, setcategories] = useState([]);
  const [subCategories, setsubCategories] = useState([]);
  const [stock, setstock] = useState(0);
  const [features, setfeatures] = useState([]);
  const [images, setimages] = useState([]);
  const [smallDescription, setsmallDescription] = useState("");
  const [imagesPreview, setimagesPreview] = useState([]);
  const [isdiscount, setisdiscount] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Fetched data
  const {
    mainCategories: mainCategoriesData,
    categories: categoriesData,
    subCategories: subCategoriesData,
    mainCategoriesLoading,
    categoriesLoading,
    subCategoriesLoading,
  } = useSelector((state) => state.categories);

  const handleMainCategoryCheckboxChange = (category) => {
    setmainCategories((prevSelected) => {
      if (prevSelected.some((cat) => cat === category)) {
        // If already selected, remove from the list
        return prevSelected.filter((cat) => cat !== category);
      } else {
        // Otherwise, add to the list
        return [...prevSelected, category];
      }
    });
  };

  const handleCategoryCheckboxChange = (category) => {
    setcategories((prevSelected) => {
      if (prevSelected.some((cat) => cat === category)) {
        // If already selected, remove from the list
        return prevSelected.filter((cat) => cat !== category);
      } else {
        // Otherwise, add to the list
        return [...prevSelected, category];
      }
    });
  };

  const handleSubCategoryCheckboxChange = (category) => {
    setsubCategories((prevSelected) => {
      if (prevSelected.some((cat) => cat === category)) {
        // If already selected, remove from the list
        return prevSelected.filter((cat) => cat !== category);
      } else {
        // Otherwise, add to the list
        return [...prevSelected, category];
      }
    });
  };

  const descriptionPlaceholder = "Enter you product's features here ......";
  const descriptionJoditConfig = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder:
        descriptionPlaceholder || "Enter you product's features here ......",
      height: 500,
    }),
    [descriptionPlaceholder]
  );

  //  Getting image files and setting
  const handleImageDelete = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setimages(newImages);
    const newPreviewImages = imagesPreview.filter((_, i) => i !== index);
    setimagesPreview(newPreviewImages);
  };
  const handleImageFiles = (files) => {
    if (files.length < 1) {
      return;
    }

    if (files) {
      const newImages = [];
      const newImagesPreview = [];

      const readFile = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.readyState === 2 && reader.result) {
              resolve({ file, imageUrl: reader.result });
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      Promise.all(Array.from(files).map((file) => readFile(file)))
        .then((results) => {
          results.forEach((result) => {
            newImages.push(result.file);
            newImagesPreview.push(result.imageUrl);
          });

          setimages(newImages);
          setimagesPreview((prevImages) => [
            ...prevImages,
            ...newImagesPreview,
          ]);
        })
        .catch((error) => {
          console.error("Error reading files:", error);
        });
    }
  };
  const handleFileChange = (e) => {
    const files = e.target.files;

    handleImageFiles(files);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleImageFiles(droppedFiles);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  //  Handling order of image files
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(images);
    const reorderedPreviews = Array.from(imagesPreview);
    const [removedImage] = reorderedImages.splice(result.source.index, 1);
    const [removedPreview] = reorderedPreviews.splice(result.source.index, 1);

    reorderedImages.splice(result.destination.index, 0, removedImage);
    reorderedPreviews.splice(result.destination.index, 0, removedPreview);

    setimages(reorderedImages);
    setimagesPreview(reorderedPreviews);
  };

  const handleAddProductRequest = async (formData) => {
    toast.loading("Adding product ...");
    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const response = await axiosBackend.post("/api/v1/product", formData, {
        ...config,
        withCredentials: true,
      });
      toast.dismiss();
      toast.success("Product added successfully");
      console.log("Product added successfully", response.data);
      // Clear all states
      settitle("");
      setcostPrice("");
      setsalePrice("");
      setisFeatured(false);
      setbeforeDiscountPrice(0);
      setmainCategories([]);
      setcategories([]);
      setsubCategories([]);
      setsmallDescription("");
      setstock(0);
      setfeatures([]);
      setimages([]);
      setimagesPreview([]);
      setisdiscount(false);
      setdescription("");
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Something went wrong");

      console.error("Error adding Product:", error.message);
    }
  };
  const handleAddButton = async (e) => {
    e.preventDefault();
    // Data cleaning
    if (
      !title ||
      !costPrice ||
      !salePrice ||
      !stock ||
      !smallDescription ||
      !description
    ) {
      console.log(
        title,
        costPrice,
        salePrice,
        stock,
        description,
        smallDescription
      );
      return toast.error("Please fill all required fields");
    }

    if (isdiscount && !beforeDiscountPrice) {
      return toast.error("Please enter before discount price");
    }

    if (!mainCategories.length) {
      return toast.error("Please select main categories");
    }

    // Remove empty features or its values
    const cleanedFeatures = features.filter((feature) => {
      if (feature.feature.trim() === "" || feature.values.length === 0)
        return false;
      feature.values = feature.values.filter(
        (value) => value.value && value.stock
      );
      return true;
    });

    const formData = new FormData();
    formData.append("title", title);
    formData.append("costPrice", costPrice);
    formData.append("salePrice", salePrice);
    formData.append("isFeatured", isFeatured);
    formData.append("smallDescription", smallDescription);
    if (isdiscount) {
      formData.append("beforeDiscountPrice", beforeDiscountPrice);
    }
    formData.append("mainCategories", JSON.stringify(mainCategories));
    formData.append("categories", JSON.stringify(categories));
    formData.append("subCategories", JSON.stringify(subCategories));
    formData.append("stock", stock);
    formData.append("features", JSON.stringify(cleanedFeatures));

    formData.append("description", description);

    //  Appending images
    images.forEach((image) => {
      formData.append("productImages", image);
    });

    await handleAddProductRequest(formData);
  };

  useEffect(() => {}, [
    mainCategoriesLoading,
    categoriesLoading,
    subCategoriesLoading,
  ]);
  return (
    <form onSubmit={handleAddButton} className="overflow-x-auto space-y-10">
      {/* Title */}
      <div className="md:mx-5">
        <label htmlFor="title" className="text-2xl">
          Title :
        </label>
        <Input
          type="text"
          placeholder="Enter product title"
          id="title"
          required
          className="w-full border-2 border-gray-400 p-2"
          value={title}
          onChange={(e) => settitle(e.target.value)}
        />
      </div>
      {/* Cost and sale price  */}
      <div className="md:mx-5 flex space-x-5">
        <div>
          <label htmlFor="costPrice" className="text-xl">
            Cost Price : (Rs)
          </label>
          <Input
            placeholder="00000"
            type="number"
            required
            onWheel={(e) => e.target.blur()}
            id="costPrice"
            className="w-full border-2 border-gray-400 p-2"
            value={costPrice}
            onChange={(e) => setcostPrice(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="salePrice" className="text-xl">
            Sale Price : (Rs)
          </label>
          <Input
            type="number"
            placeholder="00000"
            required
            id="salePrice"
            onWheel={(e) => e.target.blur()}
            className="w-full border-2 border-gray-400 p-2"
            value={salePrice}
            onChange={(e) => setsalePrice(e.target.value)}
          />
        </div>
      </div>
      {/*  Want discount ?   */}
      <div className="md:mx-5 flex space-x-5">
        <label htmlFor=""> Mention Discount ? </label>
        <input
          type="checkbox"
          value={isdiscount}
          onChange={(e) => setisdiscount(e.target.checked)}
        />
      </div>
      {/* If discount than get percentage or discount price */}

      {isdiscount && (
        <div className="md:mx-5 flex space-x-5">
          <div>
            <label htmlFor="beforeDiscountPrice" className="text-xl">
              Before Discount Price : (Rs)
            </label>
            <Input
              required={isdiscount}
              type="number"
              onWheel={(e) => e.target.blur()}
              placeholder="00000"
              id="beforeDiscountPrice"
              className="w-full border-2 border-gray-400 p-2"
              value={beforeDiscountPrice}
              onChange={(e) => setbeforeDiscountPrice(e.target.value)}
            />
          </div>
        </div>
      )}
      {/* Total Stock */}
      <div className="md:mx-5 max-w-[300px]">
        <label htmlFor="stock" className="text-xl">
          Total Stock :
        </label>
        <Input
          required
          type="number"
          placeholder="0000"
          onWheel={(e) => e.target.blur()}
          id="stock"
          className="w-full border-2 border-gray-400 p-2"
          value={stock}
          onChange={(e) => setstock(e.target.value)}
        />
      </div>

      {/* Select Main Categories List*/}
      <div className="md:mx-5 max-w-screen-xl ">
        <label htmlFor=""> Select Main categories : </label>
        <div
          style={{ listStyleType: "disc" }}
          className=" min-h-40 border-gray-600 border-2 p-2 px-7  "
        >
          {!mainCategoriesLoading && mainCategoriesData.length > 0 ? (
            <>
              <ul
                className=" flex flex-wrap gap-2 "
                style={{ listStyleType: "none", padding: 0 }}
              >
                {mainCategoriesData.map((category) => (
                  <li key={category._id}>
                    <label>
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleMainCategoryCheckboxChange(category._id)
                        }
                        checked={mainCategories.some(
                          (cat) => cat === category._id
                        )}
                      />
                      <span className="mx-2">{category.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div> No main categories selected </div>
          )}
        </div>
      </div>
      {/* Select categories List */}
      <div className="md:mx-5 max-w-screen-xl">
        <label htmlFor=""> Select Categories : </label>
        <div
          style={{ listStyleType: "disc" }}
          className=" min-h-40 border-gray-600 border-2 p-2 px-7  "
        >
          {!categoriesLoading && categoriesData.length > 0 ? (
            <>
              <ul
                className=" flex flex-wrap gap-2 "
                style={{ listStyleType: "none", padding: 0 }}
              >
                {categoriesData.map((category) => (
                  <li key={category._id}>
                    <label>
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleCategoryCheckboxChange(category._id)
                        }
                        checked={categories.some((cat) => cat === category._id)}
                      />
                      <span className="mx-2">{category.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div> No categories selected </div>
          )}
        </div>
      </div>
      {/* Select SubCategpries */}
      <div className="md:mx-5 max-w-screen-xl">
        <label htmlFor=""> Select Sub Categories : </label>
        <div
          style={{ listStyleType: "disc" }}
          className=" min-h-40 border-gray-600 border-2 p-2 px-7  "
        >
          {!subCategoriesLoading && subCategoriesData.length > 0 ? (
            <>
              <ul
                className=" flex flex-wrap gap-2 "
                style={{ listStyleType: "none", padding: 0 }}
              >
                {subCategoriesData.map((category) => (
                  <li key={category._id}>
                    <label>
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleSubCategoryCheckboxChange(category._id)
                        }
                        checked={subCategories.some(
                          (cat) => cat === category._id
                        )}
                      />
                      <span className="mx-2">{category.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div> No sub categories selected </div>
          )}
        </div>
      </div>
      {/* Small Description */}
      <div className="md:mx-5 max-w-2xl ">
        <label htmlFor="title" className="text-2xl">
          Small Bio Description:{" "}
          <span className="text-sm ml-3">(Character limit : 400)</span>
        </label>
        <textarea
          type="text"
          placeholder="Enter product Small Description"
          id="smallDescription"
          required
          className="w-full border-2 text-black border-gray-400 p-2"
          value={smallDescription}
          maxLength={400}
          onChange={(e) => setsmallDescription(e.target.value)}
        />
      </div>
      {/* Description */}
      <div className="md:mx-5 max-w-screen-xl">
        <div className="text-2xl text-center my-4 underline ">
          Description :
        </div>
        <JoditEditor
          ref={descriptionRef}
          value={description || ""}
          config={descriptionJoditConfig}
          tabIndex={1}
          className="text-black"
          toolbarAdaptive={false}
          onChange={(newContent) => setdescription(newContent)}
          // onBlur={(newContent, editor) => setdescription(editor.getContent())}
        />
      </div>

      {/* Features */}
      <div className="md:mx-5 max-w-screen-xl">
        <div className="text-2xl text-center my-4 underline ">Features</div>
        {features.map((feature, featureIndex) => (
          <div key={featureIndex} className="mb-4">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Feature Name"
                value={feature.feature}
                onChange={(e) => {
                  const newFeatures = [...features];
                  newFeatures[featureIndex].feature = e.target.value;
                  setfeatures(newFeatures);
                }}
                className="w-full border-2 border-gray-400 p-2"
              />
              <button
                type="button"
                onClick={() => {
                  const newFeatures = features.filter(
                    (_, index) => index !== featureIndex
                  );
                  setfeatures(newFeatures);
                }}
                className="bg-red-500 text-white px-2 py-1"
              >
                Remove Feature
              </button>
            </div>
            <div className="ml-4 mt-2">
              {feature.values.map((value, valueIndex) => (
                <div
                  key={valueIndex}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Input
                    type="text"
                    placeholder="Value"
                    value={value.value}
                    onChange={(e) => {
                      const newFeatures = [...features];
                      newFeatures[featureIndex].values[valueIndex].value =
                        e.target.value;
                      setfeatures(newFeatures);
                    }}
                    className="w-full border-2 border-gray-400 p-2"
                  />
                  <Input
                    type="number"
                    onWheel={(e) => e.target.blur()}
                    placeholder="Stock"
                    value={value.stock}
                    onChange={(e) => {
                      const newFeatures = [...features];
                      newFeatures[featureIndex].values[valueIndex].stock =
                        e.target.value;
                      setfeatures(newFeatures);
                    }}
                    className="w-full border-2 border-gray-400 p-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newFeatures = [...features];
                      newFeatures[featureIndex].values = newFeatures[
                        featureIndex
                      ].values.filter((_, index) => index !== valueIndex);
                      setfeatures(newFeatures);
                    }}
                    className="bg-red-500 text-white px-2 py-1"
                  >
                    Remove Value
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newFeatures = [...features];
                  newFeatures[featureIndex].values.push({
                    value: "",
                    stock: "",
                  });
                  setfeatures(newFeatures);
                }}
                className="bg-blue-500 text-white px-2 py-1"
              >
                Add Value
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setfeatures([
              ...features,
              { feature: "", values: [{ value: "", stock: "" }] },
            ])
          }
          className="bg-green-500 text-white px-4 py-2"
        >
          Add Feature
        </button>
      </div>

      {/*Images  */}
      <div className="md:mx-5">
        <div className="text-2xl text-center my-4 underline ">Images</div>
        {/* <input
          type="file"
          multiple
          accept="image/*"
          // onChange={(e) => {
          //   const files = Array.from(e.target.files);
          //   setimages(files);
          //   setimagesPreview(files.map((file) => URL.createObjectURL(file)));
          // }}
          onChange={handleFileChange}
        /> */}
        <div className="flex flex-col  items-center justify-center">
          <label
            htmlFor="filesInput"
            className={`w-full h-48 flex flex-col items-center justify-center border-2 border-dashed  rounded-lg cursor-pointer ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center p-5 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 16V8a4 4 0 014-4h10a4 4 0 014 4v8M16 12l-4-4m0 0l-4 4m4-4v12"
                />
              </svg>
              <p className="text-gray-600">
                Drag & drop your PDF files here, or{" "}
                <span className="text-blue-500 underline">browse</span>
              </p>
            </div>
          </label>

          <input
            type="file"
            name="files"
            required
            id="filesInput"
            accept="image/*"
            multiple
            className="absolute opacity-0 "
            onChange={handleFileChange}
          />
        </div>
        {/* Previous images preview */}
        {/* <div className="flex space-x-2 mt-2">
          {imagesPreview.map((image, index) => (
            <div key={index} className="h-40 w-40 relative">
              <img
                src={image}
                alt="product"
                className="w-full h-full object-cover"
              />
              <button
                className="absolute -top-[0px] bg-red-400 rounded-lg  p-1 right-0"
                onClick={() => handleImageDelete(index)}
              >
                <BadgeX />
              </button>
            </div>
          ))}
        </div> */}

        {/* Dragable images previw */}

        <div className="mt-4">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="images">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex space-x-2"
                >
                  {imagesPreview.map((image, index) => (
                    <Draggable
                      key={index}
                      draggableId={`image-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="h-40 w-40 relative"
                        >
                          <img
                            src={image}
                            alt="product"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            className="absolute -top-[0px] bg-red-400 rounded-lg p-1 right-0"
                            onClick={() => handleImageDelete(index)}
                          >
                            <BadgeX />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <button
          type="button"
          onClick={() => {
            setimages([]);
            setimagesPreview([]);
          }}
          className="bg-red-500 mt-4 text-white px-4 py-2"
        >
          Remove Images
        </button>
      </div>

      {/* Feature or not */}
      <div className="md:mx-5 flex space-x-5">
        <label htmlFor=""> Is Featured on Home page ? </label>
        <input
          type="checkbox"
          checked={isFeatured}
          value={isFeatured}
          onChange={(e) => setisFeatured(e.target.checked)}
        />
      </div>

      {/*  Add button */}

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 w-full text-center rounded-xl py-4  text-white px-4  "
      >
        Add Product
      </button>
    </form>
  );
}

export default AddProduct;
