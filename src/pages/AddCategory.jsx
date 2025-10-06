import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast } from "react-toastify";

import { backendUrl } from "../App";
import BreadCrumbs from "../components/BreadCrumbs";
import Loader from "../components/Loader";

const addCategorySchema = yup.object({
  categoryLabel: yup.string().required("Це поле обовʼязкове!"),
  subCategory: yup
    .array()
    .of(
      yup.object({
        value: yup.string(),
      })
    )
    .test(
      "is-unique",
      "Під-категорія повинна бути унікальною! Видаліть дублікати.",
      (values) => {
        const fieldValues = values.map((item) => item.value.trim());
        const uniqueSubCategories = [...new Set(fieldValues)];

        return fieldValues.length === uniqueSubCategories.length;
      }
    ),
});

const AddCategory = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      categoryLabel: "",
      subCategory: [{ value: "" }], // тут має бути об'єкт то піздєц як важливо
    },
    resolver: yupResolver(addCategorySchema),
  });

  const {
    register,
    control,
    handleSubmit,
    formState,

    reset,
  } = form;

  const { errors, touchedFields, dirtyFields } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subCategory",
  });

  // ТРЕБА!!! використовувати useEffect, бо не бачить першого поля
  useEffect(() => {
    if (!fields.length) {
      append({ value: "" }); // додаю порожнє поле
    }
  }, [fields, append]);

  const onSubmit = async (data) => {
    // console.log(data, "data");

    try {
      setIsLoading(true);

      const subCategoryArray = data.subCategory.reduce((acc, current) => {
        if (current.value.trim()) {
          acc.push(current.value.trim());
        }

        return acc;
      }, []);

      const formData = {
        categoryLabel: data.categoryLabel,
        subCategory: subCategoryArray,
      };

      const response = await axios.post(
        backendUrl + "/api/category/add",
        formData
      );

      if (response.data.success) {
        reset();
        setIsLoading(false);
        toast.success(response.data.message);
      } else {
        setIsLoading(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="add-category">
      {isLoading && <Loader />}
      <BreadCrumbs>{[<span key={0}>Додати категорію</span>]}</BreadCrumbs>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="add-category__form"
      >
        <div className="add-category-box">
          <div className="category">
            <h2>Категорія</h2>
            <input
              className="field category-field"
              type="text"
              placeholder="Напишіть категорію"
              {...register("categoryLabel")}
            />
            <p className="error">{errors.categoryLabel?.message}</p>
          </div>
          <div className="sub-category">
            <h2>Під-категорія</h2>

            {fields.map((field, ind) => {
              return (
                <div key={field.id} className="sub-category-field-box">
                  <input
                    className="field sub-category-field"
                    type="text"
                    placeholder="Напишіть під-категорію"
                    {...register(`subCategory[${ind}].value`)}
                  />
                  {fields.length > 1 && (
                    <button
                      className="cross-btn"
                      type="button"
                      onClick={() => remove(ind)}
                    >
                      <svg
                        className="cross-icon"
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 490 490"
                        xmlSpace="preserve"
                      >
                        <polygon
                          points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 
	489.292,457.678 277.331,245.004 489.292,32.337 "
                        />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
            <button
              className="add-btn"
              type="button"
              onClick={() => {
                append({ value: "" });
              }}
            >
              + Додати під-категорію
            </button>
            <p className="error">{errors.subCategory?.message}</p>
          </div>
        </div>
        <button type="submit">Додати</button>
      </form>
      {/* <DevTool control={control} /> */}
    </section>
  );
};

export default AddCategory;
