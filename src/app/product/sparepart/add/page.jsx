 

"use client"
import React, { useState, useEffect } from 'react';
import http_request from "../../../../../http-request";
import { ToastMessage } from '@/app/components/common/Toastify';
import Images from './Image';
import BasicInformation from './BasicInformation';
import Sidenav from '@/app/components/Sidenav';
import { useRouter } from 'next/navigation';
import { ReactLoader } from '@/app/components/common/Loading';



function SparePartAdd() {
const router=useRouter()

    const [loading, setLoading] = useState(false);

    
    const [categories, setCategory] = useState([]);
    const [products, setProduct] = useState([]);
    const [productData, setProductData] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {

        GetAllCategory();
        GetAllProducts();
       

    }, [])

    const [sparePart, setSpareParts] = useState({
        partName: "",
        description: "",
        MRP: "",
        bestPrice: "",
        category: "",
        technician: "",
        faultType: [],
        brandName: "",
        partNo: "",
        productModel: "",
        images: []
    })

   
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
        let sparePart1 = { ...sparePart };
        sparePart1[input.name] = input.value;
        const updatedErrors = { ...errors };
        if (updatedErrors[input.name]) {
            delete updatedErrors[input.name];
        }
        setErrors(updatedErrors);
        setSpareParts(sparePart1);
    }
   
    const handleProductData=(data)=>{
        setProductData(data)
      
        
    }
    
    
    const handleImage = (file) => {
        let sparePart1 = { ...sparePart };
        sparePart1?.images?.push(file);
        setSpareParts(sparePart1);
        // setSpareParts({...sparePart,images:file});
    }

  


    const handleSubmit = (e) => {
        // e.preventDefault();
       
        const errors1 = {};
        const { partName,
            description,
            MRP,
            bestPrice,
            category,
            technician,
            faultType,
            brandName,
            partNo,
            productModel,
            image, skuNo, length, breadth, height, weight } = sparePart;
        errors1.partName = !partName
            ? "Part name is required"
            : "";
        errors1.MRP = !MRP
            ? "MRP is required"
            : isNaN(MRP)
                ? "MRP should be number"
                : "";
        errors1.bestPrice = !bestPrice ? "Best Price is required" : isNaN(bestPrice) ? "Best Price should be number" : "";
        errors1.category = !category ? "Category is required" : "";
       
        errors1.skuNo = !skuNo ? "Sku number is required" : "";
        errors1.length = !length ? "Length is required" : +length <= 0.5 ? "Length should be greater than 0.5" : isNaN(length) ? "Length should be number" : "";
        errors1.breadth = !breadth ? "Breadth is required" : +breadth <= 0.5 ? "Length should be greater than 0.5" : isNaN(breadth) ? "Breadth should be number" : "";
        errors1.height = !height ? "Height is required" : +height <= 0.5 ? "Length should be greater than 0.5" : isNaN(height) ? "Height should be number" : "";
        errors1.weight = !weight ? "Weight is required" : isNaN(weight) ? "Weight should be number" : weight > 1000 ? "weight should not be greater than 1000" : "";

        let keys = Object.keys(errors1);
        let count = keys.reduce((acc, curr) => (errors1[curr] ? acc + 1 : acc), 0);
        if (count === 0) {
            console.log("ffgff");
            addSparePart();
        } else {
            console.log("djhjhjh");
            setErrors(errors1);
        }
     
        
    };

    const addSparePart = async () => {
        try {
            let user = localStorage.getItem("user");
            let obj = JSON.parse(user);
            
            const role = obj?.role === "ADMIN" ? "BRAND" : obj?.role;
            let technician = +sparePart?.technician;
            let product = products?.data?.find(p1 => (p1.productName === sparePart.productModel && p1?.brandName === sparePart?.brandName));
            const id = obj?.role === "ADMIN" ? product?.userId : obj?._id
            const formData = new FormData();
            formData.append("partName", sparePart?.partName);
            formData.append("description", sparePart?.description);
            formData.append("MRP", sparePart?.MRP);
            formData.append("bestPrice", sparePart?.bestPrice);
            // formData.append("technician",technician);
            if(obj?.user?.role==="BRAND EMPLOYEE"){
                formData.append("brandId", obj?.user?.brandId);
            formData.append("brandName",obj?.user?.brandName);
            }else{
                formData.append("brandId", obj?.user?._id);
                formData.append("brandName",obj?.user?.brandName);
            }
         
            formData.append("skuNo", sparePart?.skuNo);
            formData.append("partNo", sparePart?.partNo);
            formData.append("length", +sparePart?.length);
            formData.append("weight", +sparePart?.weight);
            formData.append("height", +sparePart?.height);
            formData.append("breadth", +sparePart?.breadth);
            formData.append("seller", role);
            // sparePart?.faultType.forEach(fault => formData.append('faultType', fault))
            formData.append("category", sparePart?.category);
            // formData.append("productModel", sparePart?.productModel);
            for (let x = 0; x < sparePart?.images?.length; x++) {
                formData.append("images", sparePart?.images[x]);
            }
            for (let y = 0; y < productData?.length; y++) {
                formData.append(`products[${y}][productId]`, productData[y].productId);
                formData.append(`products[${y}][productName]`, productData[y].productName);
            }
            // formData.append("userId", "id");
            // formData.append("productId", "product?._id");
            // formData.append("brandName", "sparePart?.brandName");
            setLoading(true);
            let response = await http_request.post("/addSparepart", formData);
            let { data } = response;
            setLoading(false);
            ToastMessage(data);
            router.push("/product/sparepart")
            // setSpareParts({ partName: "", brandName: "", description: "", MRP: "", bestPrice: "", faultType: [], images: [], technician: "", partNo: "", length: "", weight: "", height: "", breadth: "", skuNo: "" });
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

    let obj = "user"
    let user = obj;
    return (
        <Sidenav>
            <div className="container mx-auto px-4 xl:px-0">
               {loading===true ? <ReactLoader/>
               : <div className="flex flex-wrap -mx-3">
                    <div className="w-full px-3">
                        <div className="mb-3 p-4 bg-white shadow rounded-lg">
                            <BasicInformation
                                errors={errors}
                                user={user}
                             
                               handleProductData={handleProductData}
                                products={products}
                                categories={categories}
                                sparePart={sparePart}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3 p-4 bg-white shadow rounded-lg">
                            <Images product={sparePart} onImage={handleImage} />
                        </div>
                        <div className="mb-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full uppercase px-5 py-2 bg-blue-500 text-white font-bold rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                                onClick={()=>handleSubmit()}
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>

                    </div>
                </div>
}
            </div>

        </Sidenav>
    )
}
export default SparePartAdd;