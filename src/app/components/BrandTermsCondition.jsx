import React, { useState } from "react";
import ReactQuill from "react-quill";
import axios from "axios"; // For API calls
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS for the snow theme

const TermsEditor = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false); // To manage API call state
  const [message, setMessage] = useState("");

  // Quill Toolbar Options (Customize as needed)
  const toolbarOptions = [
    [{ header: [1, 2, 3, false] }], // Header dropdown
    ["bold", "italic", "underline", "strike"], // Text styling
    [{ list: "ordered" }, { list: "bullet" }], // Lists
    [{ align: [] }], // Alignment
    ["link", "image"], // Links and Images
    ["clean"], // Clear formatting
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

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
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.put(
        "/api/brands/update", // Replace with your update API endpoint
        {
          warrantyCondition: content, // Sending warranty condition to the API
        }
      );

      if (response.status === 200) {
        setMessage("Terms and Conditions updated successfully!");
      } else {
        setMessage("Failed to update Terms and Conditions.");
      }
    } catch (error) {
      console.error("Error updating Terms and Conditions:", error);
      setMessage("An error occurred while updating Terms and Conditions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
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

      {message && (
        <p className={`mt-4 ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Preview:</h2>
        <div
          className="p-4 border rounded bg-gray-50"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default TermsEditor;
