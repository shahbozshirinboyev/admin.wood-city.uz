import { useState } from "react";

function AddProduct() {
    const [png, setPng] = useState({ file: "", url: "" });
  const handlePng = (e) => {
    if (e.target.files[0]) {
      setPng({
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
                  <p className={`text-[11px] whitespace-nowrap py-1 ${png.url ? "hidden" : ""}`}>
                    Выбрать только PNG/JPG
                  </p>
                  <label
                    className={`text-[11px] btn btn-sm ${png.url ? "" : ""}`}
                    htmlFor="selectpng"
                  >
                    Выберите PNG/JPG
                  </label>
                  <input
                    className="hidden"
                    accept=".jpg, .jpeg, .png"
                    type="file"
                    id="selectpng"
                    onChange={handlePng}
                  />
                </div>
                <div>
                <label className="flex flex-col w-full mb-2">
                    <span className="text-[15px]">Название мебели:</span>
                    <input type="text" className="border px-2 py-1" />
                </label>
                <div className="flex flex-col">
                    <span className="text-[12px]">Габариты:</span>
                    <div  className="grid grid-cols-3 gap-2">
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
                </div>
                </div>
                </div>
                <div>
                    
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
