import { useEffect, useState } from "react";
import supabase from "./services/supabase";

// components
import DeleteItem from "./components/DeleteItem";
import AddProductType from "./components/AddProductType";
import RemoveProductType from "./components/RemoveProductType";
import AddProduct from "./components/AddProduct";
import RemoveProduct from "./components/RemoveProduct";
import AddNewFurniture from "./components/AddNewFurniture";
import ProductDescription from "./components/ProductDescription";
import EditItem from "./components/EditItem";
import EditProductType from "./components/EditProductType";
import SignIn from "./components/SignIn";

function App() {
  const [login, setLogin] = useState(localStorage.getItem('login'))
  
  const [activeType, setActiveType] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState("");
  const [activeMenuTypeId, setActiveMenuTypeId] = useState("");
  const [activeProducts, setActiveProducts] = useState([]);

  const handleMouseEnterMenu = (id) => { setActiveMenuId(id); };
  const handleMouseEnterType = (id) => { setActiveMenuTypeId(id); };

  const [selectMenuInfo, setSelectMenuInfo] = useState({ menu_id: "", types: [] });
  const [allProduct, setAllProduct] = useState([]);

  const getData = async () => {
    const { data, error } = await supabase.from("furniture").select("*");
    if (error) {
      console.error(error);
    } else {
      // console.log(data);
      setAllProduct(data);

      if (activeMenuTypeId !== "" && activeMenuId !== "") {
        const selectedFurniture = data.find((item) => item.id === activeMenuId);
        if (selectedFurniture) {
          const selectedType = selectedFurniture.types.find(
            (type) => type.id === activeMenuTypeId
          );
          if (selectedType) {
            setActiveProducts(selectedType.products || []);
          } else {
            console.error("No type found for the given activeMenuTypeId");
            setActiveProducts([]);
          }
        } else {
          console.error("No furniture found for the given activeMenuId");
          setActiveProducts([]);
        }
      }
    }
  };
  useEffect(() => { getData(); }, []);

  const uploadImageAndGetUrl = async (file) => {
    const bucketName = "woodcity";
    const filePath = `${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) {
      console.error("Rasm yuklashda xatolik:", error.message);
      return null;
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const [rotate, setRotate] = useState(false);

  const handleClickRefresh = () => {
    setRotate(true);
    setTimeout(() => setRotate(false), 1000);
    setTimeout(() =>  window.location.reload(), 1000);
  };

  return (
    <>
      <SignIn login={login} setLogin={setLogin} getData={getData} />

      <AddProductType selectMenuInfo={selectMenuInfo} getData={getData} />

      { login === 'true' && activeType && (
        <div className="container">

          <div className="mt-6 flex justify-between items-center">

            <div className="flex gap-4 justify-start items-center">

              <button onClick={() => { setActiveType(true); }} className={`btn btn-sm ${activeType ? "opacity-70 cursor-not-allowed" : ""}`}>
                <i className="bi bi-house"></i> Главная
              </button>

              <button onClick={() => { handleClickRefresh(); getData(); }} className={`btn btn-sm ${rotate ? 'bg-sky-500 text-white hover:text-white border-0 hover:bg-sky-500' : ''}`}>
                <i className={`bi bi-arrow-clockwise flex justify-center items-center ${rotate ? 'animate-spin' : ''}`}></i>
              </button>

              <button onClick={() => { localStorage.removeItem('login'); setLogin('') }} className={`btn btn-sm hover:bg-red-600 hover:border-red-600 hover:text-white`}>
                <i className={`bi bi-box-arrow-right flex justify-center items-center`}></i>
              </button>

            </div>  

            <AddNewFurniture getData={getData} uploadImageAndGetUrl={uploadImageAndGetUrl} />
        
          </div>


          {allProduct.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((item) => (
            <div key={item.id}>
              {/* Furniture type START */}
              <div className="border my-4 px-4 transition-all duration-300 hover:border-sky-500" onMouseEnter={() => handleMouseEnterMenu(item.id)}>

                <div className="text-xl md:text-2xl lg:text-3xl font-bold py-4 flex gap-4 justify-between items-center">
                  <div className="flex justify-start items-center gap-4">
                    <img
                      src={item?.icon}
                      alt=""
                      className="w-[25px] h-[25px] object-cover"
                    />
                    <h1 className="text-[20px]">{item?.name}</h1>
                  </div>
                  <div className="flex justify-center items-center gap-4">
                    <EditItem item={item} getData={getData} />
                    <DeleteItem id={item.id} getData={getData} />
                  </div>
                </div>

                <div className="flex gap-4 mb-6">
                  <p className="text-[14px] w-full text-justify">{item?.description}</p>
                  <img
                    src={item?.image}
                    alt={item?.name}
                    className="w-auto h-[100px] object-cover"
                  />
                </div>
                <div className="border px-2 py-1 mb-3 flex justify-start items-center">
                  <p className="font-semibold w-full flex justify-start items-center">
                    <span>Количество типов продуктов:</span>&nbsp;
                    <span className="text-red-700">{item.types.length}</span>
                  </p>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      document.getElementById("AddProductType").showModal();
                      setSelectMenuInfo({
                        menu_id: item.id,
                        types: item.types,
                      });
                    }}
                  >
                    <i className="bi bi-plus-lg"></i>
                    Добавить
                  </button>
                </div>

                {/* Furniture type END */}
                {item.types.length === 0 ? (
                  <div className="text-center mt-4 flex justify-center items-center gap-2">
                    <i className="bi bi-folder-x text-3xl"></i>
                    <span>Нет типа продукта...</span>
                  </div>
                ) : (
                  ""
                )}

                {item?.types && (
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
                    {item.types.map((product) => (
                      <div
                        onMouseEnter={() => handleMouseEnterType(product.id)}
                        className="border hover:border-green-500 transition-all duration-300 p-4 group transition-all duration-300 ease-in-out transform hover:scale-100 flex flex-col justify-between"
                        key={product.id}
                      >
                        <div className="flex justify-start items-start">
                          <div className="w-full">
                            <h1 className="font-semibold">{product.name}</h1>
                            <span className="font-bold opacity-40 text-[14px]">
                              {product.price}
                            </span>
                          </div>

                          <div className="flex justify-center items-center gap-4">
                            <EditProductType productType={product} getData={getData} />
                            <RemoveProductType id={product.id} getData={getData} />
                          </div>

                        </div>
                        <div
                          onClick={() => {
                            setActiveType(false);
                            setActiveProducts(product.products);
                          }}
                          className="py-6 flex justify-center items-end mt-2 cursor-pointer"
                        >
                          <i className="bi bi-chevron-right opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                          <img
                            src={product.image}
                            className="mx-auto h-[50px] transition-all duration-300 ease-in-out transform group-hover:scale-110"
                            alt=""
                          />
                        </div>
                        <div className="text-justify text-[12px]">{product.description}</div>
                      </div>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      { login === 'true' && !activeType && (
        <div className="container">

          <div className="mt-6 flex justify-between items-center">
          <div className="flex gap-4 justify-start items-center">

            <button onClick={() => { setActiveType(true); }} className="btn btn-sm">
              <i className="bi bi-house"></i> Главная
            </button>

            <button onClick={() => { handleClickRefresh(); getData(); }} className={`btn btn-sm ${rotate ? 'bg-sky-500 text-white hover:text-white border-0 hover:bg-sky-500' : ''}`}>
                <i className={`bi bi-arrow-clockwise flex justify-center items-center ${rotate ? 'animate-spin' : ''}`}></i>
              </button>

            </div>

            <AddProduct uploadImageAndGetUrl={uploadImageAndGetUrl} getData={getData} activeMenuTypeId={activeMenuTypeId} activeMenuId={activeMenuId} />
          </div>

          {activeProducts.length === 0 ? (
            <div className="flex justify-center items-center w-full mt-12">
              <p className="text-center my-4 flex justify-center items-center gap-2">
                {/* <i className="bi bi-diagram-3 text-3xl"></i> */}
                <i className="bi bi-info-circle text-3xl"></i>
                <span>Нет продукта ...</span>
              </p>
            </div>
          ) : (
            // Card Design START
            <div className="grid grid-cols-2 md:grid-cols-3  xl:grid-cols-4 gap-4 my-4">
              {activeProducts?.map((product, index) => (
                <div className="border p-4 relative" key={index}>
                  <span className={`absolute top-1 left-1 text-[12px] px-1 py-[3px] ${product.best_seller ? "bg-green-400" : "bg-red-400 line-through"}`}>
                    Лидеры продаж
                  </span>

                  <div className="flex justify-center items-center mb-3">
                    <div className="carousel carousel-vertical w-full h-[250px]">
                      {product.images_product.map((url, index) => (
                        <div
                          key={index}
                          className="carousel-item h-full object-cover"
                        >
                          <img src={url} className="w-full h-full" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <p className="text-start line-clamp-2 font-semibold w-full">
                      {product?.title}
                    </p>
                    <div className="text-end">
                      <p className="whitespace-nowrap font-semibold">
                        {product?.price} сум
                      </p>
                      <p className="whitespace-nowrap line-through text-[14px] font-semibold opacity-50">
                        {product?.fix_price} сум
                      </p>
                    </div>
                  </div>

                  <div className="py-4">
                    <p className="font-semibold">Габариты:</p>
                    <div className="grid grid-cols-3 text-start text-[14px] gap-2 py-1">
                      <div>
                        <p className="opacity-60">Длина</p>{" "}
                        <p>{product?.length} см</p>
                      </div>
                      <div>
                        <p className="opacity-60">Ширина</p>{" "}
                        <p>{product?.width} см</p>
                      </div>
                      <div>
                        <p className="opacity-60">Высота</p>{" "}
                        <p>{product?.height} см</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <RemoveProduct
                      getData={getData}
                      activeMenuTypeId={activeMenuTypeId}
                      activeMenuId={activeMenuId}
                      id={product.id}
                    />
                    <ProductDescription product={product} />
                  </div>
                </div>
              ))}
            </div>
            // Card Design END 
          )}
        </div>
      )}
    </>
  );
}

export default App;
