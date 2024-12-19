import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import supabase from "../services/supabase";

function AddProduct({ getData, activeMenuTypeId, activeMenuId, uploadImageAndGetUrl }) {

  const [loading, setLoading] = useState(false);
  const [productInfo, setProductInfo] = useState({ title: "", price: "", fix_price: "", length: "", width: "", height: "", description: "", best_seller: false, });
  const [photos, setPhotos] = useState({ urls: [], files: [] });

  const inputHandle = (e) => {
    const { name, value, type } = e.target;
    setProductInfo((prevData) => ({ 
      ...prevData, [name]: type === "radio" ? value === "true" : value,
    }));
  };
  
  const handlePhotos = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPhotos({ files, urls });
  };

  const removePhoto = (index) => {
    setPhotos((prevState) => {
      const updatedUrls = [...prevState.urls];
      const updatedFiles = [...prevState.files];
      updatedUrls.splice(index, 1);
      updatedFiles.splice(index, 1);
      return { urls: updatedUrls, files: updatedFiles };
    });
  };

  const uploadImagesAndGetUrls = async (files) => {
    const bucketName = "woodcity";
    // Har bir faylni yuklash va URLni olish
    const uploadPromises = files.map(async (file) => {
      const filePath = `${Date.now()}_${file.name}`;
      // Rasmni yuklash
      const { error } = await supabase.storage.from(bucketName).upload(filePath, file);
      if (error) {
        console.error("Rasm yuklashda xatolik:", error.message);
        return null; // Agar yuklashda xatolik bo'lsa, null qaytaramiz
      }
      // URL olish
      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      return data.publicUrl;
    });
    // Barcha va'dalarni bajarilishini kutamiz
    const urls = await Promise.all(uploadPromises);
    // URL-larni qaytaramiz
    return urls.filter((url) => url !== null); // null qiymatlarni olib tashlaymiz
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
    setLoading(true);
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

    let images_product;
    if (photos.files.length !== 0 ) {
      images_product = await uploadImagesAndGetUrls(photos.files);
    } else {
      images_product = ["https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg"];
    }
    // Foydalanish:
  // const images = await uploadImagesAndGetUrls(png.files);
  // console.log(images); // [publicUrl1, publicUrl2, ...]

    let imageDes;
    if (desImg.file !== "") {
      imageDes = await uploadImageAndGetUrl(desImg.file);
    } else {
      imageDes =
        "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg";
    }

    // Types massivini yangilash
    const updatedTypes = typesData.map((type) => {
      if (type.id === activeMenuTypeId) {
        // Har bir mos type ichidagi products massiviga yangi product qo'shish
        type.products = [
          ...(type.products || []),
          {
            ...productInfo,
            id: uuidv4(),
            images_product: images_product,
            image_des: imageDes,
            created_at: new Date().toISOString(),
          },
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
      setProductInfo({
        title: "",
        price: "",
        fix_price: "",
        length: "",
        width: "",
        height: "",
        description: "",
        best_seller: false,
      });
      setDesImg({ file: "", url: "" });
      // setPng({ file: "", url: "" });
      setPhotos({ urls: [], files: [] })
      document.getElementById("addproduct").close();
      // UI yangilanishi yoki boshqa amallarni bajarish
    }

    setLoading(false);
  };

  return (
    <>
      <dialog id="addproduct" className="modal">
        <div className="modal-box max-w-2xl">
          <>
            <form onSubmit={addProduct}>

              <label htmlFor="selectPhotos" className="mb-3 flex flex-col border border-dashed rounded-xl justify-start p-4 cursor-pointer select-none">
                <div className="flex flex-col items-center">
                  <span className={`text-[14px] md:text-[16px] font-medium ${photos.urls.length === 0 ? "" : "hidden"}`}>Добавьте фото</span>
                  <span className={`${photos.urls.length === 0 ? "" : "hidden"} text-[12px] md:text-[14px]`}>Перетащите сюда или <span className="text-sky-600">выберите на компьютере</span></span>
                </div>
                <div className="flex flex-wrap justify-start items-center gap-4" >
                  {photos.urls.map((photo, index) => (
                    <div key={index} className="relative">
                      <span onClick={(e) => { e.preventDefault(); removePhoto(index); }} className="absolute -right-2 -top-2 bg-white hover:bg-red-100 w-[25px] h-[25px] border border-red-100 rounded-full p-1 flex justify-center items-center text-[10px]">❌</span>
                      <img src={photo} className="w-[70px] h-[70px] border border-red-100" />
                    </div>
                  ))}
                </div>
                <input id="selectPhotos" className="hidden" type="file" name="photos" multiple onChange={handlePhotos} />
              </label>

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
                <div className="border border-dashed w-[140px] h-auto flex-shrink-0 flex flex-col justify-center items-center">
                  <img
                    src={desImg.url}
                    className={`${
                      desImg.url ? "" : "hidden"
                    } w-auto h-[90px] object-cover mb-1`}
                  />
                  <p
                    className={`text-[9px] whitespace-nowrap py-1 ${
                      desImg.url ? "hidden" : ""
                    }`}
                  >
                    Описание изображения
                  </p>
                  <label
                    className={`text-[11px] btn btn-xs ${desImg.url ? "" : ""}`}
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
              <div className="mt-3 flex justify-center items-center gap-4 border border-dashed rounded-xl py-1 px-2">

                <span className="whitespace-nowrap">Лучшая распродажа:</span>

                <div className="flex justify-around w-full gap-12">
                  
                    <label htmlFor="bestSeller1" className="btn btn-sm">
                    <input
                      type="radio"
                      id="bestSeller1"
                      name="best_seller"
                      value={true}
                      checked={productInfo.best_seller === true}
                      onChange={inputHandle}
                      className=""
                    />
                      <span className="ml-2">Да</span>
                    </label>               
                    
                    <label htmlFor="bestSeller2" className="btn btn-sm ">
                    <input
                      type="radio"
                      id="bestSeller2"
                      name="best_seller"
                      value={false}
                      checked={productInfo.best_seller === false}
                      onChange={inputHandle}
                      className=""
                    />
                    <span className="ml-2">Нет</span>
                    </label>
                  
                </div>
              </div>
              <button type="submit" className="mt-3 btn btn-sm w-full">
                <span className={`${loading ? "hidden" : ""}`}>Save</span>
                <span
                  className={`justify-center items-center gap-3 ${
                    loading ? "flex" : "hidden"
                  }`}
                >
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Saving...</span>
                </span>
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
