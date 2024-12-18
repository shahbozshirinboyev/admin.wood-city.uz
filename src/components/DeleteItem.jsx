import { useState } from "react";
import supabase from "../services/supabase";

function DeleteItem({ id, getData }) {
  const [loading, setLoading] = useState(false);

  async function deleteRowById(id) {
    setLoading(true);
    const { data, error } = await supabase
      .from("furniture")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error.message);
    } else {
      console.log(data); 
      getData();
      document.getElementById(`my_modal_${id}`).close();
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          document.getElementById(`my_modal_${id}`).showModal();
        }}
        className="btn btn-sm"
      >
        <i className="bi bi-trash3 text-[16px]"></i>
      </button>

      <dialog id={`my_modal_${id}`} className="modal">
        <div className="modal-box">
          <h6 className="pb-4 text-[16px]">Delete product menu?</h6>
          <div className="flex justify-center gap-8">
            <button
              onClick={() => {
                deleteRowById(id);
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
                document.getElementById(`my_modal_${id}`).close();
              }}
              className="btn btn-sm"
            >
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

export default DeleteItem;
