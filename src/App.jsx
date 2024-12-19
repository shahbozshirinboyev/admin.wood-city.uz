import { useEffect, useState } from "react";
import supabase from "./services/supabase";
import DeleteItem from "./components/DeleteItem";
import AddProductType from "./components/AddProductType";
import RemoveProductType from "./components/RemoveProductType";
import AddProduct from "./components/AddProduct";
import RemoveProduct from "./components/RemoveProduct";

function App() {
  const [activeMenuId, setActiveMenuId] = useState("");
  const [activeMenuTypeId, setActiveMenuTypeId] = useState("");
  const [activeType, setActiveType] = useState(true);
  const [activeProducts, setActiveProducts] = useState([]);

  const handleMouseEnterMenu = (id) => { setActiveMenuId(id); };
  const handleMouseEnterType = (id) => { setActiveMenuTypeId(id); };

  const [loading, setLoading] = useState(false);
  const [allProduct, setAllProduct] = useState([]);

  const getData = async () => {
    const { data, error } = await supabase.from("furniture").select("*");
    if (error) {
      console.error(error);
    } else {
      console.log(data);
      setAllProduct(data);

      if (activeMenuId !== "") {
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

  const [svg, setSvg] = useState({ file: "", url: "" });
  const handleSvg = (e) => {
    if (e.target.files[0]) {
      setSvg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const [png, setPng] = useState({ file: "", url: "" });
  const handlePng = (e) => {
    if (e.target.files[0]) {
      setPng({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const [menuData, setMenuData] = useState({ name: "", description: "" });
  const inputHandle = (e) => {
    const { name, value } = e.target;
    setMenuData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const uploadImageAndGetUrl = async (file) => {
    const bucketName = "woodcity";
    const filePath = `${Date.now()}_${file.name}`;

    // Rasmni yuklash
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) {
      console.error("Rasm yuklashda xatolik:", error.message);
      return null;
    }
    // URL olish
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const addNewFurnitureMenu = async (e) => {
    e.preventDefault();
    setLoading(true);

    let image_png;
    if (png.file !== "") {
      image_png = await uploadImageAndGetUrl(png.file);
    } else {
      image_png =
        "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg";
    }
    let image_svg;
    if (svg.file !== "") {
      image_svg = await uploadImageAndGetUrl(svg.file);
    } else {
      image_svg =
        "https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg";
    }

    const { data, error } = await supabase.from("furniture").insert([
      {
        name: menuData.name,
        description: menuData.description,
        image: image_png,
        icon: image_svg,
        types: [],
      },
    ]);

    if (error) {
      console.error("Xatolik:", error.message);
    } else {
      console.log("Qo'shilgan ma'lumot:", data);
      getData();
      setLoading(false);
      document.getElementById("addFurniture").close();
      setPng({ file: "", url: "" });
      setSvg({ file: "", url: "" });
      setMenuData({ name: "", description: "" });
    }
  };

  // AddProductType section ---- START
  const [selectMenuInfo, setSelectMenuInfo] = useState({
    menu_id: "",
    types: [],
  });
  // AddProductType section ---- END

  return (
    <>
      <AddProductType selectMenuInfo={selectMenuInfo} getData={getData} />
      <AddProduct uploadImageAndGetUrl={uploadImageAndGetUrl} getData={getData} activeMenuTypeId={activeMenuTypeId} activeMenuId={activeMenuId} />

      {activeType && (
        <div className="container">

          <div className="my-4 flex justify-end items-center">
            <button className="btn btn-sm" onClick={() => document.getElementById("addFurniture").showModal()}>
              <i className="bi bi-plus-lg"></i>Добавить
            </button>
          </div>

          <dialog id="addFurniture" className="modal">
            <div className="modal-box max-w-xl">
              <div>
                <form onSubmit={addNewFurnitureMenu}>
                  <div>
                    <label htmlFor="" className="">
                      <span>
                        Name<span className="text-red-600">*</span>
                      </span>
                      <input
                        required
                        name="name"
                        value={menuData.name}
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
                        value={menuData.description}
                        onChange={inputHandle}
                        type="text"
                        rows="4"
                        placeholder="Type here ..."
                        className="border w-full px-2 py-1 rounded-md"
                      ></textarea>
                    </label>
                  </div>
                  <div className="flex justify-around items-center mt-3">
                    <div className="border-black border border-dotted w-[150px] h-[150px] flex flex-col justify-center items-center">
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
                    </div>

                    <div className="border-black border border-dotted w-[150px] h-[150px] flex flex-col justify-center items-center">
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
                    </div>
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
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>

          {allProduct
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            .map((item) => (
              <div key={item.id}>
                {/* Furniture type START */}
                <div
                  className="border my-2 px-4"
                  onMouseEnter={() => handleMouseEnterMenu(item.id)}
                >
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold py-4 flex gap-4 justify-between items-center">
                    <div className="flex justify-start items-center gap-4">
                      <img
                        src={item?.icon}
                        alt=""
                        className="w-[25px] h-[25px] object-cover"
                      />
                      <h1 className="text-[20px]">{item?.name}</h1>
                    </div>
                    <DeleteItem id={item.id} getData={getData} />
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
                    <div className="text-center mt-4">
                      <i className="bi bi-folder-x text-3xl text-red-700 opacity-75"></i>
                      <p className="text-[14px]">Нет типа продукта...</p>
                    </div>
                  ) : (
                    ""
                  )}

                  {item?.types && (
                    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
                      {item.types.map((product) => (
                        <div
                          onMouseEnter={() => handleMouseEnterType(product.id)}
                          className="border p-4 group transition-all duration-300 ease-in-out transform hover:scale-100 flex flex-col justify-between"
                          key={product.id}
                          // to="/activefurnituremenuitems"
                          // state={{ activeMenuFurniture: product }}
                          // onClick={() => { setActiveMenuFurniture(product); }}
                        >
                          <div className="flex justify-start items-start">
                            <div className="w-full">
                              <h1 className="font-semibold">{product.name}</h1>
                              <span className="font-bold opacity-40 text-[14px]">
                                {product.price}
                              </span>
                            </div>

                            <RemoveProductType
                              id={product.id}
                              getData={getData}
                            />
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

      {!activeType && (
        <div className="container">
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => {
                setActiveType(true);
              }}
              className="btn btn-sm"
            >
              <i className="bi bi-house"></i>
              Главная
            </button>

            <button
              onClick={() => document.getElementById("addproduct").showModal()}
              className="btn btn-sm"
            >
              <i className="bi bi-plus-lg"></i>
              Добавить
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3  xl:grid-cols-4 gap-4 my-4">
            {/* Card Design START */}
            {activeProducts?.map((product, index) => (
              <div className="border p-4 relative" key={index}>
                <span
                  className={`absolute top-1 left-1 text-[12px] px-1 py-[3px] 
                ${
                  product.best_seller
                    ? "bg-green-400"
                    : "bg-red-400 line-through"
                }`}
                >
                  Лидеры продаж
                </span>

                {/* <div className="flex flex-wrap justify-center items-center pb-4 gap-2">
                  {product.images_product.map((url, index) => (
                    <img
                      src={url}
                      key={index}
                      className="w-[70px] h-[70px] border"
                    />
                  ))}
                </div> */}

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
                  <button className="btn btn-sm flex-grow">
                    {" "}
                    <i className="bi bi-menu-button-wide-fill"></i>{" "}
                  </button>
                </div>
              </div>
            ))}

            {/* Card Design END */}
          </div>

          {activeProducts.length === 0 ? (
            <div className="flex justify-center items-center w-full">
              <p className="text-center my-4">
                <i className="bi bi-diagram-3 text-3xl"></i>
                <br /> No product ...
              </p>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </>
  );
}

export default App;
