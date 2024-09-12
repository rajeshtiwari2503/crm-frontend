"use client"
import { Delete } from '@mui/icons-material';
import { Chip } from '@mui/material';
import React, { useEffect, useState } from 'react';


function EditBasicInformation(props) {
    const [selectedProducts, setSelectedProducts] = useState([]);

    let { partName, description, partNo, skuNo, length, breadth, height, weight, product, MRP, bestPrice, productModel, category, } = props?.sparePart;
    let { categories } = props;

    // let product1 = props?.products?.filter(f1 => f1?.brandName === brandName)?.map(m1 => ({ status: "ACTIVE", categoryName: m1?.productCategory }));
    // let category1 = categories?.filter(f1 => f1?.brandName === brandName)?.map(m1 => ({ status: "ACTIVE", categoryName: m1?.categoryName }));
    // let merge = product1?.concat(category1);
    // let unique1 = Array.from(new Set(merge?.map(JSON.stringify))).map(JSON.parse);

    // let categories1 = (props?.user?.role === "RESELLER" || props?.user?.role === "ADMIN") ? unique1 : categories;
    let products1 = props?.products?.filter(p1 => p1?.categoryName === category)

    useEffect(() => {
        if (props?.sparePart) {
             
            setSelectedProducts(props?.sparePart.products || []); // Preload selected products (productId and productName)
        }
    }, [props?.sparePart ]);
  
    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        const selectedProduct = products1?.find(p => p._id === selectedProductId);

        // Check if the product is already selected to avoid duplicates
        if (selectedProduct && !selectedProducts.some(p => p.productId === selectedProduct._id)) {
            // Add both productId and productName to selectedProducts array
            setSelectedProducts([...selectedProducts, { productId: selectedProduct._id, productName: selectedProduct.productName }]);
            props?.handleProductData([...selectedProducts, { productId: selectedProduct._id, productName: selectedProduct.productName }]);

        }
    };

    const handleRemoveProduct = (productId) => {
        setSelectedProducts(selectedProducts.filter(p => p.productId !== productId)); // Remove product from list
        props?.handleProductData(selectedProducts.filter(p => p.productId !== productId))
    };
    return (
        <>
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                <h6 className="mb-0 font-bold ">Basic information</h6>
            </div>
            <div className="card-body">
                <form>
                    <div className=" grid grig-cols-1 md:grid-cols-3 gap-3 items-center">
                        <div className="w-full   px-3">
                            <label className="block text-sm font-medium text-gray-700">Spare Part Name</label>
                            <input
                                type="text"
                                className=" block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                name="partName"
                                value={partName}
                                onChange={(e) => { props.onChange(e) }}
                            />
                            {props?.errors?.partName ? <div className="text-red-600">{props?.errors?.partName}</div> : ""}
                        </div>
                        <div className="w-full   px-3">
                            <label className="block text-sm font-medium text-gray-700">Spare Part No.</label>
                            <input
                                type="text"
                                className=" block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                name="partNo"
                                value={partNo}
                                onChange={(e) => { props.onChange(e) }}
                            />
                        </div>
                        <div className="w-full   px-3">
                            <label className="block text-sm font-medium text-gray-700">SKU No.</label>
                            <input
                                type="text"
                                className=" block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                name="skuNo"
                                value={skuNo}
                                onChange={(e) => { props.onChange(e) }}
                            />
                            {props?.errors?.skuNo ? <div className="text-red-600">{props?.errors?.skuNo}</div> : ""}
                        </div>
                        <div className="w-full     px-3">
                            <label className="block text-sm font-medium text-gray-700">Length <span className="text-gray-400">(in cm)</span></label>
                            <input
                                type="text"
                                className=" block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                name="length"
                                value={length}
                                onChange={(e) => { props.onChange(e) }}
                            />
                            {props?.errors?.length ? <div className="text-red-600">{props?.errors?.length}</div> : ""}
                        </div>
                        <div className="w-full     px-3">
                            <label className="block text-sm font-medium text-gray-700">Breadth <span className="text-gray-400">(in cm)</span></label>
                            <input
                                type="text"
                                className=" block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                name="breadth"
                                value={breadth}
                                onChange={(e) => { props.onChange(e) }}
                            />
                            {props?.errors?.breadth ? <div className="text-red-600">{props?.errors?.breadth}</div> : ""}
                        </div>
                        <div className="w-full     px-3">
                            <label className="block text-sm font-medium text-gray-700">Height <span className="text-gray-400">(in cm)</span></label>
                            <input
                                type="text"
                                className=" block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                name="height"
                                value={height}
                                onChange={(e) => { props.onChange(e) }}
                            />
                            {props?.errors?.height ? <div className="text-red-600">{props?.errors?.height}</div> : ""}
                        </div>
                        <div className="w-full px-3">
                            <label className="block text-sm font-medium text-gray-700">Weight <span className="text-gray-400">(in kg)</span></label>
                            <input
                                type="text"
                                className=" block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                name="weight"
                                value={weight}
                                onChange={(e) => { props.onChange(e) }}
                            />
                            {props?.errors?.weight ? <div className="text-red-600">{props?.errors?.weight}</div> : ""}
                        </div>
                        <div className="w-full px-3">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                className=" block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                name="description"
                                value={description}
                                onChange={(e) => { props.onChange(e) }}
                            ></textarea>
                        </div>
                        <div className="w-full px-3">
                            <label className="block text-sm font-medium text-gray-700">MRP</label>
                            <input
                                type="number"
                                className=" block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                name="MRP"
                                value={MRP}
                                onChange={(e) => { props.onChange(e) }}
                            />
                            {props?.errors?.MRP ? <div className="text-red-600">{props?.errors?.MRP}</div> : ""}
                        </div>
                        <div className="w-full px-3">
                            <label className="block text-sm font-medium text-gray-700">Best Price</label>
                            <input
                                type="number"
                                className=" block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                name="bestPrice"
                                value={bestPrice}
                                onChange={(e) => { props.onChange(e) }}
                            />
                            {props?.errors?.bestPrice ? <div className="text-red-600">{props?.errors?.bestPrice}</div> : ""}
                        </div>
                        {(props?.user?.role === "RESELLER" || props?.user?.role === "ADMIN") && (
                            <div className="w-full px-3">
                                <div className="p-0 m-0">
                                    <label className="block text-sm font-medium text-gray-700">Brand</label>
                                    <select
                                        className=" block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        name="brandName"
                                        value={brandName}
                                        onChange={(e) => props.onChange(e)}
                                    >
                                        <option value="" selected>Choose Brand</option>
                                        {props?.brands?.filter(f1 => f1?.approval === "APPROVED")?.map(c1 => (
                                            <option key={c1.brandName} value={c1.brandName}>{c1.brandName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                        <div className="w-full px-3">
                            <div className="p-0 m-0">
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    className=" block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    name="category"
                                    value={category}
                                    onChange={(e) => props.onChange(e)}
                                >
                                    <option value="" selected>Choose Category</option>
                                    {categories?.filter(f1 => f1?.status === "ACTIVE")?.map(c1 => (
                                        <option key={c1.categoryName} value={c1.categoryName}>{c1.categoryName}</option>
                                    ))}
                                </select>
                                {props?.errors?.category ? <div className="text-red-600">{props?.errors?.category}</div> : ""}
                            </div>
                        </div>
                        {/* <div className="w-full px-3">
                            <div className="p-0 m-0">
                                <label className="block text-sm font-medium text-gray-700">Product Model</label>
                                <select
                                    className=" block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    name="productModel"
                                    value={productModel}
                                    onChange={(e) => props.onChange(e)}
                                >
                                    <option value="" selected>Choose Model</option>
                                    {category && products1?.filter(f1 => f1?.categoryName === category)?.map(c1 => (
                                        <option key={c1.productName} value={c1.productName}>{c1.productName}</option>
                                    ))}
                                </select>
                                {props?.errors?.productModel ? <div className="text-red-600">{props?.errors?.productModel}</div> : ""}
                            </div>
                        </div> */}

                        <div className='w-[400px]'>
                            <label htmlFor="productName" className="block text-sm font-medium leading-6 text-gray-900">
                                Select Product
                            </label>
                            <div className="mt-2">
                                <select
                                    id="productName"
                                    name="productName"
                                    autoComplete="off"
                                    onChange={handleProductChange}
                                    className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                >
                                    <option value="">Select a product</option>
                                    {products1?.map((product) => (
                                        <option key={product._id} value={product._id}>
                                            {product.productName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Display selected products */}
                        <div className='mt-2'>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Selected Products
                            </label>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedProducts.map((p) => (
                                    <Chip
                                        key={p.productId}
                                        label={p.productName}
                                        onDelete={() => handleRemoveProduct(p.productId)}
                                        deleteIcon={<Delete />}
                                        className="mb-2"
                                    />
                                ))}
                            </div>
                        </div>

                    </div>

                </form>
            </div>
        </>
    )
}
export default EditBasicInformation