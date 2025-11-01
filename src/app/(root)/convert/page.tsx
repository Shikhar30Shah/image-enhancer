import ColorPallete from "@/components/ColorPalette";

const getStatus = (progress: number) => {
  if (progress === 100) return "Completed!";
  if (progress === 95) return "Almost there...";
  if (progress < 15) return "Processing...";
  if (progress < 50) return "Converting...";
  return "Enhancing...";
}

export default function Convert(props: { progress: number; resetState: () => void; imgUpdated: string; dimensions: { width: number; height: number } }) {
  const { progress, resetState, imgUpdated, dimensions } = props;

  return (
    <>
      <div className="flex flex-col items-center justify-center py-2">
        <h1 className="text-2xl font-bold mb-4">{getStatus(progress)}</h1>
          <div className="flex items-center">
            <progress value={progress} max={100} className="m-2 w-full sm:w-90 h-4 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-green-400 [&::-moz-progress-bar]:bg-green-400 transition-width-duration-500 ease-in-out" /><span>{progress}%</span>
          </div>
      </div>

      {progress === 100 && <ColorPallete dimensions={dimensions} imgUpdated={imgUpdated} resetState={resetState} />}
    </>
  );
}