import supabase from "../services/supabase";
import { useState } from "react";

function EditProductType({ productType, getData}) {
    const [loading, setLoading] = useState(false);
    const [typesInfo, setTypesInfo] = useState({
        name: productType.name,
        description: productType.description,
        price: productType.price,
      });

      const inputHandle = (e) => {
        const { name, value } = e.target;
        setTypesInfo((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

  return (
    <>
        <button className="btn btn-sm" onClick={() => { document.getElementById(`editProductType_${productType.id}`).showModal(); }}>
            <i className={`bi bi-pencil`}></i>
        </button>

        <dialog id={`editProductType_${productType.id}`} className="modal">
        <div className="modal-box max-w-4xl">
          <>
            <form 
            // onSubmit={addProductType}
            >
              <div className="flex justify-start items-center">
                {/* <div className="border-black border border-dotted w-[140px] h-[140px] flex-shrink-0 flex flex-col justify-center items-center">
                  <img
                    src={png.url}
                    alt=""
                    className={`${
                      png.url ? "" : "hidden"
                    } w-auto h-[90px] object-cover mb-1`}
                  />
                  <p className={`text-[12px] py-1 ${png.url ? "hidden" : ""}`}>
                    Select only PNG/JPG
                  </p>
                  <label
                    className={`text-[12px] btn btn-sm ${png.url ? "" : ""}`}
                    htmlFor="selectpng"
                  >
                    Select PNG/JPG
                  </label>
                  <input
                    className="hidden"
                    accept=".jpg, .jpeg, .png"
                    type="file"
                    id="selectpng"
                    onChange={handlePng}
                  />
                </div> */}
                <div className="flex flex-col w-full">
                  <label htmlFor="" className="flex flex-col">
                    <span>Названия:</span>
                    <input
                      name="name"
                      value={typesInfo.name}
                      onChange={inputHandle}
                      className="border px-2 py-1"
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
                  type="text"
                ></textarea>
              </label>

              <button className="btn btn-sm mt-3 w-full">
                <span className={`${loading ? "hidden" : ""}`}>Сохранить</span>
                <div className={`flex justify-center items-center gap-3 ${loading ? "" : "hidden"}`}>
                  <span className="loading loading-spinner loading-xs"></span> Сохранение...
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
  )
}

export default EditProductType