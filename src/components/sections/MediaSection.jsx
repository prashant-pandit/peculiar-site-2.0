import React, { useRef, useState } from "react";
import Slider from "react-slick";
import { ArrowLeft, ArrowRight, Clapperboard, Pause, Play } from "lucide-react";
import { mediaVideos } from "../../constants";
import { useViewportWidth } from "../../hooks";

export default function MediaSection() {
  const sliderRef = useRef(null);
  const featuredVideoRef = useRef(null);
  const featuredVideoPlayerRef = useRef(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isFeaturedVideoPlaying, setIsFeaturedVideoPlaying] = useState(false);
  const viewportWidth = useViewportWidth();

  const selectedVideo = mediaVideos[selectedVideoIndex];
  const isMobileCarousel = viewportWidth < 820;

  const slidesToShow = isMobileCarousel
    ? 1
    : viewportWidth < 1100
      ? Math.min(mediaVideos.length || 1, 2)
      : Math.min(mediaVideos.length || 1, 3);
  const canSlide = mediaVideos.length > slidesToShow;

  const settings = {
    arrows: false,
    dots: canSlide,
    centerMode: isMobileCarousel && mediaVideos.length > 1,
    centerPadding: isMobileCarousel ? "34px" : "0px",
    infinite: canSlide,
    speed: 450,
    slidesToShow,
    slidesToScroll: 1,
  };

  const handleSelectVideo = (index) => {
    setSelectedVideoIndex(index);
    setIsFeaturedVideoPlaying(false);
    requestAnimationFrame(() => {
      const playerTop = featuredVideoRef.current?.getBoundingClientRect().top;

      if (playerTop == null) {
        return;
      }

      const headerOffset = window.innerWidth < 768 ? 96 : 120;

      window.scrollTo({
        top: window.scrollY + playerTop - headerOffset,
        behavior: "smooth",
      });
    });
  };

  const handleFeaturedVideoClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const videoElement = featuredVideoPlayerRef.current;
    if (!videoElement) return;

    if (videoElement.paused) {
      void videoElement.play().catch(() => {});
      return;
    }

    videoElement.pause();
  };

  return (
    <section className="render-deferred section-shell overflow-hidden" id="media">
      <div className="visuals-panel">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="section-title flex items-center gap-3">
              <Clapperboard size={30} className="text-primary" aria-hidden="true" />
              Visuals
            </h2>
            <p className="body-copy mt-4 max-w-2xl">
              Browse performance visuals and play directly from here.
            </p>
          </div>

          {mediaVideos.length > 1 && (
            <div className="flex gap-3">
              <button
                className="icon-button"
                onClick={() => sliderRef.current?.slickPrev()}
                aria-label="Previous video"
              >
                <ArrowLeft size={18} />
              </button>

              <button
                className="icon-button"
                onClick={() => sliderRef.current?.slickNext()}
                aria-label="Next video"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>

        <Slider
          key={`${mediaVideos.length}-${slidesToShow}-${isMobileCarousel}`}
          ref={sliderRef}
          {...settings}
          className="track-slider"
        >
          {mediaVideos.map((video, index) => (
            <div className="px-2" key={video.src}>
              <button
                className={`track-card group text-left ${
                  selectedVideoIndex === index ? "active" : ""
                }`}
                onClick={() => handleSelectVideo(index)}
                type="button"
              >
                <span className="relative mb-4 block aspect-video overflow-hidden rounded bg-black">
                  <video
                    className="h-full w-full object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                    muted
                    playsInline
                    preload="none"
                    poster={video.thumbnail}
                  >
                    <source src={video.src} type="video/mp4" />
                  </video>

                  <span className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition group-hover:opacity-100">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-black">
                      <Play size={24} fill="currentColor" />
                    </span>
                  </span>
                </span>

                <span className="label-caps mb-2 block text-primary">Club Gig</span>

                <span className="block font-syne text-lg font-semibold leading-tight text-on-surface">
                  {video.title}
                </span>

                <span className="body-copy mt-2 block text-sm">{video.meta}</span>
              </button>
            </div>
          ))}
        </Slider>

        <div
          className="bento-card mx-auto mt-6 w-full max-w-3xl overflow-hidden p-3 md:max-w-4xl md:p-4"
          ref={featuredVideoRef}
        >
          <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
            <video
              key={selectedVideo.src}
              className="h-full w-full object-cover"
              controls
              playsInline
              preload="none"
              poster={selectedVideo.thumbnail}
              aria-label={`${selectedVideo.title} video`}
              ref={featuredVideoPlayerRef}
              onClick={handleFeaturedVideoClick}
              onPlay={() => setIsFeaturedVideoPlaying(true)}
              onPause={() => setIsFeaturedVideoPlaying(false)}
              onEnded={() => setIsFeaturedVideoPlaying(false)}
            >
              <source src={selectedVideo.src} type="video/mp4" />
            </video>

            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white shadow-lg">
                {isFeaturedVideoPlaying ? (
                  <Pause size={18} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" />
                )}
              </span>
            </span>
          </div>

          <div className="mt-5">
            <span className="label-caps text-primary">Featured Video</span>

            <h3 className="mt-2 font-syne text-2xl font-bold text-on-surface">
              {selectedVideo.title}
            </h3>

            <p className="body-copy mt-1">{selectedVideo.meta}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
