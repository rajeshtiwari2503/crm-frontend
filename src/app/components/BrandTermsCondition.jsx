import React, { useState } from "react";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify"; // For sanitizing HTML
import http_request from "../../../http-request";
import "react-quill/dist/quill.snow.css";
import { ToastMessage } from "./common/Toastify";
import { Toaster } from "react-hot-toast";

const TermsEditor = (props) => {
  const [content, setContent] = useState(props?.warrantyCondition || "");
  const [loading, setLoading] = useState(false);

  const toolbarOptions = [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ];

  const modules = { toolbar: toolbarOptions };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "link",
    "image",
  ];

  const handleSave = async () => {
    const sanitizedContent = DOMPurify.sanitize(content);

    try {
      setLoading(true);
      const response = await http_request.patch(
        `/updateBrandTerms/${props?.brandId}`,
        { warrantyCondition: sanitizedContent }
      );
      const { data } = response;
      props?.RefreshData(data);
      ToastMessage(data);
    } catch (error) {
      ToastMessage(error?.response?.data);
      console.error("Error updating Terms and Conditions:", error);
    } finally {
      setLoading(false);
    }
  };
  const sanitizedContent = DOMPurify.sanitize(content);
  return (
    <div className="p-6 mb-8 bg-gray-100">
      <Toaster />
      <h1 className="text-2xl font-bold mb-6">Edit Terms and Conditions</h1>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
        placeholder="Write terms and conditions here..."
        className="mb-4 border rounded bg-white"
      />
      <button
        onClick={handleSave}
        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Terms"}
      </button>
      {/* <div className="mt-8">
        <hr className="mb-4" />
        <h2 className="text-xl font-semibold mb-2">Preview:</h2>
        <div
          className="p-4 border rounded bg-gray-50"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div> */}
    </div>
  );
};

export default TermsEditor;
