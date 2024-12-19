import { useState } from "react";
import supabase from "../services/supabase";

function EditItem({ item, getData }) {
  const [loading, setLoading] = useState(false);
  const [itemInfo, setItemInfo] = useState(
    {
        name: item.name,
        description: item.description,
        icon: item.icon,
        image: item.image,
    })
    const inputHandle = (e) => {
        const { name, value } = e.target;
        setItemInfo((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

      async function updateProduct() {
        const { data, error } = await supabase
          .from('products') // Jadval nomi
          .update({ name: 'New Product Name', price: 100 }) // Tahrir qilinadigan ustunlar
          .eq('id', 5); // Qaysi qatorni tahrirlash kerakligi
      
        if (error) {
          console.error('Error updating product:', error);
        } else {
          console.log('Updated product:', data);
        }
      }
      
      updateProduct();
      
  return (
    <>
      <button onClick={() => {document.getElementById(`editItem${item.id}`).showModal();}} className="btn btn-sm" >
        <i className="bi bi-pencil text-[16px]"></i>
      </button>

      <dialog id={`editItem${item.id}`} className="modal text-[16px] font-normal" >

        <div className="modal-box max-w-2xl">
          <>
          <div>
                <form 
                // onSubmit={addNewFurnitureMenu}
                >
                    <div className="flex justify-around items-center border border-dashed p-4">

                        <div className="w-[180px] h-[180px] border border-dashed p-4 flex justify-center items-center">
                            <img src={itemInfo.icon} className="w-auto h-[90%]" />
                        </div>

                        <div className="w-[180px] h-[180px] border border-dashed p-4 flex justify-center items-center">
                            <img src={itemInfo.image} className="w-auto h-[90%]" />
                        </div>

                    </div>
                  <div>
                    <label htmlFor="" className="">
                      <span>
                        Name<span className="text-red-600">*</span>
                      </span>
                      <input
                        required
                        name="name"
                        value={itemInfo.name}
                        onChange={inputHandle}
                        type="text"
                        className="border w-full px-2 py-1 rounded-md"
                        placeholder="Name"
                      />
                    </label>
                  </div>
                  <div className="mt-3">
                    <label htmlFor="" className="">
                      <span>
                        Description<span className="text-red-600">*</span>
                      </span>
                      <textarea
                        required
                        name="description"
                        value={itemInfo.description}
                        onChange={inputHandle}
                        type="text"
                        rows="4"
                        placeholder="Type here ..."
                        className="border w-full px-2 py-1 rounded-md"
                      ></textarea>
                    </label>
                  </div>
                  <div className="flex justify-around items-center mt-3">
                    {/* <div className="border-black border border-dotted w-[150px] h-[150px] flex flex-col justify-center items-center">
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
                        Select only SVG
                      </p>
                      <label
                        className={`btn btn-sm ${svg.url ? "" : ""}`}
                        htmlFor="selectsvg"
                      >
                        Select SVG
                      </label>
                      <input
                        className="hidden"
                        accept="image/svg+xml"
                        type="file"
                        id="selectsvg"
                        onChange={handleSvg}
                      />
                    </div> */}

                    {/* <div className="border-black border border-dotted w-[150px] h-[150px] flex flex-col justify-center items-center">
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
                        Select only PNG/JPG
                      </p>
                      <label
                        className={`btn btn-sm ${png.url ? "" : ""}`}
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
                  </div>
                  <button className="btn btn-sm mt-3 w-full">
                    <span className={`${loading ? "hidden" : ""}`}>Save</span>
                    <div
                      className={`flex justify-center items-center gap-3 ${
                        loading ? "" : "hidden"
                      }`}
                    >
                      <span className="loading loading-spinner loading-xs"></span>
                      Saving...
                    </div>
                  </button>
                </form>
              </div>
          </>          
        </div>
        
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>

      </dialog>
    </>
  )
}

export default EditItem