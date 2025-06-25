import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import http_request from '.././../../../http-request'
import { ToastMessage } from "@/app/components/common/Toastify";
import { Toaster } from "react-hot-toast";
import { ReactLoader } from "@/app/components/common/Loading";
export default function CreateOrderDialog({ sparepart, userData, RefreshData, onClose, brands, centers }) {

    const [loading, setLoading] = useState(false)

    const { register, control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            brandId: "",
            brandName: "",
            serviceCenterId: "",
            serviceCenter: "",
            spareParts: [{ sparePartId: "", sparePartName: "", quantity: "", price: "" }],

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
        try {
            setLoading(true);

            const pinResponse = await http_request.post('/validate-pincode', {
                orgPincode: data.origin_pincode,
                desPincode: data.dest_pincode,
            });

            const serviceable =
                pinResponse?.data?.valid &&
                pinResponse?.data?.data?.SERV_LIST?.[0]?.b2C_SERVICEABLE === 'YES';

            if (!serviceable) {
                ToastMessage({
                    status: false,
                    msg: "❌ DTDC does not service the selected pincode pair.",
                });
                setLoading(false);
                return;
            }


            const payload = {
                customer_code: data.customer_code || "GL017", // Default fallback
                service_type_id: data.service_type_id || "B2C PRIORITY",
                load_type: data.load_type || "NON-DOCUMENT",
                description: data.description || "Spare Parts Shipment",

                declared_value: parseFloat(data.declared_value),
                num_pieces: parseInt(data.num_pieces),
                length: parseInt(data.length),
                breadth: parseInt(data.width),
                height: parseInt(data.height),
                weight: parseFloat(data.weight),
                origin_details: {
                    name: data.origin_name,
                    phone: data.origin_phone,
                    alt_phone: data.origin_alt_phone,
                    address1: data.origin_address1,
                    address2: data.origin_address2,
                    pincode: data.origin_pincode,
                    city: data.origin_city,
                    state: data.origin_state,
                },
                destination_details: {
                    name: data.dest_name,
                    phone: data.dest_phone,
                    alt_phone: data.dest_alt_phone,
                    address1: data.dest_address1,
                    address2: data.dest_address2,
                    pincode: data.dest_pincode,
                    city: data.dest_city,
                    state: data.dest_state,
                },
                return_details: {
                    name: data.return_name,
                    phone: data.return_phone,
                    alt_phone: data.return_alt_phone,
                    address1: data.return_address1,
                    address2: data.return_address2,
                    pincode: data.return_pincode,
                    city: data.return_city,
                    state: data.return_state,
                },
                invoice_number: data.invoice_number,
                invoice_date: data.invoice_date,
                reference_number: data.reference_number,
                customer_reference_number: data.customer_reference_number,
                cod_collection_mode: data.cod_collection_mode,
                cod_amount: data.cod_amount,
                commodity_id: data.commodity_id,
                eway_bill: data.eway_bill,
                is_risk_surcharge_applicable: data.is_risk_surcharge_applicable === "true",
            };
            // console.log("payload",payload);

            const response = await http_request.post('/create-dtdc-shipment', payload);
            // console.log("response",response);

            if (response?.data?.dtdcResponse?.status === "OK") {
                ToastMessage({ status: true, msg: "Consignment created successfully" });
                reset();
                RefreshData();
                onClose();
            } else {
                ToastMessage({ status: false, msg: "Consignment creation failed or incomplete" });
            }
        } catch (error) {
            console.error("❌ Error:", error.response?.data || error.message);
            ToastMessage({ status: false, msg: "Error creating consignment" });
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {
        if (userData?.user?.role === "SERVICE") {

            const selectedCenter = centers.find(c => c._id === userData?.user?._id);



            if (selectedCenter) {
                console.log("serviceCenterId", selectedCenter._id, "serviceCenter", selectedCenter.serviceCenterName);

                setValue("serviceCenterId", selectedCenter._id);
                setValue("serviceCenter", selectedCenter.serviceCenterName);
            }
        }
    }, []);

    return (
        <>
            {loading === true ? <div> <ReactLoader /> </div>
                : <div className="  p-2 bg-white shadow-lg rounded-lg">
                    <Toaster />
                    <h2 className="text-xl font-semibold mb-4">Spare Parts Form</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-2 gap-4 border p-4 rounded">
                            <div className="mb-4">
                                <label className="block font-medium">Select Brand</label>
                                <select
                                    {...register("brandId", { required: "Brand is required" })}
                                    onChange={(e) => {
                                        const selectedBrand = brands.find(brand => brand._id === e.target.value);
                                        setValue("brandId", selectedBrand._id);
                                        setValue("brandName", selectedBrand.brandName);

                                        setValue("origin_name", selectedBrand.brandName);
                                        setValue("origin_phone", selectedBrand.tollfree);
                                        setValue("origin_address1", selectedBrand.streetAddress);
                                        setValue("origin_address2", selectedBrand.streetAddress);
                                        setValue("origin_pincode", selectedBrand.postalCode);
                                        setValue("origin_city", selectedBrand.city);
                                        setValue("origin_state", selectedBrand.state);

                                        // console.log("selectedBrand", selectedBrand);
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

                                        setValue("dest_name", selectedServiceCenter.serviceCenterName);
                                        setValue("dest_phone", selectedServiceCenter.contact);
                                        setValue("dest_address1", selectedServiceCenter.streetAddress);
                                        setValue("dest_address2", selectedServiceCenter.streetAddress);
                                        setValue("dest_pincode", selectedServiceCenter.postalCode);
                                        setValue("dest_city", selectedServiceCenter.city);
                                        setValue("dest_state", selectedServiceCenter.state);

                                        // console.log("selectedServiceCenter", selectedServiceCenter);

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
                            <div className="col-span-2 flex justify-between">
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => append({ sparePartId: "", sparePartName: "", quantity: "", price: "" })}
                                        className="bg-[#09090b] text-white p-2 rounded mb-4"
                                        disabled={selectedSpareParts.length >= sparepart.length}
                                    >
                                        ➕
                                    </button>
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
                                                    setValue(`length`, selectedPart?.length || "");
                                                    setValue(`width`, selectedPart?.width || "");
                                                    setValue(`height`, selectedPart?.height || "");
                                                    setValue(`weight`, selectedPart?.weight || "");
                                                    // setValue(`spareParts.${index}.num_pieces`, selectedPart?.num_pieces || "");
                                                    //  console.log("selectedPart", selectedPart);
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


                            </div>
                        </div>


                        {/* Section 2: Origin, Destination, Return */}
                        <fieldset className="grid grid-cols-1 md:grid-cols-4 gap-4 border mt-3 p-4 rounded">
                            <legend className="font-semibold col-span-3">📍 Origin / Destination  </legend>

                            {/* Origin */}
                            <div>
                                <h4 className="font-semibold">Sparepart</h4>
                                <input {...register('description')} placeholder="Description" className="border p-2 w-full" />
                                <input {...register('length')} placeholder="Length (cm)" className="border p-2 w-full" />
                                <input {...register('width')} placeholder="Width (cm)" className="border p-2 w-full" />
                                <input {...register('height')} placeholder="Height (cm)" className="border p-2 w-full" />
                                <input {...register('weight')} placeholder="Weight (kg)" className="border p-2 w-full" />
                                <input {...register('declared_value')} placeholder="Declared Value" className="border p-2 w-full" />
                                <input {...register('num_pieces')} placeholder="No. of Pieces" defaultValue="1" className="border p-2 w-full" />
                            </div>

                            <div>
                                <h4 className="font-semibold">Origin</h4>
                                <input {...register('origin_name')} placeholder="Name" className="border p-2 w-full" />
                                <input {...register('origin_phone')} placeholder="Phone" className="border p-2 w-full" />
                                <input {...register('origin_alt_phone')} placeholder="Alternate Phone" className="border p-2 w-full" />
                                <input {...register('origin_address1')} placeholder="Address Line 1" className="border p-2 w-full" />
                                <input {...register('origin_address2')} placeholder="Address Line 2" className="border p-2 w-full" />
                                <input {...register('origin_pincode')} placeholder="Pincode" className="border p-2 w-full" />
                                <input {...register('origin_city')} placeholder="City" className="border p-2 w-full" />
                                <input {...register('origin_state')} placeholder="State" className="border p-2 w-full" />
                            </div>

                            {/* Destination */}
                            <div>
                                <h4 className="font-semibold">Destination</h4>
                                <input {...register('dest_name')} placeholder="Name" className="border p-2 w-full" />
                                <input {...register('dest_phone')} placeholder="Phone" className="border p-2 w-full" />
                                <input {...register('dest_alt_phone')} placeholder="Alternate Phone" className="border p-2 w-full" />
                                <input {...register('dest_address1')} placeholder="Address Line 1" className="border p-2 w-full" />
                                <input {...register('dest_address2')} placeholder="Address Line 2" className="border p-2 w-full" />
                                <input {...register('dest_pincode')} placeholder="Pincode" className="border p-2 w-full" />
                                <input {...register('dest_city')} placeholder="City" className="border p-2 w-full" />
                                <input {...register('dest_state')} placeholder="State" className="border p-2 w-full" />
                            </div>

                            <div>
                                <h4 className="font-semibold">Return</h4>
                                <input {...register('return_name')} placeholder="Name" className="border p-2 w-full" />
                                <input {...register('return_phone')} placeholder="Phone" className="border p-2 w-full" />
                                <input {...register('return_alt_phone')} placeholder="Alternate Phone" className="border p-2 w-full" />
                                <input {...register('return_address1')} placeholder="Address Line 1" className="border p-2 w-full" />
                                <input {...register('return_address2')} placeholder="Address Line 2" className="border p-2 w-full" />
                                <input {...register('return_pincode')} placeholder="Pincode" className="border p-2 w-full" />
                                <input {...register('return_city')} placeholder="City" className="border p-2 w-full" />
                                <input {...register('return_state')} placeholder="State" className="border p-2 w-full" />
                            </div>


                        </fieldset>
                        {/* Section 3: Invoice & Reference */}
                        <fieldset className="grid grid-cols-3 gap-4 border p-4 rounded">
                            <legend className="font-semibold col-span-2">🧾 Invoice & Reference</legend>
                            <input {...register('customer_reference_number')} placeholder="Customer Reference Number (Order ID)" className="border p-2" />
                            <input {...register('cod_collection_mode')} placeholder="COD Mode" className="border p-2" />
                            <input {...register('cod_amount')} placeholder="COD Amount" className="border p-2" />
                            <input {...register('commodity_id')} placeholder="Commodity ID" className="border p-2" />
                            <input {...register('eway_bill')} placeholder="Eway Bill" className="border p-2" />
                            <select {...register('is_risk_surcharge_applicable')} className="border p-2">
                                <option value="false">No Risk Surcharge</option>
                                <option value="true">Apply Risk Surcharge</option>
                            </select>
                            <input {...register('invoice_number')} placeholder="Invoice Number" className="border p-2" />
                            <input {...register('invoice_date')} placeholder="Invoice Date (e.g. 14 Oct 2022)" className="border p-2" />
                            <input {...register('reference_number')} placeholder="Reference Number" className="border p-2" />
                        </fieldset>



                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="  w-full my-5 bg-green-500 text-white p-2 rounded"
                            >
                                {loading ? "Submitting......" : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            }
        </>
    );
}
