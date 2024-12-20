import { useState, useEffect } from "react";
import supabase from "../services/supabase";

function RemoveProductType({ id, getData }) {
  const [loading, setLoading] = useState(false);
  const removeTypeByIdFromAllRows = async (typeIdToDelete) => {
    setLoading(true);
    try {
      // 1. Jadvaldagi barcha qatorlarni olish
      const { data: allData, error: fetchError } = await supabase
        .from("furniture") // jadval nomi
        .select("id, types"); // "id" va "types" ustunlari

      if (fetchError) {
        throw fetchError;
      }

      // 2. Har bir qatorni tekshirib, kerakli ID ni o'chirish
      for (const row of allData) {
        const { id, types } = row;

        // Agar types mavjud bo'lsa va ichida kerakli ID bo'lsa
        if (types && types.some((type) => type.id === typeIdToDelete)) {
          // ID bo'yicha filter qilib yangilangan types massivini yaratish
          const updatedTypes = types.filter(
            (type) => type.id !== typeIdToDelete
          );

          // 3. Yangilangan "types" ni saqlash
          const { error: updateError } = await supabase
            .from("furniture") // jadval nomi
            .update({ types: updatedTypes }) // yangilangan types
            .eq("id", id); // qatorning ID si

          if (updateError) {
            console.error(`Error updating row ${id}:`, updateError.message);
          } else {
            console.log(`Row ${id} updated successfully.`);
          }
        }
      }

      console.log("All rows checked and updated.");
    } catch (error) {
      console.error("Error:", error.message);
    }
    getData();
    setLoading(false);
  };
  return (
    <>
      <button className="btn btn-sm" onClick={() => { document.getElementById(`modal_${id}`).showModal(); }}>
            <i className={`bi bi-trash3`}></i>
        </button>

      <dialog id={`modal_${id}`} className="modal">
        <div className="modal-box">
          <h6 className="pb-4 text-[16px]">Delete product type?</h6>
          <div className="flex justify-center gap-8">
            <button
              onClick={() => {
                removeTypeByIdFromAllRows(id);
              }}
              className="btn btn-sm"
            >
              <span className={`${loading ? "hidden" : ""}`}>OK</span>
              <div
                className={`flex justify-center items-center gap-3 ${
                  loading ? "" : "hidden"
                }`}
              >
                <span className="loading loading-spinner loading-xs"></span>
                Deleting...
              </div>
            </button>
            <button
              onClick={() => {
                document.getElementById(`modal_${id}`).close();
              }}
              className="btn btn-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default RemoveProductType;
