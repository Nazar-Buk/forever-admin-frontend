import { Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import heic2any from "heic2any"; // для конвертації heic в jpg
// import { nanoid } from "nanoid"; // для унікальних id, це дууже треба бо будуть стрибки при переміщенні картинок
import {
  DndContext, // головний контейнер drag&drop
  closestCenter, // стратегія визначення найближчого елемента під час перетягування
  KeyboardSensor, // сенсор для управління з клавіатури
  PointerSensor, // сенсор для мишки/тач
  TouchSensor, // сенсор для мобільних
  useSensor, // створює один сенсор
  useSensors, // об’єднує кілька сенсорів
} from "@dnd-kit/core";
import {
  arrayMove, // утиліта для зміни порядку в масиві
  SortableContext, // контейнер для sortable-елементів
  //   useSortable, // хук, що робить елемент перетягуваним
  horizontalListSortingStrategy, // стратегія сортування по горизонталі
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
// import { CSS } from "@dnd-kit/utilities"; // утиліта для стилів (transform і transition)

import SortableItem from "./SortableItem";

const UploadImagesBox = ({ control, name, setIsLoadingState }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        // ЦЕ ВСЕ render={............} поле
        const { value, onChange } = field; // field -- містить value, onChange, onBlur, name, ref

        // налаштовуємо dropzone — noClick: true, бо відкриваємо вручну через open()
        const {
          // acceptedFiles, // масив файлів, які користувач вибрав (або перетягнув).
          getRootProps, // дає потрібні пропси для "зони завантаження" (наприклад, div). Туди треба "розкинути" ці пропси, щоб зона працювала з drag&drop.
          getInputProps, // дає пропси для прихованого <input type="file">. Завдяки цьому react-dropzone підключає системний файловий діалог.
          open,
        } = useDropzone({
          accept: { "image/*": [] },
          noClick: true,
          onDrop: async (files) => {
            console.log(files, "files"); // масив вибраних файлів
            if (!files.length) return;

            // Конвертація HEIC/HEIF в JPG

            try {
              setIsLoadingState((prev) => ({
                ...prev,
                isLoadingPictures: true,
              }));

              const correctFormatFiles = await Promise.all(
                files.map(async (file) => {
                  // Виявилося що айфон робить свій тиg картинки і треба переробити його в jpg, бо він зрозумілий для браузера
                  if (
                    file.type === "image/heic" ||
                    file.type === "image/heif"
                  ) {
                    try {
                      const convertedBlob = await heic2any({
                        blob: file,
                        toType: "image/jpeg",
                        quality: 0.9, // 90% якості
                      });

                      // Створюємо новий файл на базі конвертованого Blob
                      const convertedFile = new File(
                        [convertedBlob],
                        file.name.replace(/\.[^/.]+$/, ".jpg"),
                        {
                          type: "image/jpeg",
                        }
                      );

                      return convertedFile;
                    } catch (error) {
                      console.log(error, "error");
                      return file; // повертаємо оригінальний файл, якщо конвертація не вдалася
                    }
                  }

                  return file;
                })
              );

              const newArray = [...value];
              let fileIndex = 0;

              for (
                let i = 0;
                i < newArray.length && fileIndex < correctFormatFiles.length;
                i++
              ) {
                if (!newArray[i].preview) {
                  newArray[i] = {
                    ...newArray[i],
                    file: correctFormatFiles[fileIndex],
                    preview: URL.createObjectURL(correctFormatFiles[fileIndex]),
                  };
                  fileIndex++;
                }
              }

              onChange(newArray);
            } catch (error) {
              console.log(error, "error");
            } finally {
              setIsLoadingState((prev) => ({
                ...prev,
                isLoadingPictures: false,
              }));
            }
          },
        });

        // сенсори для керування (мишка + клавіатура)
        const sensors = useSensors(
          useSensor(PointerSensor, {
            activationConstraint: {
              delay: 250, // затримка перед drag (0.25s)
              tolerance: 10, // щоб клік не плутався з drag /// Коротко: допустимий “зсув” для кліку перед drag.
            },
          }),
          useSensor(TouchSensor, {
            activationConstraint: {
              delay: 250, // затримка перед drag (0.25s)
              tolerance: 10, // щоб клік не плутався з drag /// Коротко: допустимий “зсув” для кліку перед drag.
            },
          }),
          useSensor(KeyboardSensor)
        );

        // що робити після завершення перетягування
        const handleDragEnd = (event) => {
          const { active, over } = event; // active = що тягнемо, over = над чим зараз

          if (!over || active.id === over.id) return;

          const oldIndex = value.findIndex((img) => img.id === active.id);
          const newIndex = value.findIndex((img) => img.id === over.id);

          // 🚫 забороняємо міняти місцями картинки із пустими слотами. Але анімація присутня
          if (!value[newIndex].preview) return;

          onChange(arrayMove(value, oldIndex, newIndex));
        };

        const sortableContextItems = value.map((img) => img.id);

        return (
          <div className="draguble-upload-images-box">
            {/* прихований input від dropzone */}
            <div {...getRootProps()} style={{ display: "none" }}>
              <input {...getInputProps()} />
            </div>

            <DndContext
              sensors={sensors}
              preventDefault={true} // 👈 ключ для мобільних
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToHorizontalAxis]} // обмеження руху по горизонталі
            >
              <SortableContext
                items={sortableContextItems}
                strategy={horizontalListSortingStrategy}
              >
                <div className="wrap-images">
                  {value.map((img) => (
                    <SortableItem
                      key={img.id}
                      id={img.id}
                      open={open}
                      image={img.preview}
                      onChange={onChange}
                      value={value}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        );
      }}
    />
  );
};

export default UploadImagesBox;
