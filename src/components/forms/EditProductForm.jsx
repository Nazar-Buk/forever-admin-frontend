import React from "react";
import heic2any from "heic2any"; // для конвертації heic в jpg
import EditUploadImagesBox from "./edit_products_form_details/EditUploadImagesBox";

import { sizesArray } from "../../utils/helpers";

const EditProductForm = (props) => {
  const {
    handleSubmit,
    onSubmit,
    setIsLoadingState,
    watch,
    register,
    getValues,
    setValue,
    errors,
    trigger,
    isDirty,
    isSubmitting,
    reset,
    control,
    name,
    categoryData,
    subCategories,
    selectedCategoryLabel,
    setImgForDelete,
    initialData,
  } = props;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="edit-product__form"
    >
      <div className="form__upload-img">
        <h2>Upload Image</h2>
        <EditUploadImagesBox
          control={control}
          name={name}
          setIsLoadingState={setIsLoadingState}
          setImgForDelete={setImgForDelete}
        />
        {/* start Old code  */}
        {/* <div className="upload-images-box">
          {imagesArray.map((_, index) => {
            const currentImagesData = watch("images") || [];
            const imageData = currentImagesData[index] || null;
            let imageUrl;

            if (imageData?.url) {
              imageUrl = imageData.url;
            } else if (imageData instanceof File) {
              imageUrl = URL.createObjectURL(imageData);
            } else {
              imageUrl = assets.upload_area;
            }

            return (
              <label
                key={index}
                htmlFor={`image${index + 1}`}
                className="image-label"
              >
                {imageData && (
                  <div
                    onClick={(e) => {
                      const { public_id } = imageData;
                      removeImage(e, index, public_id);
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
                        shouldDirty: true,
                      });
                    }
                  }}
                />
                <p className="error">{errors.images?.[index]?.message}</p>
              </label>
            );
          })}
        </div> */}
        {/* end Old code  */}
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
          <select
            id="category"
            {...register("category")}
            onChange={(e) => {
              // будь обережний із onChange, useForm їх не любить, треба обовязково сетати це ж поле в ручну через setValue...
              const selectedCategory = e.target.value;
              setValue("category", selectedCategory, {
                shouldValidate: true,
                shouldDirty: true,
              });

              setValue("subCategory", "", {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              }); // коли міняю категорію то підкатегорія має стати пустою
            }}
          >
            <option value="" className="category__item">
              Choose Category
            </option>
            {categoryData?.map((item) => (
              <option
                className="category__item"
                key={item._id}
                value={item.categoryLabel}
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
            onChange={(e) => {
              // будь обережний із onChange, useForm їх не любить, треба обовязково сетати це ж поле в ручну через setValue...
              const selectedSubCategory = e.target.value;
              setValue("subCategory", selectedSubCategory, {
                shouldValidate: true,
                shouldDirty: true,
              });

              // clearErrors("subCategory"); // очищаю помилку в підкатегорії в ручну
              trigger("subCategory"); // підключаю валідацію знову, то все через setValue я маю так мучитися
            }}
          >
            <option value="">Choose Sub-Category</option>
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
          <input
            type="number"
            placeholder="Add price"
            {...register("price", { valueAsNumber: true })} //  { valueAsNumber: true } тепер це передається як число, а то інпути все передають стрічкою
          />
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

      <div className="buttons">
        <button disabled={isSubmitting || !isDirty} type="submit">
          EDIT
        </button>
        <button
          type="button"
          onClick={() => {
            setImgForDelete([]);
            reset(initialData);
          }}
        >
          REVERT EDIT <span className="revert-imoji">🛟</span>
        </button>
      </div>
    </form>
  );
};

export default EditProductForm;
