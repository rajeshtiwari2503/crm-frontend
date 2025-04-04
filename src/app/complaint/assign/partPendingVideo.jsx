import React, { useState, useEffect } from "react";
import axios from "axios";

const EditComplaintForm = ({ complaintId }) => {
  const [formData, setFormData] = useState({
    
    videoUrl: "",
  });

  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Fetch existing complaint data
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/complaint/${complaintId}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching complaint:", error);
      }
    };
    fetchComplaint();
  }, [complaintId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      const response = await axios.put(`http://localhost:5000/updateComplaintWithVideo/${complaintId}`, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Complaint updated successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error updating complaint:", error);
    } finally {
      setUploading(false);
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
