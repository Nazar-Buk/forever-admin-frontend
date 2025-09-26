// Add / Edit product count of images on page
export let imagesArray = [];

const countOfPictures = (count) => {
  imagesArray = []; // чистимо попередній масив

  for (let i = 1; i <= count; i++) {
    imagesArray.push(`image${i}`);
  }
};

countOfPictures(7);

export const totalSlots = 7;

// Sizes for product
export const sizesArray = ["S", "M", "L", "XL", "XXL"];
