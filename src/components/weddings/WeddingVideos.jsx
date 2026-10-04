import React, { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import { weddingVideos } from "../../constants/weddings.data";

export default function WeddingVideos() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedVideo(null);
      }
    };

    if (selectedVideo) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedVideo]);

  return (
    <section className="w-full bg-[#F8F4E8] py-16 sm:py-20 md:py-28 border-y border-[#E4DAC8]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 md:px-16">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <span className="block text-[11px] sm:text-xs font-manrope font-semibold uppercase tracking-[0.22em] text-[#7A786B] mb-2">
            CINEMATIC MOTION
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-normal text-[#1F1F1A] tracking-tight">
            WATCH THE CELEBRATION
          </h2>
        </div>

        {/* 3-Column Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {weddingVideos.map((video) => (
            <div
              key={video.id}
              className="group flex flex-col rounded-xl overflow-hidden bg-[#FFFDF8] border border-[#E4DAC8] shadow-sm hover:border-[#D8C49A] hover:shadow-md transition-all duration-300"
            >
              {/* Video Thumbnail with Centered Play Button */}
              <div
                className="relative aspect-[16/11] w-full overflow-hidden bg-[#1F1F1A] cursor-pointer"
                onClick={() => setSelectedVideo(video)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedVideo(video)}
                aria-label={`Play ${video.title}`}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle dark vignette */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-300" />

                {/* Center Circular Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/95 text-[#1F1F1A] shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                    <Play size={20} className="fill-[#1F1F1A] ml-1 text-[#1F1F1A]" />
                  </div>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="flex flex-col p-5 sm:p-6">
                <h3 className="font-playfair text-base sm:text-lg font-medium text-[#1F1F1A] leading-snug line-clamp-1 group-hover:text-[#586240] transition-colors">
                  {video.title}
                </h3>
                <span className="mt-2 text-xs font-manrope font-normal text-[#7A786B]">
                  {video.meta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessible Video Lightbox Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
          onClick={() => setSelectedVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedVideo.title}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white hover:bg-white hover:text-black transition"
              aria-label="Close video"
            >
              <X size={20} />
            </button>
            <div className="aspect-video w-full">
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-[#1F1F1A] p-4 sm:p-5 text-white">
              <h4 className="font-playfair text-lg font-normal text-white">
                {selectedVideo.title}
              </h4>
              <p className="text-xs font-manrope text-white/70 mt-1">
                {selectedVideo.meta}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
