import React, { useState } from 'react';
import http_request from "../../../../../http-request";
 
 
import { useRouter } from 'next/navigation';
import { ToastMessage } from '@/app/components/common/Toastify';

function EditImages(props) {
  const router=useRouter()
  const [img,setImage]=useState(false)
    const handleFileChange = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
            if (e.target.name === "file") {
              setImage(true);
               props.onImage(e.target.files[0]);
               changeImage(e.target.files[0])
            }
        }
    };

   

    const changeImage=async (img)=>{
          try{
            const formData=new FormData();
            formData.append("image",img);
            let response=await http_request.patch(`/uploadSPImage/${props?.sparePart?._id}`,formData);
            let {data}=response;
            ToastMessage(data)
            router.push("/product/sparepart")
          }catch(err){
            console.log(err);
          }
    }

    let {images}=props?.sparePart;
   
    return (<>
        <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
            <h6 className="mb-0 fw-bold ">Images</h6>
        </div>
        <div className="card-body">
            <form>
            <div className="flex flex-wrap -mx-3 items-center">
            <div className="w-full px-3">
                <label className="block text-sm font-medium text-gray-700">Product Images Upload</label>
                <small className="block text-gray-400 mb-2">Only portrait or square images, 2M max and 2000px max-height.</small>
                <div id='create-token' className='dropzone'>
                <div className='dz-message flex items-center justify-center'>
                        {/* <h1 className='text-5xl'>+</h1> */}
                    </div>
                    {
                        images?.length > 0 ?
                        images?.map(p1 =>
                            <img 
                                src={img?URL.createObjectURL(p1):props?.sparePart?.images } 
                                height="200px" 
                                width="200px" 
                                className='m-2' 
                                alt='' 
                            />)
                        : ""
                    }
                    <input 
                        id='filesize' 
                        onChange={(e) => handleFileChange(e)} 
                        name="file" 
                        type="file" 
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff, .mp4, .webm, .mp3, .wav, .ogg, .glb" 
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    />
                   
                </div>
            </div>
        </div>
            </form>
        </div>
    </>
    )
}

 export default EditImages