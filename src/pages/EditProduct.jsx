import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast } from "react-toastify";
import isEqual from "lodash/isEqual"; // lodash ця фігня вміє порівнювати масиви та обєкти на глибину

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
  const [isLoading, setIsLoading] = useState(true);
  const [imgForDelete, setImgForDelete] = useState([]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        backendUrl + "/api/product/single",
        { productId },
        { headers: { token } }
      );

      if (response.data.success) {
        const product = response.data.product;
        setInitialData(product);
        reset(product);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error, "error from fetchProduct");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const form = useForm({
    defaultValues: {
      images: [],
      name: "",
      description: "",
      category: "Women",
      subCategory: "Topwear",
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
        setIsLoading(true);

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
          setIsLoading(false);

          toast.success(response.data.message);
          setImgForDelete([]);
          navigate("/list");
        } else {
          toast.error(response.data.message);
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);

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
                    onChange={(e) => {
                      const file = e.target.files[0];

                      if (file) {
                        const updatedImages = [...(getValues("images") || [])]; // тут () вказують на пріорітетність виконання
                        updatedImages[index] = file; // тут я присвоюю значення конкретного файлу в масив картинок, тотбо  картинка відслідковується по індексу

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
            <select id="category" {...register("category")}>
              <option value="Men" className="category__item">
                Men
              </option>
              <option value="Women" className="category__item">
                Women
              </option>
              <option value="Kids" className="category__item">
                Kids
              </option>
            </select>
            <p className="error">{errors.category?.message}</p>
          </div>
          <div className="subcategory">
            <h2>Sub Category</h2>
            <select id="sub-category" {...register("subCategory")}>
              <option value="Bottomwear" className="subcategory__item">
                Bottom wear
              </option>
              <option value="Topwear" className="subcategory__item">
                Top wear
              </option>
              <option value="Winterwear" className="subcategory__item">
                Winter wear
              </option>
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
              fetchProduct();
              setImgForDelete([]);
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
