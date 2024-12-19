import React from 'react'

function ProductDescription({product}) {
  return (
    <>
        <button className="btn btn-sm flex-grow" 
            onClick={()=>{ document.getElementById(`product_description_${product.id}`).showModal() }}>
            <i className="bi bi-menu-button-wide-fill"></i>
        </button>

        <dialog id={`product_description_${product.id}`} className="modal">
        <div className="modal-box max-w-2xl">
            <>
                <div>
                    <h4 className='mb-4 text-[18px] font-bold'>{product?.description_title}</h4>
                    <p className='text-justify mb-3'>{product.description}</p>
                </div>
                <img src={product.image_des} alt="" className='w-full h-[400px] object-cover' />
            </>
        </div>
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
        </dialog>
    </>
  )
}

export default ProductDescription