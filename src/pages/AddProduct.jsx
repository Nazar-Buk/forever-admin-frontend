import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { AdminContext } from "../context/AdminContext";
import { assets } from "../admin_assets/assets";

const addProductSchema = yup.object({
  image1: yup.boolean(),
  image2: yup.boolean(),
  image3: yup.boolean(),
  image4: yup.boolean(),
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

const AddProduct = () => {
  const { token } = useContext(AdminContext);
  // console.log(token, "token from addproduct");
  const sizesArray = ["S", "M", "L", "XL", "XXL"];

  const form = useForm({
    defaultValues: {
      image1: false,
      image2: false,
      image3: false,
      image4: false,
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
  } = form;

  const { errors, touchedFields, dirtyFields } = formState;

  const onSubmit = (data) => {
    console.log(data, "data");
  };
  console.log(watch("sizes"), "sho tse");

  return (
    <section className="add-product">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="add-product__form"
      >
        <div className="form__upload-img">
          <h2>Upload Image</h2>
          <div className="upload-images-box">
            <label htmlFor="image1" className="image-label">
              <img src={assets.upload_area} alt="add product image" />
              <input type="file" id="image1" {...register("image1")} />
              <p className="error">{errors.image1?.message}</p>
            </label>
            <label htmlFor="image2" className="image-label">
              <img src={assets.upload_area} alt="add product image" />
              <input type="file" id="image2" {...register("image2")} />
              <p className="error">{errors.image2?.message}</p>
            </label>
            <label htmlFor="image3" className="image-label">
              <img src={assets.upload_area} alt="add product image" />
              <input type="file" id="image3" {...register("image3")} />
              <p className="error">{errors.image3?.message}</p>
            </label>
            <label htmlFor="image4" className="image-label">
              <img src={assets.upload_area} alt="add product image" />
              <input type="file" id="image4" {...register("image4")} />
              <p className="error">{errors.image4?.message}</p>
            </label>
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
                    console.log(checked, "checked");
                    const currentSizes = getValues("sizes") || [];
                    console.log(currentSizes, "currentSizes");
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
