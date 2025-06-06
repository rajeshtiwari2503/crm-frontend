"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '../../../../../http-request'
import { ReactLoader } from '@/app/components/common/Loading'
import { ToastMessage } from '@/app/components/common/Toastify'
import { Toaster } from 'react-hot-toast'

const ProductDetails = ({ params }) => {
    const [product, setProduct] = useState(null)
    const [refresh, setRefresh] = useState("")
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [videoLink, setVideoLink] = useState("")
    const [content, setContent] = useState("")


    useEffect(() => {
        getProductById()
    }, [refresh])

    const getProductById = async () => {
        setLoading(true)
        try {
            let response = await http_request.get(`/getProduct/${params.id}`)
            let { data } = response
            setProduct(data)
            setVideoLink(data.videoLink || "")
            setContent(data.content || "")
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async () => {
        setUpdating(true);

        try {
            const res = await http_request.patch(`/editProduct/${params.id}`, {
                videoLink,
                content,
            });
            const { data } = res;
            ToastMessage(data)
            setRefresh(Date.now()); // refresh UI

        } catch (err) {
            console.error(err);

        } finally {
            setUpdating(false);
        }
    };
    const getYoutubeEmbedUrl = (url) => {
        try {
            const urlObj = new URL(url);
            const videoId = urlObj.searchParams.get("v");
            return `https://www.youtube.com/embed/${videoId}`;
        } catch (error) {
            return null;
        }
    };


    return (
        <Sidenav>
            <Toaster />
            {loading ? (
                <div className="flex justify-center items-center h-[80vh]">
                    <ReactLoader />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-sm">
                    {/* Existing fields */}
                    <div className="font-bold">Product Name</div>
                    <div className="truncate max-w-[250px]" title={product?.productName}>{product?.productName}</div>

                    <div className="font-bold">Description</div>
                    <div className="truncate max-w-[250px]" title={product?.productDescription}>{product?.productDescription}</div>

                    <div className="font-bold">Category Name</div>
                    <div>{product?.categoryName}</div>

                    <div className="font-bold">Sub Category</div>
                    <div>{product?.subCategory}</div>

                    <div className="font-bold">Model No</div>
                    <div>{product?.modelNo}</div>

                    <div className="font-bold">Serial No</div>
                    <div>{product?.serialNo}</div>



                    <div className="font-bold">Applicable Parts</div>
                    <div>{product?.applicableParts}</div>



                    <div className="font-bold">Brand</div>
                    <div>{product?.productBrand}</div>

                    <div className="font-bold">Warranty (Years)</div>
                    <div>{product?.warrantyYears}</div>

                    <div className="font-bold">Warranty (Days)</div>
                    <div>{product?.warrantyInDays}</div>

                    <div className="font-bold">Warranty Status</div>
                    <div>{product?.warrantyStatus ? "Valid" : "Expired"}</div>



                    <div className="font-bold">Video</div>
                    <div className="">
                        {product?.videoLink && getYoutubeEmbedUrl(product.videoLink) ? (
                            <div className="aspect-video max-w-xl">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={getYoutubeEmbedUrl(product.videoLink)}
                                    title="Product Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="rounded-xl w-full h-64"
                                ></iframe>
                            </div>
                        ) : (
                            <span>-</span>
                        )}
                    </div>


                    <div className="font-bold">Content</div>
                    <div className="truncate max-w-[250px]" title={product?.content}>
                        {product?.content || "-"}
                    </div>

                    <div className="font-bold">Status</div>
                    <div>{product?.status}</div>


                    {/* Editable fields */}
                    <div className="font-bold">Video Link</div>
                    <div className='md:col-span-3'>
                        <input
                            type="text"
                            className="border px-2 py-1 w-full  "
                            value={videoLink}
                            onChange={(e) => setVideoLink(e.target.value)}
                            placeholder="Enter video link"
                        />
                    </div>

                    <div className="font-bold">Content</div>
                    <div className='md:col-span-3'>
                        <textarea
                            className="border px-2 py-1 w-full  "
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter content"
                            rows={3}
                        />
                    </div>

                    <div className="col-span-2 mt-4">
                        <button
                            onClick={handleUpdate}
                            disabled={updating}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {updating ? "Updating..." : "Save"}
                        </button>

                    </div>
                </div>
            )}
        </Sidenav>
    )
}

export default ProductDetails
