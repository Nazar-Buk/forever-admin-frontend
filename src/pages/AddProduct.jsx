import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast } from "react-toastify";

import { AdminContext } from "../context/AdminContext";
import { backendUrl } from "../App";
import { addEditProductSchema } from "../utils/validationSchemas";
import BreadCrumbs from "../components/BreadCrumbs";
import Loader from "../components/Loader";
import AddProductForm from "../components/forms/AddProductForm";

let imagesArray = [];

const countOfPictures = (count) => {
  for (let i = 1; i <= count; i++) {
    imagesArray.push(`image${i}`);
  }
};

countOfPictures(7);

const AddProduct = () => {
  const { token } = useContext(AdminContext);
  const [isLoadingState, setIsLoadingState] = useState({
    isLoadingProductData: false,
    isLoadingPictures: false,
  });
  // console.log(token, "token from addproduct");
  // const sizesArray = ["S", "M", "L", "XL", "XXL"];

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

  const { errors, touchedFields, dirtyFields } = formState;

  const onSubmit = async (data) => {
    console.log(data, "data");

    try {
      // new FormData() — це спеціальний об'єкт у JavaScript, який дозволяє створювати та
      // зберігати дані у форматі multipart/form-data. Цей формат використовується для надсилання даних
      // (зокрема, файлів та фото)

      setIsLoadingState((prev) => ({ ...prev, isLoadingProductData: true }));

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
        setIsLoadingState((prev) => ({ ...prev, isLoadingProductData: false }));

        toast.success(response.data.message);
        reset();
      } else {
        setIsLoadingState((prev) => ({ ...prev, isLoadingProductData: false }));

        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      setIsLoadingState((prev) => ({ ...prev, isLoadingProductData: false }));

      toast.error(error);
    }
  };

  const removeImage = (e, index) => {
    e.preventDefault();

    const updatedImages = [...(getValues("images") || [])];
    updatedImages[index] = null;

    setValue("images", updatedImages, { shouldValidate: true });
  };

  const isLoading =
    isLoadingState.isLoadingProductData || isLoadingState.isLoadingPictures;

  return (
    <section className="add-product">
      {isLoading && <Loader />}
      <BreadCrumbs>{[<span key={0}>Add Product</span>]}</BreadCrumbs>
      <AddProductForm
        register={register}
        handleSubmit={handleSubmit}
        watch={watch}
        errors={errors}
        touchedFields={touchedFields}
        dirtyFields={dirtyFields}
        onSubmit={onSubmit}
        removeImage={removeImage}
        imagesArray={imagesArray}
        getValues={getValues}
        setValue={setValue}
        setIsLoadingState={setIsLoadingState}
      />

      <DevTool control={control} />
    </section>
  );
};

export default AddProduct;
