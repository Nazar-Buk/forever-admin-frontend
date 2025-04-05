import { useContext } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

import { AdminContext } from "../context/AdminContext";
import { assets } from "../admin_assets/assets";
import { backendUrl } from "../App";
import BreadCrumbs from "../components/BreadCrumbs";

const addProductSchema = yup.object({
  // image1: yup.boolean(),
  // image2: yup.boolean(),
  // image3: yup.boolean(),
  // image4: yup.boolean(),
  images: yup.array().of(yup.mixed().nullable()),
  name: yup.string().required("This field is required!"),
  description: yup.string().required("This field is required!"),
  category: yup.string().required("Choose the category"),
  subCategory: yup.string().required("Choose the sub-category"),
  price: yup
    .number()
    .typeError("The price must be a number!")
    .min(1)
    .positive("Use only positive numbers")
    .required("Add product price"),
  sizes: yup
    .array()
    .of(yup.string())
    .min(1, "Please select at least one size!"),
  bestseller: yup.boolean(),
});

let imagesArray = [];

const countOfPictures = (count) => {
  for (let i = 1; i <= count; i++) {
    imagesArray.push(`image${i}`);
  }
};

countOfPictures(4);

const AddProduct = () => {
  const { token } = useContext(AdminContext);
  // console.log(token, "token from addproduct");
  const sizesArray = ["S", "M", "L", "XL", "XXL"];

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
    resolver: yupResolver(addProductSchema),
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

  const { errors, touchedFields, dirtyFields } = formState;

  const onSubmit = async (data) => {
    console.log(data, "data");

    try {
      // new FormData() — це спеціальний об'єкт у JavaScript, який дозволяє створювати та
      // зберігати дані у форматі multipart/form-data. Цей формат використовується для надсилання даних
      // (зокрема, файлів та фото)

      const formData = new FormData();
      formData.append("name", data.name); // "name" - це назва ключа, data.name - це значення
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("subCategory", data.subCategory);
      formData.append("price", data.price);
      formData.append("bestseller", data.bestseller);

      formData.append("sizes", JSON.stringify(data.sizes)); // бо sizes - це масив, а масиви не можна відправити через FormData

      // так додавати файли в FormData
      data.images.forEach((file, ind) => {
        formData.append(`images[${ind}]`, file);
      });

      // так можна переглянути те що в formData, тут forEach працює специфічно, тому що це не звичайний об'єкт
      // formData.forEach((value, key) => {
      //   console.log(key, value, "-->key, value");
      // });

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );
      console.log(response, "response");

      if (response.data.success) {
        toast.success(response.data.message);
        reset();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error);
    }
  };

  const removeImage = (e, index) => {
    e.preventDefault();

    const updatedImages = [...(getValues("images") || [])];
    updatedImages[index] = null;

    setValue("images", updatedImages, { shouldValidate: true });
  };

  return (
    <section className="add-product">
      <BreadCrumbs>{[<span key={0}>Edit Product</span>]}</BreadCrumbs>
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
              {...register("price")}
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
                        : currentSizes.filter((size) => size != item)
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
      <DevTool control={control} />
    </section>
  );
};

export default AddProduct;
