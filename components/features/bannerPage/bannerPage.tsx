interface BannerPageProps {
  title: string;
}
const BannerPage = ({ title }: BannerPageProps) => {
  return (
    <div className="bannerPage bg-[#091626] relative z-10 ">
      {/* Overlay avec dots blancs */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="content-banner min-h-[180px] md:min-h-[220px] lg:min-h-[30vh] flex flex-col justify-center items-center py-16 pt-[140px] md:py-16 lg:py-[120px] lg:pt-[220px]">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-12 gap-4 lg:gap-10 items-end">
            <div className="col-span-3 hidden lg:block"></div>
            <div className="col-span-12 lg:col-span-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white text-center">
                {title}
              </h1>
            </div>
            <div className="col-span-3 hidden lg:block"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerPage;
