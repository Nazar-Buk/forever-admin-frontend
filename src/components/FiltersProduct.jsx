import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const filtersSchema = yup.object({
  category: yup.string(),
  subCategory: yup.string(),
});

const FiltersProduct = (props) => {
  const {
    isFilterListVisibility,
    setIsFilterListVisibility,
    categoriesData,
    category,
    setCategory,
    subCategory,
    setSubCategory,
  } = props;

  const form = useForm({
    defaultValues: {
      category: "",
      subCategory: "",
    },
    resolver: yupResolver(filtersSchema),
  });

  const { register, handleSubmit, formState, watch, setValue, reset } = form;

  const { errors } = formState;

  const selectedCategory = watch("category");

  const subCategories =
    categoriesData.find((item) => item.categoryLabel === selectedCategory)
      ?.subCategory || [];

  useEffect(() => {
    if (selectedCategory !== category) {
      setValue("subCategory", ""); // коли міняю категорію то підкатегорія хай стає пустою
    }
  }, [selectedCategory]);

  useEffect(() => {
    reset({
      category: category || "",
      subCategory: subCategory || "",
    });
  }, [category, subCategory]);

  const onSubmit = (data) => {
    setCategory(data.category);
    setSubCategory(data.subCategory);
  };

  return (
    <section
      className={`filter__menu ${isFilterListVisibility ? "active" : ""}`}
    >
      <div className="filters__header">
        <h2>Filters List</h2>
        <svg
          className="cross-icon"
          onClick={() => {
            setIsFilterListVisibility(false);
            reset();
            setCategory("");
            setSubCategory("");
          }}
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
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate // тепер не браузер валідує форму а useForm
        className="filter-list"
      >
        <div className="filter-items__body">
          <div className="filter-item-box">
            <p>Category</p>
            <select name="category" id="category" {...register("category")}>
              <option value="" defaultValue>
                Choose Category
              </option>
              {categoriesData?.map((item, ind) => (
                <option key={ind} value={item.categoryLabel}>
                  {item.categoryLabel}
                </option>
              ))}
            </select>
            <p className="error">{errors.category?.message}</p>
          </div>

          <div className="filter-item-box">
            <p>Sub-Category</p>
            <select
              name="sub-category"
              id="sub-category"
              {...register("subCategory")}
              disabled={!selectedCategory}
            >
              <option value="" defaultValue>
                Choose Sub-Category
              </option>
              {subCategories?.map((item, ind) => (
                <option key={ind} value={item.subCategoryLabel}>
                  {item.subCategoryLabel}
                </option>
              ))}
            </select>
            <p className="error">{errors.subCategory?.message}</p>
          </div>
        </div>
        <div className="filter__footer">
          <button type="submit">Apply Filters</button>
        </div>
      </form>
    </section>
  );
};

export default FiltersProduct;
