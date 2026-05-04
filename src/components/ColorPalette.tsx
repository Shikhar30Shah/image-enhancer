"use client";

import { EditIcon, Pipette, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export default function ColorPallete(props: { dimensions: { width: number; height: number }; imgUpdated: string; resetState: () => void }) {
  const { dimensions, imgUpdated, resetState } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [colorPicker, setColorPicker] = useState<string>('');

  const [customColor, setCustomColor] = useState<string>('#000000');
  const [bgFile, setBGFile] = useState<string | ArrayBuffer | null>(null);

  const [seen, setSeen] = useState<boolean>(false);

  const [rounded, setRounded] = useState<boolean>(false);
  const [showCropModal, setShowCropModal] = useState<boolean>(false);
  const [crop, setCrop] = useState<Crop>({ unit: 'px', x: 0, y: 0, width: Math.min(250, dimensions.width), height: Math.min(150, dimensions.height) });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [savedCrop, setSavedCrop] = useState<Crop | null>(null);
  const [savedBgOffsetX, setSavedBgOffsetX] = useState<number>(0);
  const [savedBgOffsetY, setSavedBgOffsetY] = useState<number>(0);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [bgOffsetX, setBgOffsetX] = useState<number>(0);
  const [bgOffsetY, setBgOffsetY] = useState<number>(0);
  const [isDraggingBg, setIsDraggingBg] = useState<boolean>(false);
  const [bgDragMode, setBgDragMode] = useState<boolean>(false);
  const cropModalImageRef = useRef<HTMLImageElement | null>(null);

  const colors = ["#ffbf00", "#00FF00", "#0000FF", "#FFFF00", "#800080", "#FF69B4", "#ADCE08", "#13477A", "#EA821B", "#2E2E2E", "#e8e8e8", "#d3d3d3"];

  const displayImage = imgUpdated;
  const currentDimensions = dimensions;

  useEffect(() => {
    if (!displayImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    // set canvas to custom dimensions
    canvas.width = Math.floor(currentDimensions.width);
    canvas.height = Math.floor(currentDimensions.height);

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = displayImage;

    const drawOnCanvas = () => {
      if (!colorPicker && !bgFile) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return;
      }

      if (bgFile) {
        const bgImg = new window.Image();
        bgImg.crossOrigin = "anonymous";

        const handleBgLoaded = () => {
          try {
            const pattern = ctx.createPattern(bgImg, 'repeat');
            if (pattern) {
              ctx.fillStyle = pattern;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          } catch (e) {
            console.error('Error drawing background pattern:', e);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
        };

        // Set handler before src to catch synchronous loads
        bgImg.onload = handleBgLoaded;
        bgImg.onerror = () => {
          console.error('Failed to load background image');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        bgImg.src = bgFile as string;

        // Handle synchronous load from cache
        if (bgImg.complete && bgImg.naturalHeight !== 0) {
          handleBgLoaded();
        }
        return;
      }

      if (!rounded) {
        const gradient = ctx.createRadialGradient(canvas.width, canvas.height, 10, canvas.width, canvas.height, canvas.width);
        gradient.addColorStop(0, `${colorPicker}7f`);
        gradient.addColorStop(1, colorPicker);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        const radius = Math.min(canvas.width, canvas.height) / 2;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.clip();
        const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 10, canvas.width/2, canvas.height/2, radius);
        gradient.addColorStop(0, `${colorPicker}7f`);
        gradient.addColorStop(1, colorPicker);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };

    img.onload = drawOnCanvas;
    img.onerror = () => console.error('Failed to load image');
  }, [displayImage, colorPicker, currentDimensions, rounded, bgFile]);

  // Draw preview canvas when crop is saved
  useEffect(() => {
    if (!savedCrop || !imgUpdated) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imgUpdated;

    img.onload = () => {
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
      const pixelCrop = {
        x: Math.round(savedCrop.x * scaleX),
        y: Math.round(savedCrop.y * scaleY),
        width: Math.round(savedCrop.width * scaleX),
        height: Math.round(savedCrop.height * scaleY),
      };

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // Apply background if selected
      if (bgFile) {
        const bgImg = new window.Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.src = bgFile as string;

        bgImg.onload = () => {
          try {
            const pattern = ctx.createPattern(bgImg, 'repeat');
            if (pattern) {
              ctx.fillStyle = pattern;
              ctx.translate(-savedBgOffsetX, -savedBgOffsetY);
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.translate(savedBgOffsetX, savedBgOffsetY);
            }
            drawCroppedImage();
          } catch (e) {
            console.error('Error drawing background pattern:', e);
            drawCroppedImage();
          }
        };
        bgImg.onerror = () => drawCroppedImage();
      } else if (colorPicker) {
        // Apply color background
        if (rounded) {
          const radius = Math.min(canvas.width, canvas.height) / 2;
          const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 10, canvas.width / 2, canvas.height / 2, radius);
          gradient.addColorStop(0, `${colorPicker}7f`);
          gradient.addColorStop(1, colorPicker);
          ctx.fillStyle = gradient;
        } else {
          const gradient = ctx.createRadialGradient(canvas.width, canvas.height, 10, canvas.width, canvas.height, canvas.width);
          gradient.addColorStop(0, `${colorPicker}7f`);
          gradient.addColorStop(1, colorPicker);
          ctx.fillStyle = gradient;
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawCroppedImage();
      } else {
        drawCroppedImage();
      }

      function drawCroppedImage() {
        if (rounded) {
          const radius = Math.min(canvas!.width, canvas!.height) / 2;
          ctx!.beginPath();
          ctx!.arc(canvas!.width / 2, canvas!.height / 2, radius, 0, Math.PI * 2);
          ctx!.closePath();
          ctx!.clip();
        }

        ctx!.drawImage(
          img,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          canvas!.width,
          canvas!.height
        );
      }
    };
    img.onerror = () => console.error('Failed to load image for preview');
  }, [savedCrop, imgUpdated, colorPicker, rounded, bgFile, savedBgOffsetX, savedBgOffsetY]);

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

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imgUpdated;

    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let canvasWidth = dimensions.width;
      let canvasHeight = dimensions.height;

      if (savedCrop) {
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;
        const pixelCrop = {
          x: Math.round(savedCrop.x * scaleX),
          y: Math.round(savedCrop.y * scaleY),
          width: Math.round(savedCrop.width * scaleX),
          height: Math.round(savedCrop.height * scaleY),
        };
        canvasWidth = pixelCrop.width;
        canvasHeight = pixelCrop.height;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Apply background
      if (bgFile) {
        const bgImg = new window.Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.src = bgFile as string;

        bgImg.onload = () => {
          try {
            const pattern = ctx.createPattern(bgImg, 'repeat');
            if (pattern) {
              ctx.translate(-savedBgOffsetX, -savedBgOffsetY);
              ctx.fillStyle = pattern;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.translate(savedBgOffsetX, savedBgOffsetY);
            }
            drawImage();
          } catch (e) {
            console.error('Error applying background pattern:', e);
            drawImage();
          }
        };
        bgImg.onerror = () => drawImage();
      } else if (colorPicker) {
        if (rounded) {
          const radius = Math.min(canvas.width, canvas.height) / 2;
          const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 10, canvas.width / 2, canvas.height / 2, radius);
          gradient.addColorStop(0, `${colorPicker}7f`);
          gradient.addColorStop(1, colorPicker);
          ctx.fillStyle = gradient;
        } else {
          const gradient = ctx.createRadialGradient(canvas.width, canvas.height, 10, canvas.width, canvas.height, canvas.width);
          gradient.addColorStop(0, `${colorPicker}7f`);
          gradient.addColorStop(1, colorPicker);
          ctx.fillStyle = gradient;
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawImage();
      } else {
        drawImage();
      }

      function drawImage() {
        if (rounded) {
          const radius = Math.min(canvas!.width, canvas!.height) / 2;
          ctx!.beginPath();
          ctx!.arc(canvas!.width / 2, canvas!.height / 2, radius, 0, Math.PI * 2);
          ctx!.closePath();
          ctx!.clip();
        }

        if (savedCrop) {
          const scaleX = img.naturalWidth / img.width;
          const scaleY = img.naturalHeight / img.height;
          const pixelCrop = {
            x: Math.round(savedCrop.x * scaleX),
            y: Math.round(savedCrop.y * scaleY),
            width: Math.round(savedCrop.width * scaleX),
            height: Math.round(savedCrop.height * scaleY),
          };

          ctx!.drawImage(
            img,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            canvas!.width,
            canvas!.height
          );
        } else {
          ctx!.drawImage(img, 0, 0, canvas!.width, canvas!.height);
        }

        const link = document.createElement('a');
        link.download = 'enhanced-image.png';
        link.href = canvas!.toDataURL('image/png');
        link.click();
        setSeen(true);
        setTimeout(() => setSeen(false), 5000);
      }
    };
    img.onerror = () => console.error('Failed to load image for download');
  }

  const handleRemoveBg = () => {
    setBGFile(null);
  }

  const onCropImageLoaded = (img: HTMLImageElement) => {
    setImageRef(img);
    if (!crop.width || !crop.height) {
      const width = Math.min(img.width, 280);
      const height = rounded ? width : Math.min(img.height, 180);
      setCrop({ unit: 'px', x: 0, y: 0, width, height });
    }
  };

  const handleEdit = () => {
    setShowCropModal(true);
    setBgOffsetX(savedBgOffsetX);
    setBgOffsetY(savedBgOffsetY);
    setIsDraggingBg(false);
    setBgDragMode(false);
    setCrop(savedCrop || {
      unit: 'px',
      x: 0,
      y: 0,
      width: Math.min(250, currentDimensions.width),
      height: rounded ? Math.min(250, currentDimensions.width) : Math.min(180, currentDimensions.height),
    });
    setCompletedCrop(savedCrop);
  };

  const handleSaveCrop = async () => {
    if (!completedCrop) return;
    setSavedCrop(completedCrop);
    setSavedBgOffsetX(bgOffsetX);
    setSavedBgOffsetY(bgOffsetY);
    setShowCropModal(false);
  };

  const handleCloseCrop = () => {
    setShowCropModal(false);
    setBgOffsetX(savedBgOffsetX);
    setBgOffsetY(savedBgOffsetY);
  };

  return (
    <>      
      {imgUpdated.length > 0 && <>
        <input id='square' type='radio' className='w-4 h-4 sm:w-5 sm:h-5 cursor-pointer align-middle' checked={!rounded} onChange={() => setRounded(false)} />
        <label htmlFor='square' className='m-2 mt-1 cursor-pointer align-middle'>Original</label>
        <input id='rounded' type='radio' className='w-4 h-4 sm:w-5 sm:h-5 cursor-pointer align-middle' checked={rounded} onChange={() => setRounded(true)} />
        <label htmlFor='rounded' className='m-2 mt-1 cursor-pointer align-middle'>Rounded</label>
        {bgFile ? <div className='relative mt-4 max-h-[250px] max-w-[250px] sm:max-h-[400px] sm:max-w-[400px]' style={{width: Math.min(currentDimensions.width / 3, 400), height: rounded ? Math.min(currentDimensions.width / 3, 400) : Math.min(currentDimensions.height / 3, 400), margin: '8px auto'}} >
          <button onClick={handleEdit} className="absolute top-2 right-2 z-10 rounded-full bg-black/30 p-1 hover:bg-black/40">
            <EditIcon className="text-white" width={18} height={18} />
          </button>
          {savedCrop ? (
            <canvas
              ref={previewCanvasRef}
              className={`object-cover ${rounded ? 'rounded-full' : ''}`}
              style={{ width: '100%', height: '100%', backgroundImage: `url(${bgFile})`, backgroundPosition: `${savedBgOffsetX}px ${savedBgOffsetY}px`, backgroundSize: 'auto', backgroundRepeat: 'repeat' }}
            />
          ) : (
            <Image
              src={displayImage}
              alt="the image after conversion"
              fill
              style={{ backgroundImage: `url(${bgFile})`, objectFit: 'cover', borderRadius: rounded ? '50%' : '0' }}
            />
          )}
        </div> : <div className="relative mt-4 max-h-[250px] max-w-[250px] sm:max-h-[400px] sm:max-w-[400px]" style={{width: Math.min(currentDimensions.width / 2, 400), height: rounded ? Math.min(currentDimensions.width / 2, 400) : Math.min(currentDimensions.height / 2, 400), margin: '8px auto'}}  >
          <button onClick={handleEdit} className="absolute top-2 right-2 z-10 rounded-full bg-black/30 p-1 hover:bg-black/40">
            <EditIcon className="text-white" width={18} height={18} />
          </button>
          {savedCrop ? (
            <canvas
              ref={previewCanvasRef}
              className={`object-cover ${rounded ? 'rounded-full' : ''}`}
              style={{ width: '100%', height: '100%', backgroundColor: colorPicker ? `radial-gradient(circle at center, ${colorPicker}af, ${colorPicker})` : 'none' }}
            />
          ) : (
            <Image
              src={displayImage}
              alt="the image after conversion"
              fill
              style={{ backgroundImage: colorPicker ? `radial-gradient(circle at center, ${colorPicker}af, ${colorPicker})` : 'none' }}
              className={`object-cover ${rounded ? 'rounded-full' : ''}`}
            />
          )}
        </div>}
      </>}

      <div className="flex items-center justify-center gap-4 mt-4">
        <button className="outlined border-2 border-blue-300 text-blue rounded" onClick={resetState} >Create More</button>
        <button className="bg-blue-500 text-white rounded border-2 border-white" onClick={handleDownload}>Download Image</button>
      </div>
      <div className='grid grid-cols-12 gap-4 justify-center m-4 mb-20'>
        <div className='col-span-12 sm:col-span-4 text-center mb-2'>
          <p className='font-bold mb-4 text-lg'>Preset Background:</p>
          <div className="flex flex-wrap gap-2 xs:justify-center justify-center">
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
      <canvas className="hidden" ref={canvasRef} />
      <canvas className="hidden" ref={previewCanvasRef} />

      {showCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-slate-950 shadow-2xl ring-1 ring-white/10">
            <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-center">
              <div>
                <h2 className="text-lg font-semibold text-white">Crop Image</h2>
                <p className="text-sm text-slate-300">Drag to crop. Save to apply the cropped image to downloads and previews.</p>
              </div>
              {bgFile && (
                <button
                  onClick={() => setBgDragMode((prev) => !prev)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${bgDragMode ? 'bg-blue-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {bgDragMode ? 'Background move active' : 'Enable background move'}
                </button>
              )}
            </div>
            <div className="flex flex-col gap-4 p-5 lg:flex-row">
              <div className="flex-1 rounded-3xl bg-slate-900/95 p-4">
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: colorPicker || undefined,
                    backgroundImage: bgFile ? `url(${bgFile})` : undefined,
                    backgroundPosition: `${bgOffsetX}px ${bgOffsetY}px`,
                    backgroundSize: 'auto',
                    backgroundRepeat: 'repeat',
                    cursor: bgFile && bgDragMode ? 'grab' : 'default',
                  }}
                  onMouseDown={(e) => {
                    if (!bgFile || !bgDragMode) return;
                    setIsDraggingBg(true);
                    e.preventDefault();
                  }}
                  onMouseMove={(e) => {
                    if (!isDraggingBg || !bgFile || !bgDragMode) return;
                    setBgOffsetX((prev) => prev + e.movementX);
                    setBgOffsetY((prev) => prev + e.movementY);
                  }}
                  onMouseUp={() => {
                    if (!bgDragMode) return;
                    setIsDraggingBg(false);
                  }}
                  onMouseLeave={() => {
                    if (!bgDragMode) return;
                    setIsDraggingBg(false);
                  }}
                >
                  <ReactCrop
                    crop={crop}
                    onChange={(newCrop) => setCrop(newCrop)}
                    onComplete={(newCrop) => setCompletedCrop(newCrop)}
                    aspect={rounded ? 1 : undefined}
                    keepSelection={true}
                    circularCrop={rounded}
                    style={{ maxWidth: '100%' }}
                  >
                    <img
                      ref={cropModalImageRef}
                      src={displayImage}
                      alt="Crop source"
                      onLoad={(e) => onCropImageLoaded(e.currentTarget)}
                      style={{ maxWidth: '100%', display: 'block', width: '100%', height: 'auto', position: bgDragMode ? 'relative' : undefined, zIndex: bgDragMode ? 10 : 'auto' }}
                    />
                  </ReactCrop>
                  {bgFile && (
                    <div className="absolute top-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded pointer-events-none">
                      {isDraggingBg ? 'Dragging background...' : 'Drag to adjust background'}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full max-w-sm rounded-3xl bg-slate-900/95 p-4">
                <p className="mb-3 text-sm font-semibold text-white">Crop settings</p>
                <div className="space-y-3 text-sm text-slate-300">
                  <div>
                    <span className="block font-medium text-white">Shape</span>
                    <span>{rounded ? 'Rounded circular crop' : 'Flexible rectangular crop'}</span>
                  </div>
                  <div>
                    <span className="block font-medium text-white">Original dimensions</span>
                    <span>{currentDimensions.width} × {currentDimensions.height}px</span>
                  </div>
                  {(colorPicker || bgFile) && (
                    <div>
                      <span className="block font-medium text-white">Background</span>
                      {bgFile ? (
                        <span className="text-xs">
                          Custom image
                          {bgFile && <div className="text-xs text-slate-400 mt-1">Drag image in preview to adjust position</div>}
                        </span>
                      ) : (
                        <div
                          className="w-8 h-8 rounded mt-1 border border-white/20"
                          style={{ backgroundColor: colorPicker }}
                        />
                      )}
                    </div>
                  )}
                  <div>
                    <span className="block font-medium text-white">Preview</span>
                    <div
                      className={`mt-2 overflow-hidden rounded-2xl bg-slate-950 p-2 ${rounded ? 'rounded-full' : ''}`}
                      style={{
                        backgroundColor: colorPicker || '#ffffff',
                        backgroundImage: bgFile ? `url(${bgFile})` : undefined,
                        backgroundPosition: `${bgOffsetX}px ${bgOffsetY}px`,
                        backgroundSize: 'auto',
                        backgroundRepeat: 'repeat',
                      }}
                    >
                      {completedCrop ? (
                        <canvas
                          className="h-48 w-full object-contain"
                          style={{ display: 'block', maxHeight: '192px' }}
                          ref={(canvas) => {
                            if (!canvas || !imageRef || !completedCrop) return;
                            const ctx = canvas.getContext('2d');
                            if (!ctx) return;

                            const scaleX = imageRef.naturalWidth / imageRef.width;
                            const scaleY = imageRef.naturalHeight / imageRef.height;
                            const pixelCrop = {
                              x: Math.round(completedCrop.x * scaleX),
                              y: Math.round(completedCrop.y * scaleY),
                              width: Math.round(completedCrop.width * scaleX),
                              height: Math.round(completedCrop.height * scaleY),
                            };

                            // Scale down for preview
                            const maxPreviewSize = 192;
                            const scale = Math.min(maxPreviewSize / pixelCrop.width, maxPreviewSize / pixelCrop.height, 1);
                            canvas.width = pixelCrop.width * scale;
                            canvas.height = pixelCrop.height * scale;

                            // Apply background
                            if (bgFile) {
                              const bgImg = new window.Image();
                              bgImg.crossOrigin = "anonymous";
                              bgImg.src = bgFile as string;
                              bgImg.onload = () => {
                                try {
                                  const pattern = ctx.createPattern(bgImg, 'repeat');
                                  if (pattern) {
                                    ctx.scale(scale, scale);
                                    ctx.translate(-bgOffsetX, -bgOffsetY);
                                    ctx.fillStyle = pattern;
                                    ctx.fillRect(0, 0, pixelCrop.width, pixelCrop.height);
                                    ctx.translate(bgOffsetX, bgOffsetY);
                                    ctx.scale(1/scale, 1/scale);
                                  }
                                  drawPreview();
                                } catch (e) {
                                  drawPreview();
                                }
                              };
                              bgImg.onerror = () => drawPreview();
                            } else if (colorPicker) {
                              ctx.scale(scale, scale);
                              if (rounded) {
                                const radius = Math.min(pixelCrop.width, pixelCrop.height) / 2;
                                const gradient = ctx.createRadialGradient(pixelCrop.width / 2, pixelCrop.height / 2, 10, pixelCrop.width / 2, pixelCrop.height / 2, radius);
                                gradient.addColorStop(0, `${colorPicker}7f`);
                                gradient.addColorStop(1, colorPicker);
                                ctx.fillStyle = gradient;
                              } else {
                                const gradient = ctx.createRadialGradient(pixelCrop.width, pixelCrop.height, 10, pixelCrop.width, pixelCrop.height, pixelCrop.width);
                                gradient.addColorStop(0, `${colorPicker}7f`);
                                gradient.addColorStop(1, colorPicker);
                                ctx.fillStyle = gradient;
                              }
                              ctx.fillRect(0, 0, pixelCrop.width, pixelCrop.height);
                              ctx.scale(1/scale, 1/scale);
                              drawPreview();
                            } else {
                              drawPreview();
                            }

                            function drawPreview() {
                              if (rounded) {
                                ctx!.scale(scale, scale);
                                const radius = Math.min(pixelCrop.width, pixelCrop.height) / 2;
                                ctx!.beginPath();
                                ctx!.arc(pixelCrop.width / 2, pixelCrop.height / 2, radius, 0, Math.PI * 2);
                                ctx!.closePath();
                                ctx!.clip();
                                ctx!.scale(1/scale, 1/scale);
                              }

                              ctx!.drawImage(
                                imageRef!,
                                pixelCrop.x,
                                pixelCrop.y,
                                pixelCrop.width,
                                pixelCrop.height,
                                0,
                                0,
                                canvas!.width,
                                canvas!.height
                              );
                            }
                          }}
                        />
                      ) : (
                        <img src={displayImage} alt="Crop preview" className="h-48 w-full object-contain" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:justify-end">
              <button onClick={handleCloseCrop} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">Cancel</button>
              <button onClick={handleSaveCrop} className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600">Save crop</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}