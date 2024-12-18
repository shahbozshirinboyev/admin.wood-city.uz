import { useState } from "react";

function AddProduct() {
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

  return (
    <>
      <dialog id="addproduct" className="modal">
        <div className="modal-box max-w-2xl">
          <>
            <form>
              <div className="flex gap-4">
                <div className="border-black border border-dotted w-[140px] h-[140px] flex-shrink-0 flex flex-col justify-center items-center">
                  <img
                    src={png.url}
                    alt=""
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
                    <input type="text" className="border px-2 py-1" />
                  </label>
                  <div className="flex flex-col">
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex flex-col w-full">
                        <span>Цена со скидкой: (сум)</span>
                        <input type="text" className="border px-2 py-1" />
                      </label>
                      <label className="flex flex-col w-full">
                        <span>
                          Фактическая цена:{" "}
                          <span className="line-through decoration-red-500">
                            (сум)
                          </span>
                        </span>
                        <input type="text" className="border px-2 py-1" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-3">
                <label className="flex flex-col">
                  <span className="text-[15px]">Длина: (cm)</span>
                  <input type="number" className="border px-2 py-1" />
                </label>
                <label className="flex flex-col">
                  <span className="text-[15px]">Ширина: (cm)</span>
                  <input type="number" className="border px-2 py-1" />
                </label>
                <label className="flex flex-col">
                  <span className="text-[15px]">Высота: (cm)</span>
                  <input type="number" className="border px-2 py-1" />
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
                  >Описание изображения
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
                    name=""
                    id=""
                  ></textarea>
                </label>
              </div>
              <div className="mt-3 flex gap-4 border py-1 px-2">
                <span className="whitespace-nowrap">Лучшая распродажа</span>

                <div className="flex justify-around w-full">

                  <div>
                    <input type="radio" id="bestSeller1" name="best_seller" className="" />
                    <label htmlFor="bestSeller1" className="ml-2">
                      Да
                    </label>
                  </div>

                  <div>
                    <input type="radio" id="bestSeller2" name="best_seller" />
                    <label htmlFor="bestSeller2" className="ml-2">
                      Нет
                    </label>
                  </div>

                </div>

              </div>
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
