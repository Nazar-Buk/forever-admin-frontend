import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast } from "react-toastify";
import isEqual from "lodash/isEqual"; // lodash ця фігня вміє порівнювати масиви та обєкти на глибину
import heic2any from "heic2any"; // для конвертації heic в jpg

import { AdminContext } from "../context/AdminContext";
import { assets } from "../admin_assets/assets";
import { backendUrl } from "../App";
import { addEditProductSchema } from "../utils/validationSchemas";
import BreadCrumbs from "../components/BreadCrumbs";
import Loader from "../components/Loader";

let imagesArray = [];

const countOfPictures = (count) => {
  for (let i = 1; i <= count; i++) {
    imagesArray.push(`image${i}`);
  }
};

countOfPictures(7);

const EditProduct = () => {
  const sizesArray = ["S", "M", "L", "XL", "XXL"];
  const { token } = useContext(AdminContext);
  const navigate = useNavigate();
  const { productId } = useParams();

  const [initialData, setInitialData] = useState({});
  const [isLoadingState, setIsLoadingState] = useState({
    isLoadingProductData: true,
    isLoadingCategory: true,
    isLoadingPictures: false,
  });
  const [imgForDelete, setImgForDelete] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const fetchPageData = async () => {
    try {
      // load categories
      setIsLoadingState((prev) => ({ ...prev, isLoadingCategory: true }));
      const responseCategories = await axios.get(
        backendUrl + "/api/category/list"
      );

      if (responseCategories.data.success) {
        setCategoryData(responseCategories.data.allCategories);
        setIsLoadingState((prev) => ({
          ...prev,
          isLoadingCategory: false,
        }));
      } else {
        setIsLoadingState((prev) => ({
          ...prev,
          isLoadingCategory: false,
        }));

        toast.error(response.data.message);
      }

      // load product
      setIsLoadingState((prev) => ({ ...prev, isLoadingProductData: true }));

      const responseProduct = await axios.post(
        backendUrl + "/api/product/single",
        { productId },
        { headers: { token } }
      );

      if (responseProduct.data.success) {
        const product = responseProduct.data.product;
        setInitialData(product);
        reset(product);
        setIsLoadingState((prev) => ({ ...prev, isLoadingProductData: false }));
      }
    } catch (error) {
      setIsLoadingState((prev) => ({
        ...prev,
        isLoadingCategory: false,
        isLoadingProductData: false,
      }));

      console.log(error, "error");
      toast.error(error.message);
    } finally {
      setIsLoadingState((prev) => ({
        ...prev,
        isLoadingCategory: false,
        isLoadingProductData: false,
      }));
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const form = useForm({
    defaultValues: {
      images: [],
      name: "",
      description: "",
      category: "",
      subCategory: "",
      price: "",
      sizes: [],
      bestseller: false,
    },
    resolver: yupResolver(addEditProductSchema),
  });

  const {
    register,
    control,
    handleSubmit,
    formState,
    getValues,
    setValue,
    watch,
    reset,
    clearErrors,
    trigger,
  } = form;

  const { errors, touchedFields, dirtyFields, isSubmitting, isValid, isDirty } =
    formState;

  const getChangedFields = () => {
    const currentValues = getValues();
    const updatedFields = {};

    // Перевіряємо кожне поле на зміну, бо відправляти я планую лише змінені поля
    for (const key in currentValues) {
      if (Array.isArray(currentValues[key])) {
        const isArrayEqual = isEqual(currentValues[key], initialData[key]);

        isArrayEqual ? null : (updatedFields[key] = currentValues[key]); // Додаємо лише змінені поля в даному випадку масив
      } else if (initialData[key] !== currentValues[key]) {
        // порівнюю велюси і ті які не сходяться записую в новий обєкт
        updatedFields[key] = currentValues[key]; // Додаємо лише змінені поля
      }
    }

    return updatedFields;
  };

  const onSubmit = async () => {
    const updatedFields = getChangedFields();

    try {
      // new FormData() — це спеціальний об'єкт у JavaScript, який дозволяє створювати та
      // зберігати дані у форматі multipart/form-data. Цей формат використовується для надсилання даних
      // (зокрема, файлів та фото)

      const formData = new FormData();

      for (const key in updatedFields) {
        if (key === "images") {
          // так додавати файли в FormData

          const isAllElementsFalse = updatedFields["images"].every(
            (item) => !item
          );

          if (isAllElementsFalse) {
            formData.append(`images`, JSON.stringify([]));
          } else {
            //Приклад formData для стрічок та файлів що записуються по одному
            // formData.append(`images`, imageData); // записую в formData в масив images дані (файли та стрічки) по одному,
            // УВАГА!!! якщо буде об'єкт то formData запище [object Object] і буде помилка

            const onlyImagesData = updatedFields[key].filter((item) => {
              if (item) {
                if (item instanceof File) {
                  formData.append(`images`, item); // так записуться файл
                } else {
                  return item;
                }
              }
            });

            formData.append(`images`, JSON.stringify(onlyImagesData)); // так записується масив з об'єктами
          }
        } else if (
          Array.isArray(updatedFields[key]) ||
          Object.prototype.toString.call(updatedFields[key]) ===
            "[object Object]"
        ) {
          // я тут ЗНАЮ (але не перевіряю) що якщо масив є зі стрічок, якщо ти незнаєш з чого масив, то роби як з "images"
          // Object.prototype.toString.call(updatedFields[key]) === '[object Object]' -- перевіряю чи це справді обєкт
          formData.append(key, JSON.stringify(updatedFields[key])); // бо sizes - це масив стрічок, а масиви не можна відправити через FormData
        } else {
          formData.append(key, updatedFields[key]);
        }
      }

      //   так можна переглянути те що в formData, тут forEach працює специфічно, тому що це не звичайний об'єкт
      // formData.forEach((value, key) => {
      //   console.log(key, value, "-->key, value");
      // });

      const isProductChanged = !!Object.keys(updatedFields).length; //Object.keys(updatedFields) повертає масив ключів. Якщо довжина масиву 0, то об'єкт порожній.

      if (isProductChanged) {
        setIsLoadingState((prev) => ({ ...prev, isLoadingProductData: true }));

        const response = await axios.patch(
          backendUrl + `/api/product/update/${productId}`, // ${productId} отримуй на беку із req.params
          formData,
          {
            headers: { token },
            params: { imgForDelete: JSON.stringify(imgForDelete) }, // коли треба відправити додаткові параметри і ти не хочеш мішати їх із формою,
            // на беку витягай params з req.query
          }
        );

        if (response.data.success) {
          setIsLoadingState((prev) => ({
            ...prev,
            isLoadingProductData: false,
          }));

          toast.success(response.data.message);
          setImgForDelete([]);
          navigate("/list");
        } else {
          toast.error(response.data.message);
          setIsLoadingState((prev) => ({
            ...prev,
            isLoadingProductData: false,
          }));
        }
      }
    } catch (error) {
      setIsLoadingState((prev) => ({ ...prev, isLoadingProductData: false }));

      console.log(error, "error");
      toast.error(error);
    }
  };

  const removeImage = (e, index, public_id) => {
    e.preventDefault();

    setImgForDelete((prev) => [...prev, public_id]);
    const updatedImages = [...(getValues("images") || [])];
    updatedImages[index] = null;

    setValue("images", updatedImages, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const selectedCategoryLabel = watch("category");

  const subCategories =
    categoryData.find((item) => item.categoryLabel === selectedCategoryLabel)
      ?.subCategory || [];

  const isLoading =
    isLoadingState.isLoadingProductData ||
    isLoadingState.isLoadingCategory ||
    isLoadingState.isLoadingPictures;

  return (
    <section className="edit-product">
      {isLoading && <Loader />}
      <BreadCrumbs>
        {[
          <Link key={0} to="/list">
            Product List
          </Link>,
          <span key={1}>Edit Product</span>,
        ]}
      </BreadCrumbs>
      <h2 className="page-title">Edit Product</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="edit-product__form"
      >
        <div className="form__upload-img">
          <h2>Upload Image</h2>
          <div className="upload-images-box">
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
                  <img
                    className="photo"
                    src={imageUrl}
                    alt="add product image"
                  />
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
                  border: watch("sizes").includes(item)
                    ? "2px solid orange"
                    : "",
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
      <DevTool control={control} />
    </section>
  );
};

export default EditProduct;
