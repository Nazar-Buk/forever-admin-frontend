import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast } from "react-toastify";
import isEqual from "lodash/isEqual"; // lodash ця фігня вміє порівнювати масиви та обєкти на глибину

import { AdminContext } from "../context/AdminContext";
import { backendUrl } from "../App";
import { addEditProductSchema } from "../utils/validationSchemas";
import BreadCrumbs from "../components/BreadCrumbs";
import Loader from "../components/Loader";
import EditProductForm from "../components/forms/EditProductForm";
import { imagesArray } from "../utils/helpers";

const EditProduct = () => {
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
      <EditProductForm
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        watch={watch}
        register={register}
        getValues={getValues}
        setValue={setValue}
        errors={errors}
        trigger={trigger}
        isSubmitting={isSubmitting}
        isDirty={isDirty}
        reset={reset}
        imagesArray={imagesArray}
        setIsLoadingState={setIsLoadingState}
        removeImage={removeImage}
        categoryData={categoryData}
        subCategories={subCategories}
        selectedCategoryLabel={selectedCategoryLabel}
        setImgForDelete={setImgForDelete}
        initialData={initialData}
      />

      <DevTool control={control} />
    </section>
  );
};

export default EditProduct;
