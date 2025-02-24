import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import http_request from '.././../../../http-request'
import { ToastMessage } from "@/app/components/common/Toastify";
import { Toaster } from "react-hot-toast";
export default function SparePartsForm({ sparepart ,RefreshData,onClose,brands,centers}) {

const [loading,setLoading]=useState(false)

  const { register, control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
        brandId: "",
        brandName: "",
        serviceCenterId: "",
        serviceCenter: "",
      spareParts: [{ sparePartId: "", sparePartName: "", quantity: "", price: "" }],
      docketNo: "",
      trackLink: "",
      chalanImage: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "spareParts",
  });
  const selectedBrandId = watch("brandId");
  // console.log("selectedBrandId",selectedBrandId);
  // Filter spare parts by selected brand
  const filteredSpareParts = sparepart.filter(part => part.brandId === selectedBrandId);
// console.log("filteredSpareParts",filteredSpareParts);

  // Watch selected spare parts to prevent duplicates
  const selectedSpareParts = watch("spareParts").map(part => part.sparePartId);
 

  const onSubmit = async (data) => {
    // console.log(data,"data");
    
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("brandId", data.brandId);
      formData.append("brandName", data.brandName);
      formData.append("serviceCenterId", data.serviceCenterId);
      formData.append("serviceCenter", data.serviceCenter);
      formData.append("docketNo", data.docketNo);
      formData.append("trackLink", data.trackLink);
      formData.append("chalanImage", data.chalanImage[0]); 
      formData.append("spareParts", JSON.stringify(data.spareParts));

      const response = await http_request.post("/addOrder", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      reset();
        RefreshData(response?.data)
        ToastMessage(response?.data);
        setLoading(false)
        onClose()
    } catch (error) {
      console.error("Order submission error:", error);
  
         ToastMessage(error?.response?.data);
         onClose()
         setLoading(false)
    }
  };
   
 
  return (

    <div className="max-w-2xl mx-auto p-2 bg-white shadow-lg rounded-lg">
      <Toaster />
    <h2 className="text-xl font-semibold mb-4">Spare Parts Form</h2>
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className="mb-4">
          <label className="block font-medium">Select Brand</label>
          <select
            {...register("brandId", { required: "Brand is required" })}
            onChange={(e) => {
              const selectedBrand = brands.find(brand => brand._id === e.target.value);
              setValue("brandId", selectedBrand._id);
              setValue("brandName", selectedBrand.brandName);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Brand</option>
            {brands?.map((brand) => (
              <option key={brand._id} value={brand._id}>{brand.brandName}</option>
            ))}
          </select>
          {errors.brandId && <p className="text-red-500">{errors.brandId.message}</p>}
        </div>

        {/* Service Center Selection */}
        <div className="mb-4">
          <label className="block font-medium">Select Service Center</label>
          <select
            {...register("serviceCenterId", { required: "Service Center is required" })}
            onChange={(e) => {
              const selectedServiceCenter = centers.find(center => center._id === e.target.value);
              setValue("serviceCenterId", selectedServiceCenter._id);
              setValue("serviceCenter", selectedServiceCenter.serviceCenterName);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Service Center</option>
            {centers?.map((center) => (
              <option key={center._id} value={center._id}>{center.serviceCenterName}</option>
            ))}
          </select>
          {errors.serviceCenterId && <p className="text-red-500">{errors.serviceCenterId.message}</p>}
        </div>
        {fields.map((item, index) => (
          <div key={item.id} className="mb-4 rounded-md">
            <div className="flex gap-3">
              {/* Spare Part Selection */}
              <select
                {...register(`spareParts.${index}.sparePartId`, { required: "Select a spare part" })}
                onChange={(e) => {
                  const selectedPart = filteredSpareParts.find(part => part._id === e.target.value);
                  setValue(`spareParts.${index}.sparePartId`, selectedPart?._id || "");
                  setValue(`spareParts.${index}.sparePartName`, selectedPart?.partName || "");
                }}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Spare Part</option>
                {filteredSpareParts
                  .filter(part => !selectedSpareParts.includes(part._id) || part._id === watch(`spareParts.${index}.sparePartId`))
                  .map((part) => (
                    <option key={part._id} value={part._id}>{part.partName}</option>
                  ))}
              </select>
              {errors.spareParts?.[index]?.sparePartId && <p className="text-red-500">{errors.spareParts[index].sparePartId.message}</p>}

              {/* Hidden Spare Part Name Field (Auto-filled) */}
              <input type="hidden" {...register(`spareParts.${index}.sparePartName`)} />

              {/* Quantity */}
              <input
                {...register(`spareParts.${index}.quantity`, { required: "Enter quantity" })}
                placeholder="Quantity"
                type="number"
                className="w-1/3 p-2 border rounded"
              />
              {errors.spareParts?.[index]?.quantity && <p className="text-red-500">{errors.spareParts[index].quantity.message}</p>}

              {/* Price */}
              <input
                {...register(`spareParts.${index}.price`, { required: "Enter price" })}
                placeholder="Price"
                type="number"
                className="w-1/3 p-2 border rounded"
              />
              {errors.spareParts?.[index]?.price && <p className="text-red-500">{errors.spareParts[index].price.message}</p>}

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            </div>
          </div>
        ))}


      {/* Add Spare Part Button */}
      <button
        type="button"
        onClick={() => append({ sparePartId: "", sparePartName: "", quantity: "", price: "" })}
        className="bg-[#09090b] text-white p-2 rounded mb-4"
        disabled={selectedSpareParts.length >= sparepart.length}
      >
        ➕  
      </button>

      {/* Docket Number */}
      <div className="mb-4">
        <label className="block font-medium">Docket Number</label>
        <input
          {...register("docketNo", { required: "Docket Number is required" })}
          placeholder="Enter Docket No."
          className="w-full p-2 border rounded"
        />
        {errors.docketNo && <p className="text-red-500">{errors.docketNo.message}</p>}
      </div>

      {/* Tracking Link */}
      <div className="mb-4">
        <label className="block font-medium">Tracking Link</label>
        <input
          {...register("trackLink", { required: "Tracking Link is required" })}
          placeholder="Enter Tracking Link"
          className="w-full p-2 border rounded"
        />
        {errors.trackLink && <p className="text-red-500">{errors.trackLink.message}</p>}
      </div>

      {/* Chalan Image Upload */}
      <div className="mb-4">
        <label className="block font-medium">Chalan Image</label>
        <input
          {...register("chalanImage", { required: "Chalan Image is required" })}
          type="file"
          className="w-full p-2 border rounded"
        />
        {errors.chalanImage && <p className="text-red-500">{errors.chalanImage.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="block w-full bg-green-500 text-white p-2 rounded"
      >
       {loading?"Submitting......":"Submit"}
      </button>
    </form>
  </div>
  );
}
