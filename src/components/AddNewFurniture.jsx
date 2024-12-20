import { useState } from "react";
import supabase from "../services/supabase";

function AddNewFurniture({uploadImageAndGetUrl, getData}) {

    const [loading, setLoading] = useState(false);

    const [svg, setSvg] = useState({ file: "", url: "" });
  const handleSvg = (e) => {
    if (e.target.files[0]) {
      setSvg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
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
  const [menuData, setMenuData] = useState({ name: "", description: "" });
  const inputHandle = (e) => {
    const { name, value } = e.target;
    setMenuData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


    const addNewFurnitureMenu = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        let image_png;
        if (png.file !== "") {
          image_png = await uploadImageAndGetUrl(png.file);
        } else {
          image_png =
            "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg";
        }
        let image_svg;
        if (svg.file !== "") {
          image_svg = await uploadImageAndGetUrl(svg.file);
        } else {
          image_svg =
            "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg";
        }
    
        const { data, error } = await supabase.from("furniture").insert([
          {
            name: menuData.name,
            description: menuData.description,
            image: image_png,
            icon: image_svg,
            types: [],
          },
        ]);
    
        if (error) {
          console.error("Xatolik:", error.message);
        } else {
          getData();
          setLoading(false);
          document.getElementById("addFurniture").close();
          setPng({ file: "", url: "" });
          setSvg({ file: "", url: "" });
          setMenuData({ name: "", description: "" });
        }
      };
  return (
    <>
        <div className="flex justify-end items-center">
            <button className="btn btn-sm" onClick={() => document.getElementById("addFurniture").showModal()}>
              <i className="bi bi-plus-lg"></i>Добавить
            </button>
          </div>

          <dialog id="addFurniture" className="modal">
            <div className="modal-box max-w-3xl">
              <div>
                <form onSubmit={addNewFurnitureMenu}>
                  <div>
                    <label htmlFor="" className="">
                      <span>
                      Названия<span className="text-red-600">*</span>
                      </span>
                      <input
                        required
                        name="name"
                        value={menuData.name}
                        onChange={inputHandle}
                        type="text"
                        className="border w-full px-2 py-1 rounded-md"
                        placeholder="Диваны и кресла"
                      />
                    </label>
                  </div>
                  <div className="mt-3">
                    <label htmlFor="" className="">
                      <span>
                      Описание<span className="text-red-600">*</span>
                      </span>
                      <textarea
                        required
                        name="description"
                        value={menuData.description}
                        onChange={inputHandle}
                        type="text"
                        rows="5"
                        placeholder="Краткое описание продукта ..."
                        className="border w-full px-2 py-1 rounded-md"
                      ></textarea>
                    </label>
                  </div>
                  <div className="flex justify-around items-center mt-3">
                    <div className="border-black border border-dotted w-[150px] h-[150px] flex flex-col justify-center items-center">
                      <img
                        src={svg.url}
                        alt=""
                        className={`${
                          svg.url ? "" : "hidden"
                        } w-auto h-[100px] object-cover mb-1`}
                      />
                      <p
                        className={`text-[12px] py-1 ${
                          svg.url ? "hidden" : ""
                        }`}
                      >
                        Выбрать только SVG
                      </p>
                      <label
                        className={`btn btn-xs ${svg.url ? "" : ""}`}
                        htmlFor="selectsvg"
                      >
                        Выбрать SVG
                      </label>
                      <input
                        className="hidden"
                        accept="image/svg+xml"
                        type="file"
                        id="selectsvg"
                        onChange={handleSvg}
                      />
                    </div>

                    <div className="border-black border border-dotted w-[150px] h-[150px] flex flex-col justify-center items-center">
                      <img
                        src={png.url}
                        alt=""
                        className={`${
                          png.url ? "" : "hidden"
                        } w-auto h-[100px] object-cover mb-1`}
                      />
                      <p
                        className={`text-[12px] py-1 ${
                          png.url ? "hidden" : ""
                        }`}
                      >
                        Выбрать только PNG/JPG
                      </p>
                      <label
                        className={`btn btn-xs ${png.url ? "" : ""}`}
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
                  </div>
                  <button className="btn btn-sm mt-4 w-full">
                    <span className={`${loading ? "hidden" : ""}`}>Сохранить</span>
                    <div
                      className={`flex justify-center items-center gap-3 ${
                        loading ? "" : "hidden"
                      }`}
                    >
                      <span className="loading loading-spinner loading-xs"></span>
                      Сохраняется...
                    </div>
                  </button>
                </form>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>

    </>
  )
}

export default AddNewFurniture