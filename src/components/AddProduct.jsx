import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import supabase from "../services/supabase";

function AddProduct({getData, activeMenuTypeId, activeMenuId}) {
  const [productInfo, setProductInfo] = useState({
    title: "",
    price: "",
    fix_price: "",
    length: "",
    width: "",
    height: "",
    description: "",
    best_seller: false,
  });
  const inputHandle = (e) => {
    const { name, value, type } = e.target;
    setProductInfo((prevData) => ({
      ...prevData,
      [name]: type === "radio" ? value === "true" : value,
    }));
  };
  const [png, setPng] = useState({ file: "", url: "" });
  const handlePng = (e) => {
    if (e.target.files[0]) {
      setPng({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const [desImg, setDesImg] = useState({ file: "", url: "" });
  const handleDesImg = (e) => {
    if (e.target.files[0]) {
      setDesImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    console.log(productInfo);

    // Types massivini olish va yangilash uchun to'g'ri so'rov yuborish
    const { data: furnitureData, error: fetchError } = await supabase
      .from("furniture")
      .select("types") // types massivini olish
      .eq("id", activeMenuId); // Mavjud id bo'yicha olish

    if (fetchError) {
      console.error("Error fetching furniture data:", fetchError);
      return;
    }

    // data.topilmadi holatida tekshiruv
    const typesData = furnitureData[0]?.types;
    if (!typesData) {
      console.error("Types not found for the given activeMenuId");
      return;
    }

    let imageProduct;
    if (png.file !== "") {
      imageProduct = await uploadImageAndGetUrl(png.file);
    } else {
      imageProduct = "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg";
    }

    let imageDes;
    if (desImg.file !== "") {
      imageDes = await uploadImageAndGetUrl(desImg.file);
    } else {
      imageDes = "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg";
    }

    // Types massivini yangilash
    const updatedTypes = typesData.map((type) => {
      if (type.id === activeMenuTypeId) {
        // Har bir mos type ichidagi products massiviga yangi product qo'shish
        type.products = [
          ...(type.products || []),
          { ...productInfo, id: uuidv4(), image_product: imageProduct, image_des: imageDes,  created_at:  new Date().toISOString() },
        ];
      }
      return type;
    });


    // Yangilangan types massivini furnitures jadvaliga yuborish
    const { data, error } = await supabase
      .from("furniture")
      .update({ types: updatedTypes })
      .eq("id", activeMenuId);

    if (error) {
      console.error("Error updating data:", error);
    } else {
      console.log("Data updated:", data);
      getData();
      // UI yangilanishi yoki boshqa amallarni bajarish
    }


  };

  return (
    <>
      <dialog id="addproduct" className="modal">
        <div className="modal-box max-w-2xl">
          <>
            <form onSubmit={addProduct}>
              <div className="flex gap-4">
                <div className="border-black border border-dotted w-[140px] h-[140px] flex-shrink-0 flex flex-col justify-center items-center">
                  <img
                    src={png.url}
                    className={`${
                      png.url ? "" : "hidden"
                    } w-auto h-[90px] object-cover mb-1`}
                  />
                  <p
                    className={`text-[11px] whitespace-nowrap py-1 ${
                      png.url ? "hidden" : ""
                    }`}
                  >
                    Выбрать только PNG/JPG
                  </p>
                  <label
                    className={`text-[11px] btn btn-sm ${png.url ? "" : ""}`}
                    htmlFor="selectpng1"
                  >
                    Выберите PNG/JPG
                  </label>
                  <input
                    className="hidden"
                    accept=".jpg, .jpeg, .png"
                    type="file"
                    id="selectpng1"
                    onChange={handlePng}
                  />
                </div>

                <div className="w-full">
                  <label className="flex flex-col w-full mb-2">
                    <span className="text-[15px]">Название мебели:</span>
                    <input
                      type="text"
                      name="title"
                      value={productInfo.title}
                      onChange={inputHandle}
                      className="border px-2 py-1"
                    />
                  </label>

                  <div className="flex flex-col">
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex flex-col w-full">
                        <span>Цена со скидкой: (сум)</span>
                        <input
                          type="text"
                          name="price"
                          value={productInfo.price}
                          onChange={inputHandle}
                          className="border px-2 py-1"
                        />
                      </label>
                      <label className="flex flex-col w-full">
                        <span>
                          Фактическая цена:{" "}
                          <span className="line-through decoration-red-500">
                            (сум)
                          </span>
                        </span>
                        <input
                          type="text"
                          name="fix_price"
                          value={productInfo.fix_price}
                          onChange={inputHandle}
                          className="border px-2 py-1"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-3">
                <label className="flex flex-col">
                  <span className="text-[15px]">Длина: (cm)</span>
                  <input
                    type="number"
                    name="length"
                    value={productInfo.length}
                    onChange={inputHandle}
                    className="border px-2 py-1"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-[15px]">Ширина: (cm)</span>
                  <input
                    type="number"
                    name="width"
                    value={productInfo.width}
                    onChange={inputHandle}
                    className="border px-2 py-1"
                  />
                </label>
                <label className="flex flex-col">
                  <span className="text-[15px]">Высота: (cm)</span>
                  <input
                    type="number"
                    name="height"
                    value={productInfo.height}
                    onChange={inputHandle}
                    className="border px-2 py-1"
                  />
                </label>
              </div>
              <div className="flex mt-3 gap-3">
                <div className="border-black border border-dotted w-[140px] h-[140px] flex-shrink-0 flex flex-col justify-center items-center">
                  <img
                    src={desImg.url}
                    className={`${
                      desImg.url ? "" : "hidden"
                    } w-auto h-[90px] object-cover mb-1`}
                  />
                  <p
                    className={`text-[11px] whitespace-nowrap py-1 ${
                      desImg.url ? "hidden" : ""
                    }`}
                  >
                    Описание изображения
                  </p>
                  <label
                    className={`text-[11px] btn btn-sm ${desImg.url ? "" : ""}`}
                    htmlFor="selectpngdes"
                  >
                    Выберите PNG/JPG
                  </label>
                  <input
                    className="hidden"
                    accept=".jpg, .jpeg, .png"
                    type="file"
                    id="selectpngdes"
                    onChange={handleDesImg}
                  />
                </div>
                <label className="flex flex-col w-full">
                  <span>Описание:</span>
                  <textarea
                    rows="4"
                    className="border px-2 py-1"
                    name="description"
                    value={productInfo.description}
                    onChange={inputHandle}
                  ></textarea>
                </label>
              </div>
              <div className="mt-3 flex gap-4 border py-1 px-2">
                <span className="whitespace-nowrap">Лучшая распродажа</span>

                <div className="flex justify-around w-full">
                  <div>
                    <input
                      type="radio"
                      id="bestSeller1"
                      name="best_seller"
                      value={true}
                      checked={productInfo.best_seller === true}
                      onChange={inputHandle}
                      className=""
                    />
                    <label htmlFor="bestSeller1" className="ml-2">
                      Да
                    </label>
                  </div>

                  <div>
                    <input
                      type="radio"
                      id="bestSeller2"
                      name="best_seller"
                      value={false}
                      checked={productInfo.best_seller === false}
                      onChange={inputHandle}
                    />
                    <label htmlFor="bestSeller2" className="ml-2">
                      Нет
                    </label>
                  </div>
                </div>
              </div>
              <button type="submit" className="mt-3 btn btn-sm w-full">
                Save
              </button>
            </form>
          </>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default AddProduct;
