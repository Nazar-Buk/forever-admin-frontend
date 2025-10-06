import * as yup from "yup";

export const addEditProductSchema = yup.object({
  images: yup.array().of(yup.mixed().nullable()),
  name: yup.string().required("Це поле обовʼязкове!"),
  description: yup.string().required("Це поле обовʼязкове!"),
  category: yup.string().required("Виберіть категорію"),
  subCategory: yup.string().required("Виберіть під-категорію"),
  price: yup
    .number()
    .typeError("Ціна має бути числом!")
    .min(1)
    .positive("Використовуйте тільки додатні числа")
    .required("Додати ціну продукту"),
  isSizesAvailable: yup.boolean(),
  // sizes: yup
  //   .array()
  //   .of(yup.string())
  //   .min(1, "Please select at least one size!"),
  sizes: yup
    .array()
    .of(yup.string())
    .when("isSizesAvailable", {
      is: true,
      then: (schema) =>
        schema.min(1, "Будь ласка, виберіть що найменше 1 розмір!"),
      otherwise: (schema) => schema.notRequired(),
    }),
  bestseller: yup.boolean(),
});
