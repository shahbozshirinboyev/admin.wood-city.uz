import supabase from "../services/supabase";
import { v4 as uuidv4 } from 'uuid';

function AddProductType({selectMenuInfo}) {

    const addProductType = async() => {
        const { data, error } = await supabase
        .from('furniture')
        .update({ types: [...(selectMenuInfo.types || []), { id: uuidv4(), name: "Gulzoda" }] })
        .eq('id', selectMenuInfo.menu_id);
      
      if (error) {
        console.error('Error:', error);
      } else {
        console.log('Data updated:', data);
      }
      
            
    }
  return (
    <>
      <dialog id="AddProductType" className="modal">
        <div className="modal-box">
          <>




          
          <span>Menu ID: {selectMenuInfo.menu_id}</span> <br />
          <button className="btn btn-sm" onClick={()=>{addProductType();}}>Add</button>
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
