import React from "react";
import Image from "next/image";
interface BannerEventProps {
  image?: string;
  video?: string;
}

const BannerEvent = ({ image, video }: BannerEventProps) => {
  return (
    <div className="bannerEvent relative">
      <div className="content-media lg:min-h-[75vh] min-h-[55vh]">
        <div className="absolute top-0 left-0 w-full h-full z-10 bg-black/20"></div>
        {image ? (
        <Image
          src={image || ""}
          alt="Banner Event"
          fill
          className="object-cover"
        />
        ) : (
          <video
            src={video || ""}
            autoPlay
            loop
            muted
            className="object-cover w-full h-full absolute top-0 left-0"
          />
        )}
      </div>
    </div>
  );
};

export default BannerEvent;
