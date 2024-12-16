import { useEffect, useState } from "react";
import supabase from "./services/supabase";
import DeleteItem from "./components/DeleteItem";

function App() {
  const [allProduct, setAllProduct] = useState([]);
  const getData = async () => {
    const { data, error } = await supabase.from("furniture").select("*");
    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setAllProduct(data);
    }
  };
  useEffect(() => {
    getData();
  }, []);

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

    const image_png = await uploadImageAndGetUrl(png.file);
    const image_svg = await uploadImageAndGetUrl(svg.file);

    const { data, error } = await supabase
      .from("furniture")
      .insert([
        {
          name: menuData.name,
          description: menuData.description,
          image: image_png,
          icon: image_svg,
        },
      ]);

    if (error) {
      console.error("Xatolik:", error.message);
    } else {
      console.log("Qo'shilgan ma'lumot:", data);
      getData();
    }
  };

  // console.log(allProduct);

  return (
    <>
      <div className="container">
        <div className="my-4">
          <button
            className="btn btn-sm"
            onClick={() => document.getElementById("addFurniture").showModal()}
          >
            Добавить
          </button>
        </div>

        <dialog id="addFurniture" className="modal">
          <div className="modal-box max-w-xl">
            <div>
              <form onSubmit={addNewFurnitureMenu}>
                <div className="flex justify-around items-center">
                  <div className="border-black border border-dotted w-[150px] h-[150px] flex flex-col justify-center items-center">
                    <img
                      src={svg.url}
                      alt=""
                      className={`${svg.url ? "" : "hidden"
                        } w-[100px] h-[100px] object-cover mb-1`}
                    />
                    <p
                      className={`text-[12px] py-1 ${svg.url ? "hidden" : ""}`}
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
                      className={`${png.url ? "" : "hidden"
                        } w-[100px] h-[100px] object-cover mb-1`}
                    />
                    <p
                      className={`text-[12px] py-1 ${png.url ? "hidden" : ""}`}
                    >
                      Select only PNG
                    </p>
                    <label
                      className={`btn btn-sm ${png.url ? "" : ""}`}
                      htmlFor="selectpng"
                    >
                      Select PNG
                    </label>
                    <input
                      className="hidden"
                      accept="image/png"
                      type="file"
                      id="selectpng"
                      onChange={handlePng}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label htmlFor="" className="">
                    <span>Name</span>
                    <input
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
                    <span>Description</span>
                    <textarea
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
                <button className="btn btn-sm mt-3 w-full">Save</button>
              </form>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        {allProduct.map((item) => (
          <div key={item.id}>
            {/* Furniture type START */}
            <div className="border my-2 px-4">
              <div className="text-xl md:text-2xl lg:text-3xl font-bold py-4 flex gap-4 justify-between items-center">
                <div className="flex justify-start items-center gap-4">
                  <img src={item?.icon} alt="" className="w-[25px] h-[25px] object-cover" />
                  <h1>{item?.name}</h1>
                </div>
                <DeleteItem id={item.id} getData={getData} />

              </div>
              <div className="flex gap-4 pb-6">
                <p className="text-[14px] w-full">{item?.description}</p>
                <img
                  src={item?.image}
                  alt={item?.name}
                  className="w-auto h-[100px] object-cover"
                />
              </div>
              {/* <div>{item.types.length}</div> */}
            </div>
            {/* Furniture type END */}
            {/* {item.items.length === 0 ? (
              <p className="text-center text-xl">
                <i className="bi bi-layout-wtf text-3xl"></i> <br /> No product
                type!
              </p>
            ) : (
              ""
            )} */}
            {/* {item?.items && (
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-8 pb-8">
                {item.items.map((product) => (
                  <NavLink
                    className="border p-4 group transition-all duration-300 ease-in-out transform hover:scale-100 flex flex-col justify-between"
                    key={product.id}
                    to="/activefurnituremenuitems"
                    state={{ activeMenuFurniture: product }}
                    onClick={() => {
                      setActiveMenuFurniture(product);
                    }}
                  >
                    <div className="flex-grow">
                      <h1 className="font-semibold">{product.name}</h1>
                      <span className="font-bold opacity-40 text-[14px]">
                        {product.price}
                      </span>
                    </div>
                    <div className="py-6 flex justify-center items-end mt-2">
                      <i className="bi bi-chevron-right opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                      <img
                        src={product.image}
                        className="mx-auto h-[50px] transition-all duration-300 ease-in-out transform group-hover:scale-105"
                        alt=""
                      />
                    </div>
                  </NavLink>
                ))}
              </ul>
            )} */}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
