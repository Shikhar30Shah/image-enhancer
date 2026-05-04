import dynamic from "next/dynamic";
import FloatingOrbs from "@/components/FloatingOrbs";
import FeatureCards from "@/components/FeatureCards";

const ImageInput = dynamic(() => import("@/components/ImageInput"));

export default function Home() {
  return (
    <main className="font-sans text-white">
      <h1 className="text-2xl xs:text-2xl sm:text-3xl md:text-4xl text-center font-bold m-4 mt-6 animate-fade-in-up">
        Welcome to DP Maker
      </h1>
      <div className="min-h-screen text-center py-2 px-3 text-white overflow-hidden relative">
        <FloatingOrbs />

        <div className="relative z-10">
          <ImageInput />
        </div>

        <FeatureCards />
      </div>
    </main>
  );
}