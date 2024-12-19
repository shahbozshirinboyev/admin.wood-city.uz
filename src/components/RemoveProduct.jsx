import { useState } from "react";
import supabase from "../services/supabase";

function RemoveProduct({ getData, id, activeMenuTypeId, activeMenuId}) {
    const [loading, setLoading] = useState(false)
     // Delete Product by ID
  const removeProduct = async (productId) => {
    setLoading(true)
    // Types massivini olish
    const { data: furnitureData, error: fetchError } = await supabase
      .from("furniture")
      .select("types") // types massivini olish
      .eq("id", activeMenuId); // Mavjud id bo'yicha olish

    if (fetchError) {
      console.error("Error fetching furniture data:", fetchError);
      return;
    }

    // data topilmadi holatida tekshiruv
    const typesData = furnitureData[0]?.types;
    if (!typesData) {
      console.error("Types not found for the given activeMenuId");
      return;
    }

    // Types massivini yangilash: productni o'chirish
    const updatedTypes = typesData.map((type) => {
      if (type.id === activeMenuTypeId) {
        // Har bir mos type ichidagi products massividan productni o'chirish
        type.products = type.products.filter(
          (product) => product.id !== productId
        );
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
    //   console.log(data);
      document.getElementById(`modal_${id}`).close();
      getData();
      // UI yangilanishi yoki boshqa amallarni bajarish
    }
    setLoading(false)
  };
  return (
    <>
    {/* Remove Button START */}
      <button onClick={() => { document.getElementById(`modal_${id}`).showModal(); }} className="btn btn-sm flex-grow">
        <i className="bi bi-trash3"></i>
      </button>
    {/* Remove Button END */}

    <dialog id={`modal_${id}`} className="modal">

        <div className="modal-box">

          <h6 className="pb-4 text-[16px]">Delete product?</h6>

          <div className="flex justify-center gap-8">

            <button onClick={() => { removeProduct(id); }} className="btn btn-sm" >
              <span className={`${loading ? "hidden" : ""}`}>OK</span>
              <div className={`flex justify-center items-center gap-3 ${ loading ? "" : "hidden" }`}>
                <span className="loading loading-spinner loading-xs"></span>Deleting...
              </div>
            </button>

            <button onClick={() => { document.getElementById(`modal_${id}`).close(); }} className="btn btn-sm">
              Cancel
            </button>

          </div>

        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>

      </dialog>

    </>
  );
}

export default RemoveProduct;
