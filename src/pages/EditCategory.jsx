import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import isEqual from "lodash/isEqual";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast } from "react-toastify";

import { backendUrl } from "../App";
import { AdminContext } from "../context/AdminContext";
import BreadCrumbs from "../components/BreadCrumbs";
import Loader from "../components/Loader";

const addCategorySchema = yup.object({
  categoryLabel: yup.string().required("Це поле обовʼязкове!"),
  subCategory: yup
    .array()
    .of(
      yup.object({
        subCategoryLabel: yup.string(),
      })
    )
    .test(
      "is-unique",
      "Під-категорія повинна бути унікальною! Видаліть дублікати.",
      (values) => {
        const fieldValues = values.map((item) => item.subCategoryLabel.trim());
        const uniqueSubCategories = [...new Set(fieldValues)];

        return fieldValues.length === uniqueSubCategories.length;
      }
    ),
});

const EditCategory = () => {
  const { token } = useContext(AdminContext);
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { page, limit } = location.state;

  const [loadingState, setLoadingState] = useState({
    isLoadingSubmit: false,
    isLoadingCategoryData: true,
  });
  const [initialData, setInitialData] = useState({});

  const form = useForm({
    defaultValues: {
      categoryLabel: "",
      subCategory: [{ subCategoryLabel: "", id: "" }], // тут має бути об'єкт то піздєц як важливо
    },
    resolver: yupResolver(addCategorySchema),
  });

  const { register, control, handleSubmit, formState, reset } = form;

  const { errors, touchedFields, dirtyFields, isDirty, isSubmitting } =
    formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subCategory",
  });

  // ТРЕБА!!! використовувати useEffect, бо не бачить першого поля
  useEffect(() => {
    if (!fields.length) {
      append({ subCategoryLabel: "", id: "" }); // додаю порожнє поле
    }
  }, [fields, append]);

  const onSubmit = async (data) => {
    // console.log(data, "data");

    try {
      setLoadingState((prev) => ({
        ...prev,
        isLoadingSubmit: true,
      }));

      const isSubCategoryChanged = !isEqual(
        initialData.subCategory,
        data.subCategory
      );

      const updatedOnly = {};

      if (initialData.categoryLabel !== data.categoryLabel) {
        updatedOnly.categoryLabel = data.categoryLabel;
      }

      if (isSubCategoryChanged) {
        const subCategoryArray = data.subCategory.reduce((acc, current) => {
          if (current.subCategoryLabel.trim()) {
            acc.push({
              subCategoryLabel: current.subCategoryLabel.trim(),
              id: current.id || "",
            });
          }

          return acc;
        }, []);

        updatedOnly.subCategory = subCategoryArray;
      }

      const response = await axios.patch(
        backendUrl + `/api/category/update-category/${categoryId}`,
        { updatedFields: updatedOnly },
        { headers: { token } }
      );

      if (response.data.success) {
        setLoadingState((prev) => ({
          ...prev,
          isLoadingSubmit: false,
        }));

        toast.success(response.data.message);

        navigate(`/category-list?page=${page}&limit=${limit}`);
      } else {
        setLoadingState((prev) => ({
          ...prev,
          isLoadingSubmit: false,
        }));

        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");

      setLoadingState((prev) => ({
        ...prev,
        isLoadingSubmit: false,
      }));

      toast.error(error.response.data.message);
    }
  };

  const fetchCategory = async () => {
    try {
      setLoadingState((prev) => ({
        ...prev,
        isLoadingCategoryData: true,
      }));

      const response = await axios.get(
        backendUrl + "/api/category/single-category",
        {
          params: { categoryId },
        }
      );

      if (response.data.success) {
        const subCategoryLabels = response.data.category.subCategory.map(
          (item) => ({ subCategoryLabel: item.subCategoryLabel, id: item._id })
        );

        const formData = {
          categoryLabel: response.data.category.categoryLabel,
          subCategory: subCategoryLabels,
        };

        setInitialData(formData);
        reset(formData);

        setLoadingState((prev) => ({
          ...prev,
          isLoadingCategoryData: false,
        }));
      } else {
        setLoadingState((prev) => ({
          ...prev,
          isLoadingCategoryData: false,
        }));

        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");

      setLoadingState((prev) => ({
        ...prev,
        isLoadingCategoryData: false,
      }));

      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const isLoading =
    loadingState.isLoadingCategoryData || loadingState.isLoadingSubmit;

  return (
    <section className="edit-category">
      {isLoading && <Loader />}
      <BreadCrumbs>
        {[
          <Link key={0} to="/category-list">
            Список категорій
          </Link>,
          <span key={1}>Редагувати категорії</span>,
        ]}
      </BreadCrumbs>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="edit-category__form"
      >
        <div className="edit-category-box">
          <div className="category">
            <h2>Категорія</h2>
            <input
              className="field category-field"
              type="text"
              placeholder="Type category name"
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
                    placeholder="Type sub-category name"
                    {...register(`subCategory[${ind}].subCategoryLabel`)}
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
                append({ subCategoryLabel: "" });
              }}
            >
              + Додати під-категорію
            </button>
            <p className="error">{errors.subCategory?.message}</p>
          </div>
        </div>
        <div className="buttons">
          <button disabled={isSubmitting || !isDirty} type="submit">
            Редагувати
          </button>
          <button
            type="button"
            onClick={() => {
              reset(initialData);
            }}
          >
            Відмінити редагування <span className="revert-imoji">🛟</span>
          </button>
        </div>
      </form>
      {/* <DevTool control={control} /> */}
    </section>
  );
};

export default EditCategory;
