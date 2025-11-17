import React, { useState, useEffect } from "react";
import http_request from '../../../../http-request'

const EditComplaintForm = ({ complaintId,  handleOrderClose }) => {
  const [formData, setFormData] = useState({
    
    videoUrl: "",
  });

  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

 
 
  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => {
      formPayload.append(key, formData[key]);
    });

    if (video) {
      formPayload.append("partPendingVideo", video);
    }

    try {
      const response = await http_request.patch(`/updateComplaintWithVideo/${complaintId}`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Complaint updated successfully!");
      // console.log(response.data);
    
    } catch (error) {
      alert("Error updating complaint");
      console.error("Error updating complaint:", error);
    } finally {
      setUploading(false);
      handleOrderClose()
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {formData.videoUrl && (
          <div>
            <p>Current Video:</p>
            <video controls className="w-full">
              <source src={formData.videoUrl} type="video/mp4" />
            </video>
          </div>
        )}

        <input type="file" accept="video/*" onChange={handleVideoChange} className="border p-2 w-full" />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={uploading}>
          {uploading ? "Updating..." : "Update Complaint"}
        </button>
      </form>
    </div>
  );
};

export default EditComplaintForm;
