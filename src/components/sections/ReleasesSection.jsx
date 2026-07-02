import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { ArrowLeft, ArrowRight, Disc3, Play } from "lucide-react";
import { youtubePlaylist } from "../../constants";
import { useViewportWidth } from "../../hooks";

export default function ReleasesSection() {
  const sliderRef = useRef(null);
  const [tracks, setTracks] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [playlistStatus, setPlaylistStatus] = useState("loading");
  const viewportWidth = useViewportWidth();
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const isMobileCarousel = viewportWidth < 820;
  const slidesToShow = isMobileCarousel
    ? 1
    : viewportWidth < 1100
      ? Math.min(tracks.length || 1, 2)
      : Math.min(tracks.length || 1, 3);
  const canSlide = tracks.length > slidesToShow;
  const embedUrl = selectedVideoId
    ? `https://www.youtube.com/embed/${selectedVideoId}?list=${youtubePlaylist.id}&rel=0&modestbranding=1`
    : `https://www.youtube.com/embed/videoseries?list=${youtubePlaylist.id}&rel=0&modestbranding=1`;
  const settings = {
    arrows: false,
    dots: canSlide,
    centerMode: isMobileCarousel && tracks.length > 1,
    centerPadding: isMobileCarousel ? "34px" : "0px",
    infinite: canSlide,
    speed: 450,
    slidesToShow,
    slidesToScroll: 1,
  };

  useEffect(() => {
    if (!apiKey) {
      setPlaylistStatus("missing-key");
      return;
    }

    const controller = new AbortController();
    const playlistUrl = new URL(
      "https://www.googleapis.com/youtube/v3/playlistItems",
    );
    playlistUrl.search = new URLSearchParams({
      part: "snippet",
      maxResults: "50",
      playlistId: youtubePlaylist.id,
      key: apiKey,
    }).toString();

    async function loadPlaylist() {
      try {
        const response = await fetch(playlistUrl, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Unable to load YouTube playlist.");
        }
        const data = await response.json();
        const items = data.items
          .map((item) => {
            const snippet = item.snippet;
            const videoId = snippet?.resourceId?.videoId;
            return {
              id: videoId,
              title: snippet?.title,
              thumbnail:
                snippet?.thumbnails?.maxres?.url ||
                snippet?.thumbnails?.standard?.url ||
                snippet?.thumbnails?.high?.url ||
                snippet?.thumbnails?.medium?.url,
              channelTitle:
                snippet?.videoOwnerChannelTitle || snippet?.channelTitle,
            };
          })
          .filter(
            (item) =>
              item.id &&
              item.thumbnail &&
              item.title &&
              !item.title.toLowerCase().includes("deleted"),
          );

        setTracks(items);
        setSelectedVideoId(items[0]?.id || "");
        setPlaylistStatus(items.length ? "ready" : "empty");
      } catch (error) {
        if (error.name !== "AbortError") {
          setPlaylistStatus("error");
        }
      }
    }

    loadPlaylist();
    return () => controller.abort();
  }, [apiKey]);

  return (
    <section
      className="mx-auto mb-0 w-full max-w-container-max overflow-hidden px-margin-mobile md:px-margin-desktop"
      id="releases"
    >
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="section-title flex items-center gap-3">
            <Disc3 size={30} className="text-primary" aria-hidden="true" />
            Music Releases
          </h2>
          <p className="body-copy mt-4 max-w-2xl">
            Browse the playlist and play each track directly from here.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {tracks.length > 1 && (
            <>
              <button
                className="icon-button"
                onClick={() => sliderRef.current?.slickPrev()}
                aria-label="Previous track"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                className="icon-button"
                onClick={() => sliderRef.current?.slickNext()}
                aria-label="Next track"
              >
                <ArrowRight size={18} />
              </button>
            </>
          )}
          <a
            href={youtubePlaylist.url}
            target="_blank"
            rel="noreferrer"
            className="btn-outline w-fit"
          >
            <Play size={16} fill="currentColor" />
            Open Playlist
          </a>
        </div>
      </div>
      <div className="bento-card mx-auto w-full max-w-3xl overflow-hidden p-3 md:max-w-4xl md:p-4">
        <div className="aspect-video overflow-hidden rounded bg-black">
          <iframe
            className="h-full w-full"
            src={embedUrl}
            title="Peculiar Beats YouTube playlist"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      {playlistStatus === "ready" && (
        <Slider
          key={`${tracks.length}-${slidesToShow}-${isMobileCarousel}`}
          ref={sliderRef}
          {...settings}
          className="track-slider mt-6"
        >
          {tracks.map((track) => (
            <div className="px-2" key={track.id}>
              <button
                className={`track-card group text-left ${selectedVideoId === track.id ? "active" : ""}`}
                onClick={() => setSelectedVideoId(track.id)}
                type="button"
              >
                <span className="relative mb-4 block aspect-video overflow-hidden rounded bg-black">
                  <img
                    src={track.thumbnail}
                    alt={`${track.title} thumbnail`}
                    className="h-full w-full object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition group-hover:opacity-100">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-black">
                      <Play size={24} fill="currentColor" />
                    </span>
                  </span>
                </span>
                <span className="label-caps mb-2 block text-primary">
                  YouTube Track
                </span>
                <span className="block font-syne text-lg font-semibold leading-tight text-on-surface">
                  {track.title}
                </span>
                <span className="body-copy mt-2 block text-sm">
                  {track.channelTitle}
                </span>
              </button>
            </div>
          ))}
        </Slider>
      )}
      {playlistStatus === "loading" && (
        <div className="bento-card mt-6 p-6">
          <p className="body-copy">Loading playlist tracks...</p>
        </div>
      )}
    </section>
  );
}
