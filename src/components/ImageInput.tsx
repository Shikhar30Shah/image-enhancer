"use client";

import { useEffect, useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import Image from "next/image";
import { CheckCheckIcon, CheckCircleIcon, CrossIcon, DeleteIcon, FileIcon, ImageIcon, RemoveFormattingIcon, Route, UploadCloudIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Convert from "@/app/(root)/convert/page";

type dimensions = {
    width: number,
    height: number
}
const ImageInput = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>();
  const [imgSrc, setImgSrc] = useState<string | ArrayBuffer>("");
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
            setDimensions({width: img.width, height: img.height});
        }
        img.src = fr.result as string;
      }
      fr.readAsDataURL(file);
      fr.onloadend = () => fr.result && setImgSrc(fr.result);
    }
  }, [file]);

  useEffect(() => {
    const interval = setInterval(() => {
        if(showProgress) {
            setProgress((prev) => {
                if (imgUpdated.length > 0) {
                  clearInterval(interval);
                  setShowProgress(false);
                  return 100;
                }
                if(prev>=95) return prev;
                return prev + 1;
            });
        }
    }, 1000);

    return () => clearInterval(interval);
  }, [imgUpdated, progress])

  const handleSubmit = async () => {
    if (!file) return;
    
    setShowProgress(true);
    setConvert(true);
    setProgress(1);

    const worker = new Worker(new URL("../../public/sw.js", import.meta.url), {type : "module"});

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
    setImgSrc("");
    setImgUpdated("");
    setDimensions({} as dimensions);
    setProgress(0);
    setShowProgress(false);
  }

  const handleRemoveFile = () => {
    setFile(null);
    setImgSrc("");
    setDimensions({} as dimensions);
    setProgress(0);
    setShowProgress(false);
  };

  return (
    !convert ? <>
      <p className="text-center">Easily create stunning profile pictures with our background removal tool. </p>
      <p className="text-center mb-6">
        Customize background with our color palette or upload your own background image.</p>
      <div className="file-input">
        <UploadCloudIcon />
        <label className="text-center" htmlFor="file_id">Upload or Drag and drop an image file here</label>
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

      {file && <span className="flex justify-center items-center text-white">
        <FileIcon className="mr-1 mt-1" color="white" fontWeight={600} width={18} height={18} /> {file.name} 
        <XIcon onClick={handleRemoveFile} className="ml-2 mt-1 cursor-pointer" width={18} height={18} />
      </span>}

      <button className="m-4 bg-blue-500 text-white shadow-lg border-2 border-white rounded hover:bg-blue-600" onClick={handleSubmit}>Convert</button>
    </> : <>
        <Convert progress={progress} resetState={resetState} showProgress={showProgress} imgUpdated={imgUpdated} dimensions={dimensions} />
    </>
  );
};

export default ImageInput;