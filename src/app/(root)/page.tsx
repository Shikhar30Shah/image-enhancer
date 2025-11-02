import ImageInput from "@/components/ImageInput";

export default function Home() {

  return (
    <main className="font-sans text-white">
      <h1 className=" text-2xl xs:text-2xl sm:text-3xl md:text-4xl text-center font-bold m-4 mt-6">Welcome to DP Maker</h1>
      <div className="min-h-screen text-center py-2 px-3 text-white overflow-hidden">
        {/* <div className="home-animate mb-4 opacity-0.5 absolute transform top-[15%] left-[15%] opacity-50 hover: rotate-12 transition-transform duration-500">
          <InstagramIcon className="icon-animate" color="#E1306C" width={128} height={128} />
        </div>
        <div className="home-animate mb-4 opacity-0.5 shadow-lg absolute transform top-[15%] right-[15%] opacity-50">
          <LinkedinIcon className="icon-animate" color="#0A66C2" width={128} height={128} />
        </div>
        <div className="home-animate mb-4 opacity-0.5 shadow-lg absolute transform top-[85%] right-[15%] opacity-50">
          <FacebookIcon className="icon-animate" color="#1877F2" width={128} height={128} />
        </div>
        <div className="home-animate mb-4 opacity-0.5 shadow-lg absolute transform top-[85%] right-[85%] opacity-50">
          <TwitterIcon className="icon-animate" color="#1DA1F2" width={128} height={128} />
        </div>
        <div className="home-animate mb-4 opacity-0.5 shadow-lg absolute transform top-[85%] right-[50%] opacity-50">
          <YoutubeIcon className="icon-animate" color="#FF0000" width={128} height={128} />
        </div> */}
        {/* <ColorPallete dimensions={{width: 1200, height: 800}} imgUpdated="" /> */}
        <ImageInput />
      </div>
    </main>
  );
}