import {
  useSortable, // хук, що робить елемент перетягуваним
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"; // утиліта для стилів (transform і transition)

import { assets } from "../../../admin_assets/assets";

// === Окремий блок, який можна тягати ===
const SortableItem = ({ id, open, image, onChange, value }) => {
  const {
    attributes, // доступні атрибути для drag&drop
    listeners, // події (onMouseDown, onKeyDown...)
    setNodeRef, // ref для DOM-елемента
    transform, // зсув елемента під час перетягування
    transition, // анімація при переміщенні
    isDragging, // чи тягнемо зараз цей елемент, можна міняти стилітколи тягну блок
  } = useSortable({ id }); // робимо цей елемент sortable

  const style = {
    transform: CSS.Transform.toString(transform), // перетворення (переміщення)
    transition, // плавна анімація
    boxShadow: isDragging ? "0 0 20px rgba(242, 242, 242, 0.5)" : "none", // тінь, коли тягнемо
    backgroundImage: `url(${image || assets.upload_area})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const handleRemoveImage = (id) => {
    const newArray = value.map((img) => {
      if (img.id === id) {
        return { ...img, file: null, preview: null };
      }

      return img;
    });

    const filledSlots = newArray.filter((img) => img.preview !== null);
    const emptySlots = newArray.filter((img) => img.preview === null);

    onChange([...filledSlots, ...emptySlots]);
  };

  return (
    <div
      className="image-box"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(image ? listeners : {})} // тільки заповнені блоки можна перетягувати
      onClick={() => {
        if (!image) open(); // відкриваємо системне вікно вибору файлів
      }}
      // onContextMenu={(e) => e.preventDefault()} // 🚫 блокує "меню" на довгому тапі
    >
      {/* <img src={image || assets.upload_area} alt="preview" /> */}
      <div
        className="remove-button"
        style={{
          display: image ? "flex" : "none",
        }}
        onClick={() => handleRemoveImage(id)}
      >
        <img src={assets.cross_icon} alt="cross icon" />
      </div>
    </div>
  );
};

export default SortableItem;
