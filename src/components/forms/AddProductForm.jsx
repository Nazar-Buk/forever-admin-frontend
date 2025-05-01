import { useState, useEffect } from "react";
import heic2any from "heic2any"; // для конвертації heic в jpg
import axios from "axios";
import { toast } from "react-toastify";

import { assets } from "../../admin_assets/assets";

const AddProductForm = (props) => {
  const [categoryData, setCategoryData] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    errors,
    touchedFields,
    dirtyFields,
    onSubmit,
    removeImage,
    imagesArray,
    setValue,
    getValues,
    setIsLoadingState,
    backendUrl,
  } = props;

  const sizesArray = ["S", "M", "L", "XL", "XXL"];

  const fetchCategoryData = async () => {
    try {
      setIsLoadingState((prev) => ({ ...prev, isLoadingCategory: true }));
      const response = await axios.get(backendUrl + "/api/category/list");
      if (response.data.success) {
        setCategoryData(response.data.allCategories);
        setIsLoadingState((prev) => ({
          ...prev,
          isLoadingCategory: false,
        }));

        toast.success(response.data.message);
      } else {
        setIsLoadingState((prev) => ({
          ...prev,
          isLoadingCategory: false,
        }));

        toast.error(response.data.message);
      }
    } catch (error) {
      setIsLoadingState((prev) => ({ ...prev, isLoadingCategory: false }));

      console.log(error, "error");
      toast.error(error.message);
    }
  };

  const selectedCategoryLabel = watch("category");

  const subCategories =
    categoryData.find((item) => item.categoryLabel === selectedCategoryLabel)
      ?.subCategory || [];

  useEffect(() => {
    fetchCategoryData();
  }, []);

  useEffect(() => {
    setValue("subCategory", ""); // коли міняю категорію то підкатегорія має стати пустою
  }, [selectedCategoryLabel]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="add-product__form"
    >
      <div className="form__upload-img">
        <h2>Upload Image</h2>
        <div className="upload-images-box">
          {imagesArray.map((_, index) => {
            const currentImages = watch("images") || [];
            const imageFile = currentImages[index] || null;
            const imageUrl = imageFile
              ? URL.createObjectURL(imageFile)
              : assets.upload_area;

            return (
              <label
                key={index}
                htmlFor={`image${index + 1}`}
                className="image-label"
              >
                {imageFile && (
                  <div
                    onClick={(e) => {
                      removeImage(e, index);
                    }}
                    className="delete-img"
                  >
                    <img src={assets.cross_icon} alt="delete image icon" />
                  </div>
                )}
                <img className="photo" src={imageUrl} alt="add product image" />
                <input
                  type="file"
                  accept="image/*" // accept="image/*" - дозволяє вибирати тільки картинки
                  // accept=".jpg, .png, .gif"> -- дозволяє вибирати тільки картинки з розширеннями jpg, png, gif
                  id={`image${index + 1}`}
                  {...register("images")}
                  onChange={async (e) => {
                    const file = e.target.files[0];

                    if (file) {
                      const updatedImages = [...(getValues("images") || [])]; // тут () вказують на пріорітетність виконання

                      // Виявилося що айфон робить свій тив картинки ітреба переробити його в jpg, бо він зрозумілий для браузера
                      if (
                        file.type === "image/heic" ||
                        file.type === "image/heif"
                      ) {
                        try {
                          setIsLoadingState((prev) => ({
                            ...prev,
                            isLoadingPictures: true,
                          }));

                          const convertedBlob = await heic2any({
                            blob: file,
                            toType: "image/jpeg",
                            quality: 0.9, // 90% якості
                          });

                          // Створюємо новий файл на базі конвертованого Blob
                          const convertedFile = new File(
                            [convertedBlob],
                            file.name.replace(/\.[^/.]+$/, ".jpg"),
                            {
                              type: "image/jpeg",
                            }
                          );

                          updatedImages[index] = convertedFile; // тут я присвоюю значення конкретного файлу в масив картинок, тотбо  картинка відслідковується по індексу
                          setIsLoadingState((prev) => ({
                            ...prev,
                            isLoadingPictures: false,
                          }));
                        } catch (error) {
                          console.log(error, "error");
                          setIsLoadingState((prev) => ({
                            ...prev,
                            isLoadingPictures: false,
                          }));
                        }
                      } else {
                        updatedImages[index] = file; // тут я присвоюю значення конкретного файлу в масив картинок, тотбо  картинка відслідковується по індексу
                        setIsLoadingState((prev) => ({
                          ...prev,
                          isLoadingPictures: false,
                        }));
                      }

                      setValue("images", updatedImages, {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
                <p className="error">{errors.images?.[index]?.message}</p>
              </label>
            );
          })}
        </div>
      </div>
      <div className="form__product-name">
        <h2>Product Name</h2>
        <input
          className="product-name"
          type="text"
          placeholder="Type product name"
          {...register("name")}
        />
        <p className="error">{errors.name?.message}</p>
      </div>
      <div className="form__product-desc">
        <h2>Product Description</h2>
        <textarea
          className="product-area"
          placeholder="Type product description"
          rows="10"
          {...register("description")}
        ></textarea>
        <p className="error">{errors.description?.message}</p>
      </div>

      <div className="form__category-box">
        <div className="category">
          <h2>Product Category</h2>
          <select id="category" {...register("category")}>
            <option value="" defaultValue className="category__item">
              Choose Category
            </option>
            {categoryData?.map((item) => (
              <option
                key={item._id}
                value={item.categoryLabel}
                className="category__item"
              >
                {item.categoryLabel}
              </option>
            ))}
          </select>
          <p className="error">{errors.category?.message}</p>
        </div>
        <div className="subcategory">
          <h2>Sub Category</h2>
          <select
            id="sub-category"
            {...register("subCategory")}
            disabled={!selectedCategoryLabel}
          >
            <option value="" defaultValue>
              Choose Sub-Category
            </option>
            {subCategories?.map((item, ind) => (
              <option
                key={ind}
                value={item.subCategoryLabel}
                className="subcategory__item"
              >
                {item.subCategoryLabel}
              </option>
            ))}
          </select>
          <p className="error">{errors.subCategory?.message}</p>
        </div>
        <div className="price">
          <h2>Product Price</h2>
          <input type="number" placeholder="Add price" {...register("price")} />
          <p className="error">{errors.price?.message}</p>
        </div>
      </div>
      <div className="form__product-size-box">
        <h2>Product Sizes</h2>
        <div className="sizes-box">
          {sizesArray.map((item, index) => (
            <label
              key={index}
              style={{
                border: watch("sizes").includes(item) ? "2px solid orange" : "",
              }}
              className="size"
            >
              <input
                className="size-checkbox"
                type="checkbox"
                {...register("sizes")}
                checked={watch("sizes")?.includes(item)} // це піздєц як важливо, бо checked завжди буде true
                onChange={(e) => {
                  const { checked } = e.target;
                  const currentSizes = getValues("sizes") || [];
                  setValue(
                    "sizes",
                    checked
                      ? [...currentSizes, item]
                      : currentSizes.filter((size) => size != item),
                    { shouldDirty: true }
                  );
                }}
              />

              <div>{item}</div>
            </label>
          ))}
        </div>
        <p className="error">{errors.sizes?.message}</p>
      </div>
      <div className="form__bestseller-box">
        <label className="bestseller">
          <input type="checkbox" {...register("bestseller")} />
          <p>Add to bestseller</p>
        </label>
      </div>

      <button type="submit">ADD</button>
    </form>
  );
};

export default AddProductForm;
