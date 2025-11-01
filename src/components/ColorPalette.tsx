"use client";
import { url } from "inspector";
import { Pipette, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ColorPallete(props: { dimensions: { width: number; height: number }; imgUpdated: string; resetState: () => void }) {
  const { dimensions, imgUpdated, resetState } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [colorPicker, setColorPicker] = useState<string>('#ffbf00');

  const [customColor, setCustomColor] = useState<string>('#000000');
  const [bgFile, setBGFile] = useState<string | ArrayBuffer | null>(null);

  const [rounded, setRounded] = useState<boolean>(false);

  const colors = ["#ffbf00", "#00FF00", "#0000FF", "#FFFF00", "#800080", "#FF69B4", "#ADCE08", "#13477A", "#EA821B", "#2E2E2E", "#e8e8e8", "#d3d3d3"];

  useEffect(() => {
    if (!imgUpdated) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous"; // important for CORS if image hosted elsewhere
    img.src = imgUpdated;

    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (!canvas || !ctx) return;

      // set canvas to custom dimensions
      canvas.width = Math.floor(dimensions.width);
      canvas.height = Math.floor(dimensions.height);

      if (bgFile) {
        const bgImg = new window.Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.src = bgFile as string;
        ctx.fillStyle = ctx.createPattern(bgImg, 'no-repeat') as CanvasPattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      else if (!rounded) {
        // optional: fill background (like your yellow bg)
        const gradient = ctx.createRadialGradient(canvas.width, canvas.height, 10, canvas.width, canvas.height, canvas.width);
        gradient.addColorStop(0, `${colorPicker}7f`);
        gradient.addColorStop(1, colorPicker);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw the actual image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      else {
        // create rounded mask
        const radius = Math.min(canvas.width, canvas.height) / 2;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.clip();
        // fill background
        const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 10, canvas.width/2, canvas.height/2, radius);
        gradient.addColorStop(0, `${colorPicker}7f`);
        gradient.addColorStop(1, colorPicker);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // draw the actual image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      // // generate preview data URL for <img> tag display
      // setPreviewUrl(canvas.toDataURL("image/png"));
    };
  }, [imgUpdated, colorPicker, dimensions, rounded, bgFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result;
        if (imageUrl) {
          setBGFile(imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  }

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const link = document.createElement('a');
    link.download = 'enhanced-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  const handleRemoveBg = () => {
    setBGFile(null);
  }

  return (
    <>
      <div className='grid grid-cols-12 gap-4 justify-center m-4'>
        <div className='col-span-12 sm:col-span-4 text-center mb-2'>
          <p className='font-bold mb-4 text-lg'>Preset Background:</p>
          <div className="flex flex-wrap gap-2 justify-left">
            {colors.map((color) => (
              <div
                key={color}
                style={{ backgroundColor: color }}
                className={`w-8 h-8 p-4 rounded-full cursor-pointer border-4 ${colorPicker === color ? 'border-black-500' : 'border-transparent'}`}
                onClick={() => setColorPicker(color)}
              >
              </div>
            ))}
          </div>
        </div>
        <div className='col-span-12 sm:col-span-4 text-center mb-2'>
          <p className='font-bold mb-4 text-lg'>Or pick a custom color:</p>
          <div className="ml-auto mr-auto w-8 h-8 p-4 rounded-full cursor-pointer border-4 border-transparent bg-radial from-cyan-400 via-blue-400 to-indigo-400 relative">
            <Pipette width={16} height={16} className="absolute top-[25%] left-[25%]" />
            <input type="color" value={customColor} onChange={(e) => {setColorPicker(e.target.value); setCustomColor(e.target.value)}} className="w-full h-10 bg-gray-300 rounded-md cursor-pointer absolute top-0 left-0 opacity-0" />
          </div>
        </div>
        <div className='col-span-12 sm:col-span-4 text-center mb-2'>
          <p className='font-bold mb-4 text-lg'>Or upload your own background image:</p>
          <input type="file" accept="image/*" id="bg_image" className="hidden" onChange={handleFileChange} />
          <label htmlFor="bg_image" className="cursor-pointer bg-blue-600 text-white p-2 border-2 border-white rounded hover:bg-blue-700">Choose Image</label>
          {bgFile && <p className="flex justify-center mt-4">{'Background Image'} 
              <XIcon onClick={handleRemoveBg} className="ml-2 mt-1 text-white cursor-pointer hover:text-red-500" width={18} height={18} />
          </p>}
        </div>
      </div>

      <canvas className="hidden" ref={canvasRef}  />

      {imgUpdated.length > 0 && <>
        <input type='radio' className='m-2 mt-1 w-6 h-6 cursor-pointer align-middle' checked={!rounded} onChange={() => setRounded(false)} />Original Dimensions
        <input type='radio' className='m-2 mt-1 w-6 h-6 cursor-pointer align-middle' checked={rounded} onChange={() => setRounded(true)} />Rounded Dimensions
        {bgFile ? <div className='relative mt-4' style={{width: dimensions.width/2, height: rounded ? dimensions.width/2 : dimensions.height/2, margin: '8px auto'}}>
          <Image
            src={imgUpdated}
            alt="the image after conversion"
            fill
            style={{ backgroundImage: `url(${bgFile})`, objectFit: 'cover', borderRadius: rounded ? '50%' : '0' }}
          />
        </div> : <div className="relative mt-4" style={{width: dimensions.width/2, height: rounded ? dimensions.width/2 : dimensions.height/2, margin: '8px auto'}}  >
          <Image
            src={imgUpdated}
            alt="the image after conversion"
            fill
            style={{ backgroundImage: `radial-gradient(circle at center, ${colorPicker}7f, ${colorPicker})` }}
            className={`object-cover ${rounded ? 'rounded-full' : ''}`}
          />
        </div>}
      </>}
      <button className="m-4 outlined border-2 border-blue-300 text-blue rounded" onClick={resetState} >Create More</button>
      <button className="m-4 bg-blue-500 text-white rounded" onClick={handleDownload}>Download Image</button>
    </>
  );
}