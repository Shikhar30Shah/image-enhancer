"use client";

import ColorPallete from "@/components/ColorPalette";
import ProcessingAnimaion from "@/components/ProcessingAnimation";

const getStatus = (progress: number) => {
  if (progress === 100) return "Completed!";
  if (progress === 95) return "Almost there...";
  if (progress < 15) return "Processing...";
  if (progress < 50) return "Converting...";
  return "Enhancing...";
}

export default function Convert(props: { progress: number; resetState: () => void; imgUpdated: string; dimensions: { width: number; height: number } }) {
  const { progress, resetState, imgUpdated, dimensions } = props;

  const status = getStatus(progress);

  return (
    <>
      {progress < 100 && (
        <div className="flex flex-col items-center justify-center w-full py-2">
          <div className="flex items-center justify-center w-[80%]">
            <progress value={progress} max={100} className="m-2 h-4 w-[80%] sm:w-90 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-green-400 [&::-moz-progress-bar]:bg-green-400 transition-width-duration-500 ease-in-out" /><span>{progress}%</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">{status}</h1>
          
          {/* Processing Animation with Paintbrush Effect and Filler Content */}
          <ProcessingAnimaion />
        </div>
      )}

      {progress === 100 && <ColorPallete dimensions={dimensions} imgUpdated={imgUpdated} resetState={resetState} />}
    </>
  );
}