const ApkDownload = () => {
    const apkUrl = "https://drive.google.com/file/d/1-Ru-jzo1dgaPwosDP68td-Gf1-HlvzCR/view?usp=sharing"; // Replace with your APK link
  
    return (
      <div className="flex items-center justify-center   bg-gray-100">
        <button
          className="rounded-lg p-1 m-2 w-full border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => window.open(apkUrl, "_blank")}
        >
          Download APK
        </button>
      </div>
    );
  };
  
  export default ApkDownload;
  