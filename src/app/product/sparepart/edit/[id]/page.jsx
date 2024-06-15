"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import EditBasicInformation from '../EditBasicInformation';
import EditImages from '../EditImage';
import http_request from "../../../../../../http-request";
import Sidenav from '@/app/components/Sidenav';
import { ToastMessage } from '@/app/components/common/Toastify';


function SparePartEdit({ params }) {

  const router = useRouter()
  

  const [randomValue, setRandomValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [img, setImage] = useState("");

  const [spareParts, setSpareParts] = useState({})
  const [categories, setCategory] = useState([]);
  const [products, setProduct] = useState([]);
  let obj = "user";
  let user = obj;
  useEffect(() => {
    GetSparepart()
    GetAllCategory();
    GetAllProducts();

  }, []);

  const GetSparepart = async () => {
    try {
      let response = await http_request.get(`/getSparepartById/${params?.id}`)
      let { data } = response
      setSpareParts(data);
    }
    catch (err) {
      console.log(err)


    }
  }
 
  const GetAllCategory = async () => {
    try {
      let response = await http_request.get("/getAllProductCategory")
      let { data } = response
      setCategory(data);
    }
    catch (err) {
      console.log(err)


    }
  }
  const GetAllProducts = async () => {
    try {
      let response = await http_request.get("/getAllProduct")
      let { data } = response
      setProduct(data);
    }
    catch (err) {
      console.log(err)


    }
  }
  const handleChange = (e) => {
    const { currentTarget: input } = e;
    let sparePart1 = { ...spareParts };
    sparePart1[input.name] = input.value;
    setSpareParts(sparePart1);
  }
  const handleImage = (file) => {
    setImage(file);
    // setSpareParts({...sparePart,images:file});
  }

 
  

  const changeRandom = () => {
    let x = Math.floor((Math.random() * 10) + 1);
    setRandomValue(x)
  }

  //  console.log("sparePart",sparePart);
  const editProduct = async () => {
    // let pdId = products?.data?.find(f1 => f1?.productName === sparePart?.productModel)
    // let obj = {
    //   productId: pdId?._id, partName: sparePart?.partName, category: sparePart?.category, description: sparePart?.description,
    //   MRP: sparePart?.MRP, bestPrice: sparePart?.bestPrice, productModel: sparePart?.productModel, faultType: sparePart?.faultType, partNo: sparePart?.partNo, skuNo: sparePart?.skuNo, length: sparePart?.length, breadth: sparePart?.breadth, height: sparePart?.height, weight: sparePart?.weight
    // };
    try {
      setLoading(true);
      let response = await http_request.patch(`/editSparepart/${params?.id}`, spareParts);
      let { data } = response;
      setLoading(false);
      ToastMessage(data);
      router.push(`/product/sparepart`)
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  return (
    <Sidenav>
      <div className="container-xxl">

        <div className="row g-3">

          <div className="col-xl-12 col-lg-12">
            <div className="card mb-3">
              <EditBasicInformation user={user}   products={products} categories={categories} sparePart={spareParts} onChange={handleChange} />
            </div>

            <div className="card mb-3">
              <EditImages id={params?.id} img={img} setImage={setImage} sparePart={spareParts} onImage={handleImage} changeRandom={changeRandom} />
            </div>
            <div className="card mb-3">
              <button
                type="submit"
                disabled={loading}
                className={`btn p-2 rounded-md w-full text-uppercase px-5 ${loading ? 'bg-blue-500 opacity-50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                onClick={editProduct}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </Sidenav>
  )
}
export default SparePartEdit;