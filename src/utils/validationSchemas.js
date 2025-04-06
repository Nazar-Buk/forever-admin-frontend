import * as yup from "yup";

export const addEditProductSchema = yup.object({
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
