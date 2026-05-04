"use client";

import { useEffect, useState } from "react";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import Convert from "@/components/Convert";
import { toast, ToastContainer } from "react-toastify";

type dimensions = {
  width: number,
  height: number
}
const ImageInput = () => {
  const [file, setFile] = useState<File | null>();
  const [imgUpdated, setImgUpdated] = useState<string>("");
  const [dimensions, setDimensions] = useState<dimensions>({} as dimensions);
  const [progress, setProgress] = useState<number>(0);
  const [showProgress, setShowProgress] = useState<boolean>(false);

  const [convert, setConvert] = useState<boolean>(false);

  useEffect(() => {
    if (file) {
      const fr = new FileReader();
      fr.onload = () => {
        const img = new window.Image();
        img.onload = () => {
          setDimensions({ width: img.width, height: img.height });
        }
        img.src = fr.result as string;
      }
      fr.readAsDataURL(file);
    }
  }, [file]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (showProgress) {
        setProgress((prev) => {
          if (imgUpdated.length > 0) {
            clearInterval(interval);
            setShowProgress(false);
            return 100;
          }
          if (prev >= 95) return prev;
          return prev + 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [imgUpdated, progress])

  const handleSubmit = async () => {
    if (!file) {
      console.log("No file selected");
      toast("Please select a file to convert.");
      return;
    }

    setShowProgress(true);
    setConvert(true);
    setProgress(1);

    const worker = new Worker(new URL("../../public/sw.js", import.meta.url), { type: "module" });

    worker.onmessage = (event) => {
      const { success, blob, error } = event.data;
      if (success) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          if (reader.result) {
            setImgUpdated(reader.result.toString());
          }
        };
      } else {
        console.error("Background removal failed:", error);
      }
      worker.terminate();
    };
    worker.postMessage(file);
  };

  const resetState = () => {
    setConvert(false);
    setFile(null);
    setImgUpdated("");
    setDimensions({} as dimensions);
    setProgress(0);
    setShowProgress(false);
  }

  const handleRemoveFile = () => {
    setFile(null);
    setDimensions({} as dimensions);
    setProgress(0);
    setShowProgress(false);
  };

  return (
    !convert ? <>
      <ToastContainer 
        position="bottom-left" 
        autoClose={3000} 
        theme='dark' 
        limit={1} 
        hideProgressBar
        closeOnClick
        pauseOnHover
        className="toast-container"
        toastClassName={() => "toast-message"}
        closeButton={({ closeToast }) => (
          <button 
            onClick={closeToast}
            className="toast-close-btn"
            aria-label="Close notification"
          >
            ✕
          </button>
        )}
      />
      <p className="text-center mt-2 xs:mt-2 sm:mt-2 md:mt-4 animate-fade-in-up delay-200 relative z-10">
        Easily create stunning profile pictures with our background removal tool.
      </p>
      <p className="text-center mb-6 animate-fade-in-up delay-300 relative z-10">
        Customize background with our color palette or upload your own background image.
      </p>
      <div className="file-input relative overflow-hidden group"
        style={{ animation: 'fade-in-up 0.8s ease-out 0.5s forwards, glow-pulse 3s ease-in-out 1.3s infinite', opacity: 0 }}>
        {/* Animated background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

        <UploadCloudIcon className="animate-bounce-slow" />
        <label className="text-center mt-2" htmlFor="file_id">Upload or Drag and drop an image file here</label>
        <input
          name="file"
          id="file_id"
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            e.target && e.target.files && setFile(e.target.files[0])
          }
          accept={".png, .jpg, .jpeg"}
          className="absolute h-full w-full opacity-0 top-0 left-0 cursor-pointer"
        />
      </div>

      {file && <span className="flex justify-center items-center text-white animate-fade-in-up delay-100">
        <FileIcon className="mr-1 mt-1" color="white" fontWeight={600} width={18} height={18} /> {file.name}
        <XIcon onClick={handleRemoveFile} className="ml-2 mt-1 cursor-pointer hover:text-red-400 transition-colors" width={18} height={18} />
      </span>}

      <button className="m-4 bg-blue-500 text-white shadow-lg border-2 border-white rounded hover:bg-blue-600 hover:scale-105 hover:shadow-[0_0_20px_rgba(29,161,242,0.5)] transition-all duration-300 " onClick={handleSubmit}>Convert</button>
    </> : <>
      <Convert progress={progress} resetState={resetState} imgUpdated={imgUpdated} dimensions={dimensions} />
    </>
  );
};

export default ImageInput;