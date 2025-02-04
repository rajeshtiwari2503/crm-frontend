import { useEffect, useState } from "react";
import http_request from "../../../http-request";  // Ensure this has a baseURL configured
import { ToastMessage } from "./common/Toastify";
import { Toaster } from "react-hot-toast";
import { ReactLoader } from "./common/Loading";

const UploadApk = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const uploadApk = async () => {
        if (!file) return ToastMessage("Please select an APK file");

        const formData = new FormData();
        formData.append("apk", file);

        try {
            setLoading(true)
            // Ensure the API URL is correct
            const response = await http_request.post("/upload-apk", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const { data } = response;
            ToastMessage(data);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error("Error uploading APK:", error);
            ToastMessage("Failed to upload APK");
        }
    };

    const updateApk = async () => {
        if (!file) return ToastMessage("Please select an APK file");

        const formData = new FormData();
        formData.append("apk", file);

        try {
            setLoading(true)
            // Ensure the API URL is correct
            const response = await http_request.patch("/update-apk", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const { data } = response;
            ToastMessage(data);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error("Error updating APK:", error);
            ToastMessage("Failed to update APK");
        }
    };

    const downloadApk = async () => {
        try {
            setLoading(true)
            const response = await http_request.get("/download-apk", { responseType: "blob" });

            // Create a Blob URL for the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "my-app.apk");
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.remove();
            window.URL.revokeObjectURL(url);

            ToastMessage(response?.data);
            setLoading(false)

        } catch (error) {
            setLoading(false)
            console.error("Error downloading APK:", error);
            ToastMessage("Failed to download APK");
        }
    };

    return (
        <>
            {loading === true ? <ReactLoader />

                : <div className="p-4">
                    <Toaster />
                    <input type="file" accept=".apk" onChange={handleFileChange} className="mb-2" />
                    {/* <button onClick={uploadApk} className="bg-green-500 text-white p-2 rounded mr-2">
                        Upload APK
                    </button> */}
                    <button onClick={updateApk} className="bg-blue-500 text-white p-2 rounded mr-2">
                        Update APK
                    </button>
                    <button onClick={downloadApk} className="bg-purple-500 text-white p-2 rounded">
                        Download APK
                    </button>
                </div>
            }
        </>
    );
};

export default UploadApk;
