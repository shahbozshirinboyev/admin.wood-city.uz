import supabase from "../services/supabase";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";

function AddProductType({ selectMenuInfo, getData }) {
  const [loading, setLoading] = useState(false);
  const [png, setPng] = useState({ file: "", url: "" });
  const handlePng = (e) => {
    if (e.target.files[0]) {
      setPng({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const [typesInfo, setTypesInfo] = useState({
    id: uuidv4(),
    name: "",
    description: "",
    price: "",
    products: [],
  });
  const inputHandle = (e) => {
    const { name, value } = e.target;
    setTypesInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const uploadImageAndGetUrl = async (file) => {
    const bucketName = "woodcity";
    const filePath = `${Date.now()}_${file.name}`;

    // Rasmni yuklash
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) {
      console.error("Rasm yuklashda xatolik:", error.message);
      return null;
    }
    // URL olish
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const addProductType = async (e) => {
    e.preventDefault();
    setLoading(true);
    let image;
    if (png.file !== "") {
      image = await uploadImageAndGetUrl(png.file);
    } else {
      image = "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg";
    }
    const { data, error } = await supabase
      .from("furniture")
      .update({
        types: [
          ...(selectMenuInfo.types || []),
          { ...typesInfo, image: image, created_at: new Date().toISOString() },
        ],
      })
      .eq("id", selectMenuInfo.menu_id);

    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Data updated:", data);
      document.getElementById("AddProductType").close();
      setTypesInfo({
        id: uuidv4(),
        name: "",
        description: "",
        price: "",
        products: [],
      });
      setPng({ file: "", url: "" });
      getData();
    }
    setLoading(false);
  };
  return (
    <>
      <dialog id="AddProductType" className="modal">
        <div className="modal-box max-w-2xl">
          <>
            <form onSubmit={addProductType}>
              <div className="flex justify-start items-center">
                <div className="border-black border border-dotted w-[140px] h-[140px] flex-shrink-0 flex flex-col justify-center items-center">
                  <img
                    src={png.url}
                    alt=""
                    className={`${
                      png.url ? "" : "hidden"
                    } w-auto h-[90px] object-cover mb-1`}
                  />
                  <p className={`text-[11px] py-1 ${png.url ? "hidden" : ""}`}>
                  Выбрать только PNG/JPG
                  </p>
                  <label
                    className={`text-[12px] btn btn-xs ${png.url ? "" : ""}`}
                    htmlFor="selectpng"
                  >
                    Выбрать PNG/JPG
                  </label>
                  <input
                    className="hidden"
                    accept=".jpg, .jpeg, .png"
                    type="file"
                    id="selectpng"
                    onChange={handlePng}
                  />
                </div>
                <div className="flex flex-col px-6 w-full">
                  <label htmlFor="" className="flex flex-col">
                    <span>Названия:</span>
                    <input
                      name="name"
                      value={typesInfo.name}
                      onChange={inputHandle}
                      className="border px-2 py-1"
                      placeholder="Угловые диваны"
                      type="text"
                    />
                  </label>
                  <label htmlFor="" className="flex flex-col mt-2">
                    <span>Цена:</span>
                    <input
                      name="price"
                      value={typesInfo.price}
                      onChange={inputHandle}
                      className="border px-2 py-1"
                      placeholder="от 3 450 000 сум."
                      type="text"
                    />
                  </label>
                </div>
              </div>
              <label htmlFor="" className="flex flex-col my-2">
                <span>Описание:</span>
                <textarea
                  rows="5"
                  name="description"
                  value={typesInfo.description}
                  onChange={inputHandle}
                  className="border px-2 py-1"
                  placeholder="Краткое описание продукта ..."
                  type="text"
                ></textarea>
              </label>
              <button className="btn btn-sm mt-3 w-full">
                <span className={`${loading ? "hidden" : ""}`}>Добавить</span>
                <div
                  className={`flex justify-center items-center gap-3 ${
                    loading ? "" : "hidden"
                  }`}
                >
                  <span className="loading loading-spinner loading-xs"></span>
                  Добавляется...
                </div>
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

export default AddProductType;
