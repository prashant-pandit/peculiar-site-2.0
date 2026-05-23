import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Slider from "react-slick";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  Moon,
  Play,
  Sparkles,
} from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles.css";

const images = {
  logo_w: "/images/logo-w.png",
  heroVideo: "/videos/hero-bg.mp4",
  media1: "/videos/media1.mp4",
  media2: "/videos/media2.mp4",
  media3: "/videos/media3.mp4",
  hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqKzu1AparutUahKdpYJLTQ4oh3_erCH8JN2NViVp-3DGP3vv8dg_4h9f9qK9AQEkoG2tO6m69Eg0OG0jW4G21KwCtHY4D4sw3q4lUBmce67dwHBmtBlpWWFaJQLgA_CXNeZzXaKq443NmMJGYb3y16_Er9buhu55779O3IEgLhGifDAFiNkBVSGXRy_lUTN45dDjG3SCuyodo5AtzPqa2Ow7znr_HzWIZIJUCSKWFWiO-pYRjEuQE1PM-ZoPfvN-_nA9vF1YgKJEo",
  portrait:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDmeZJpwKr20rvrmfBp7b494ZAxH0w6zPzEk6Z1rGuLEwKJTLa8KTewwmR2yfqJJgLkNBBOru7w3L1_3UR-e_cyFRGl8w4oMRNQINbMQgBMDc5uDSmb2nzO-YAHNn4VmGjSQP0oWYvjOpTo7o7mbjSTsOIvPx21UCoGnls368sQ7USiY-IIZM4KKxA_2B37e_fhwElGgkjwWGQ5HoslB6b6FU3XgQfYwJ07OUvo5iKYI5ZdDZMhz1hP-WhhK6zXSOzsEPFjquyljqHD",
  festival:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC0xZ4KaAk_scAcdw4st9uhwMEvOUaslhsIK_ZgQlb3TSYhGVSZ105irWAqe-kT3eUAPTnxmI0PzDaUQ9hJLsg8JrADngUxCs0i2bT0MMJ1XZM9iQtucvEvbbdKsD3FSc4Gfro9PyzxH3GgzpinPc4OFgGTZtvr-aNDAM1CUE8w7UKAyeqeUYXQcNI0PHRXzRwQInlnHucf6SK0vbBZ18QSBVBD_yRMjcs_QsbzgqXh7R_a9MN9-Eq7xWjPIXVglFI-VL1Mdi5QvCkx",
  deck: "https://lh3.googleusercontent.com/aida-public/AB6AXuDixebxd1ASF9II5LQMNkND8uhH57RSXUO1wWgnvShzgfW_y5YX8ef_FvpOy2kcUA-niSJ0CUtND0tXW0BWe5Uv0iToNGMjo6VCY_XRtgFOKNmgIWW3NlhZPcszfFWhwDq4s8WmYknd0iAqfqAqDn-_5Q7kAqF-Eu4PIcLXI5h7AGBInzmQ5nsMNEFk13yx2bj-rrZGnv1jyUVT72UqzYfThiBDRz0DUFUxsBufSqL_H2r5EWwTrlqAa5mmpWLKPeb1AML9cZUBNpam",
  booth:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDplcP_AyhNJabbMRAMF5pgn01xbQQ5NCqK4y89PBbklhk9nj8QLVsrH7ftbQdHppzW4FTVSQONByrrCYl_2FbTyEgLCgiqHHaS-tO3vl3YY1IbNIB1KhOhRF68lglpsLru45VcCVoen-6UNQPXYEq0ON0UOrxs6X4WNPFDlWlfJyAgnuVJciPtClpvquUFWAExkSV_2R-QdEkLjlqptiblD3VYrpvR14iSYSpeQqq3WqhWmYiZ__KBCZR3h_RCCM40cTLbCOxNj4pR",
  art1: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAYvgrs2o6X7jkiu8b7-rpbWC2D5ppYH6xw8m-9d7IcC63-vARatJX8pfFBpoOuf9h_Ww3bAu2ctJfd6OvV4QfMFkkhWd0c2RdU52Gvypny7MkvQokpwELPKFzan0m_Z1aneA3fDcxUPgue1SJs3EfKYgg4MEfE5uEnRXW6iZmHGaVxe661pMigwbwI2qV4FLaazKYzuUlxK90jw_MmkkQeXhK6ncjkNF0JRLmFJPRloCkdskmSm88ZH2ssehXuwjkW7eeWBX_jkAU",
  art2: "https://lh3.googleusercontent.com/aida-public/AB6AXuAd9JNbncPovHvg0Wg54ySHBOILyl4hnEBn0vYUydUyOLLhq35PFJIV9TdfWZ-oAxrFMxBQVFahNBmValcTf58nfcfDXVDKwl3bBSnsBTD9VV5nWYStfCL9DU-1ZEYG5y3sL1Vuq-_sdnrmr073kkHVRa3ireSGFg5kkZwChGc1egcJIfTAgtjWlA8jtZz3slj6lyEDVKx93QZiRlcpJYpj-svGHYkBkaL9p1MlrISS2VystZwL3xfbm7ujk88BQlecNdF5dOGabP8I",
  art3: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1bNmBtUS1hSf9IE0ODQzvZhxEbWELT1iNU2EcpBuCl81h-GNW2rrB3rH41OOpSTHREDSDvbSnVxVQdNRt04F8A9Hw6G3t-J8WcIHtr8AKFumKVb9mPsWLFsHgJSMPKEYFJMNMc6wWVMT4pTTR-ea2BhiVHijM9cncPbzYhwSvagnTYBGr0UH3R8QXABBmp7hi016Lld3nx0siedYH3p21JpOpA5-YcB1dmt5h8Hrohjv5L9YKiBScAdDqsUC2_D7ZeAsFRxztdtzM",
  logos:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDsI07zLRWI-pBUH3E4Udyj-D5TcEOAoYjphuni_qZw6U3Ic8qN4I52pmNxBz6TcBHvXf8T4E9XOXYgj-A3l5JexDFOd4B08ZRTxZ-xNiMupkKCXFsolp-SHpWEjReDuqF3p5HN4DAAjnGRFKTGKW2q23tlaxI2o_Q6Mr0vK_IHwTCTkyoBEigxoiKPtbdfWbFZvx4Dcz0roPDLnvhIckSoHszqho60pU6UBAQh2ESCtrGVBxFSqxksNhY5kU7iR1Hx-KdR5o3q7WaG",
};

const stats = [
  ["600+", "Events Performed"],
  ["25+", "Cities Toured"],
  ["100+", "Unique Venues"],
  ["10+", "Genre Versatility"],
];

const experiences = [
  {
    icon: Moon,
    title: "Club & Nightlife",
    copy: "High-energy electronic sets designed for peak-time dancefloors. Deep, driving rhythms spanning house to techno.",
  },
  {
    icon: Building2,
    title: "Corporate Galas",
    copy: "Sophisticated, low-profile soundscapes that encourage networking, transitioning smoothly to celebratory energy later in the evening.",
  },
  {
    icon: Sparkles,
    title: "Luxury Weddings",
    copy: "Bespoke musical curation from cocktail hour to the final send-off, blending classic anthems with modern edits seamlessly.",
  },
];

const partnerLogos = [
  ["Brand 1", "/images/partners/brand-1.jpg"],
  ["Brand 2", "/images/partners/brand-2.jpg"],
  ["Brand 3", "/images/partners/brand-3.jpg"],
  ["Brand 4", "/images/partners/brand-4.jpg"],
  ["Eventopia", "/images/partners/eventopia.png"],
  ["Eventra", "/images/partners/eventra.png"],
  ["Fern Hotels", "/images/partners/Fern-Hotels.jpg"],
  ["House", "/images/partners/house.png"],
  ["Insomnia", "/images/partners/Insomnia-Logo.png"],
  ["Orchard", "/images/partners/orchard.jpg"],
  ["Sam", "/images/partners/sam.png"],
  ["Topia", "/images/partners/topia.png"],
];

const youtubePlaylist = {
  id: "PLvo3DCww7VGHZ1vQmsmo-tptnITXMbhtn",
  url: "https://youtube.com/playlist?list=PLvo3DCww7VGHZ1vQmsmo-tptnITXMbhtn&si=6Nqole-uWL-a2-pf",
};

const navLinks = [
  ["Experience", "#experience"],
  ["Media", "#media"],
  ["Releases", "#releases"],
  ["Bookings", "#booking"],
];

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState(navLinks[0][1]);

  useEffect(() => {
    const updateActiveLink = () => {
      const activeLink = navLinks.find(([, href]) => {
        const section = document.querySelector(href);
        if (!section) return false;

        const bounds = section.getBoundingClientRect();
        return bounds.top <= 150 && bounds.bottom > 150;
      });

      if (activeLink) {
        setActiveHref(activeLink[1]);
      }
    };

    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      updateActiveLink();
    };

    const onHashChange = () => {
      if (navLinks.some(([, href]) => href === window.location.hash)) {
        setActiveHref(window.location.hash);
      }
    };

    onHashChange();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition duration-300 ${
        scrolled || open
          ? "border-b border-outline-variant/20 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-container-max items-center justify-between px-margin-mobile py-3 md:px-4">
        <a
          href="#"
          className="font-syne text-2xl font-bold text-on-surface md:text-3xl"
        >
          <img
            src={images.logo_w}
            alt={"peculiar beats logo"}
            className="w-[210px]"
          />
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(([item, href]) => (
            <a
              key={item}
              href={href}
              className={`nav-link ${activeHref === href ? "active" : ""}`}
              onClick={() => setActiveHref(href)}
            >
              {item}
            </a>
          ))}
        </div>
        <a
          href="#booking"
          className="btn-primary hidden md:inline-flex"
          onClick={() => setActiveHref("#booking")}
        >
          Book Now
        </a>
        <button
          className="icon-button md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((value) => !value)}
        >
          <Menu size={22} />
        </button>
      </div>
      {open && (
        <div className="border-t border-outline-variant/20 px-margin-mobile pb-5 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {navLinks.map(([item, href]) => (
              <a
                key={item}
                href={href}
                className={`nav-link w-fit ${activeHref === href ? "active" : ""}`}
                onClick={() => {
                  setActiveHref(href);
                  setOpen(false);
                }}
              >
                {item}
              </a>
            ))}
            <a
              href="#booking"
              className="btn-primary w-full"
              onClick={() => {
                setActiveHref("#booking");
                setOpen(false);
              }}
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function MusicStringWave() {
  const strings = [
    "M7 25 C18 13 28 13 39 25 S61 37 72 25 S94 13 105 25 S127 37 138 25 S160 13 173 25",
    "M7 25 C19 37 28 37 40 25 S61 13 73 25 S94 37 106 25 S127 13 139 25 S160 37 173 25",
    "M7 25 C21 19 28 31 40 25 S60 19 73 25 S93 31 106 25 S126 19 139 25 S159 31 173 25",
  ];

  return (
    <div className="music-string-wave" aria-hidden="true">
      <svg viewBox="0 0 180 42" role="presentation">
        {strings.map((path, index) => (
          <g className={`music-string-layer music-string-layer-${index + 1}`} key={path}>
            <path className="music-string music-string-glow" d={path} />
            <path className="music-string" d={path} />
            <path className="music-string music-string-trail" d={path} />
          </g>
        ))}
      </svg>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-[820px] items-center justify-center overflow-hidden px-margin-mobile md:px-margin-desktop">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={images.hero}
        aria-label="Peculiar Beats performance background"
      >
        <source src={images.heroVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-background/80" />
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        <h1 className="hero-title font-syne font-extrabold text-on-surface">
          Unique music. Limitless energy. One mission — keep the dance floor
          alive.
        </h1>
        <MusicStringWave />
        <div className="mt-8 flex flex-col justify-center gap-5 sm:flex-row">
          <a href="#booking" className="btn-primary">
            Book for Event
          </a>
          <a href="#releases" className="btn-outline">
            <Play size={16} fill="currentColor" />
            Listen to Mixes
          </a>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="border-y border-outline-variant/20 bg-surface-container-low py-16">
      <div className="mx-auto grid max-w-container-max grid-cols-2 gap-8 px-margin-mobile text-center md:grid-cols-4 md:px-margin-desktop">
        {stats.map(([value, label]) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <span className="font-syne text-4xl font-bold text-primary-container md:text-5xl">
              {value}
            </span>
            <span className="label-caps text-on-surface-variant">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section className="overflow-hidden bg-background py-28">
      <h2 className="label-caps mb-12 text-center text-on-surface-variant/60">
        Brands That Chose Peculiar Beats
      </h2>
      <div className="marquee-track">
        {[0, 1].map((group) => (
          <div className="marquee-row" key={group}>
            {partnerLogos.map(([name, src]) => (
              <img
                key={`${group}-${name}`}
                src={src}
                alt={`${name} logo`}
                className="partner-logo"
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="section-shell">
      <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-container">
            <img
              src={images.portrait}
              alt="DJ performing at a high-end club"
              className="h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
          </div>
        </div>
        <div className="flex flex-col justify-center md:col-span-7 md:pl-12">
          <div className="mb-6 inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary-container" />
            <span className="label-caps text-primary">
              The Architect of Sound
            </span>
          </div>
          <h2 className="section-title max-w-3xl">INTRO</h2>
          <p className="body-copy mt-6 max-w-2xl text-lg">
            Yo! I’m Peculiar Beats — the DJ who turns every event into a
            full-blown vibe. Whether it’s Bollywood hits, Techno grooves, or
            Regional fire, I mix it all with a twist that keeps people locked to
            the dancefloor. I’ve rocked 600+ events across multiple states and
            cities, and 100+ venues — from weddings and clubs to big concerts
            with celeb DJs. My goal? Simple. Keep the floor packed, and the
            energy unmatched.
          </p>
          <p className="body-copy mt-5 max-w-2xl">
            Weddings, club nights, house parties, or corporate shows — I’ve done
            it all, and I bring the vibe every time. From throwback Bollywood to
            techno heaters and my signature Bollytech mashups, I build each set
            to match the crowd, the mood, and the moment. No copy-paste
            playlists here — just pure energy, emotion, and music that hits
            where it should.
          </p>
        </div>
      </div>
    </section>
  );
}

function Experiences() {
  return (
    <section className="section-shell" id="experience">
      <h2 className="section-title mb-10">Curated Experiences</h2>
      <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
        {experiences.map(({ icon: Icon, title, copy }) => (
          <article key={title} className="bento-card p-8">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-primary">
              <Icon size={22} />
            </div>
            <h3 className="font-syne text-2xl font-semibold text-on-surface">
              {title}
            </h3>
            <p className="body-copy mt-4">{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Media() {
  return (
    <section className="section-shell" id="media">
      <h2 className="section-title mb-10">Visuals</h2>
      <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
        <div className="bento-card group relative aspect-video overflow-hidden md:col-span-8">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            controls
            loop
            playsInline
            aria-label="Peculiar Beats performance background"
          >
            <source src={images.media1} type="video/mp4" />
          </video>
          <div className="absolute bottom-6 left-6">
            <span className="label-caps rounded border border-primary/30 bg-black/80 px-3 py-1 text-primary">
              Club Gig
            </span>
            {/* <h3 className="mt-2 font-syne text-2xl font-semibold text-on-surface">
              Neon Nights Festival 2023
            </h3> */}
          </div>
        </div>
        <div className="bento-card group relative aspect-video overflow-hidden md:col-span-8">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            controls
            loop
            playsInline
            aria-label="Peculiar Beats performance background"
          >
            <source src={images.media3} type="video/mp4" />
          </video>
          <div className="absolute bottom-6 left-6">
            <span className="label-caps rounded border border-primary/30 bg-black/80 px-3 py-1 text-primary">
              Collage Fest
            </span>
            {/* <h3 className="mt-2 font-syne text-2xl font-semibold text-on-surface">
              Neon Nights Festival 2023
            </h3> */}
          </div>
        </div>
        <div className="bento-card group relative aspect-video overflow-hidden md:col-span-8">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            controls
            loop
            playsInline
            aria-label="Peculiar Beats performance background"
          >
            <source src={images.media2} type="video/mp4" />
          </video>
          <div className="absolute bottom-6 left-6">
            <span className="label-caps rounded border border-primary/30 bg-black/80 px-3 py-1 text-primary">
              Club Gig
            </span>
            {/* <h3 className="mt-2 font-syne text-2xl font-semibold text-on-surface">
              Neon Nights Festival 2023
            </h3> */}
          </div>
        </div>
      </div>
    </section>
  );
}

function Releases() {
  const sliderRef = useRef(null);
  const [tracks, setTracks] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [playlistStatus, setPlaylistStatus] = useState("loading");
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === "undefined" ? 1200 : window.innerWidth,
  );
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const isMobileCarousel = viewportWidth < 820;
  const slidesToShow = isMobileCarousel
    ? 1
    : viewportWidth < 1100
      ? Math.min(tracks.length || 1, 2)
      : Math.min(tracks.length || 1, 3);
  const embedUrl = selectedVideoId
    ? `https://www.youtube.com/embed/${selectedVideoId}?list=${youtubePlaylist.id}&rel=0&modestbranding=1`
    : `https://www.youtube.com/embed/videoseries?list=${youtubePlaylist.id}&rel=0&modestbranding=1`;
  const settings = {
    arrows: false,
    dots: tracks.length > 1,
    centerMode: isMobileCarousel && tracks.length > 1,
    centerPadding: isMobileCarousel ? "34px" : "0px",
    infinite: isMobileCarousel
      ? tracks.length > 1
      : tracks.length > slidesToShow,
    speed: 450,
    slidesToShow,
    slidesToScroll: 1,
  };

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
      className="mx-auto mb-32 w-full max-w-container-max overflow-hidden px-margin-mobile md:px-margin-desktop"
      id="releases"
    >
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="section-title">Music Releases</h2>
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
      <div className="bento-card max-w-full overflow-hidden p-3 md:p-4">
        <div className="aspect-video overflow-hidden rounded bg-black">
          <iframe
            className="h-full w-full"
            src={embedUrl}
            title="Peculiar Beats YouTube playlist"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
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

function Booking() {
  return (
    <section className="section-shell" id="booking">
      <div className="bento-card relative mx-auto max-w-4xl overflow-visible p-8 md:p-16">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-primary-container/5 blur-3xl" />
        <div className="relative z-10 mb-10 text-center">
          <h2 className="section-title">Initiate Protocol</h2>
          <p className="body-copy mt-3">
            Inquire about availability for your next event.
          </p>
        </div>
        <form className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="Name / Organization" placeholder="Enter details" />
            <DateField label="Event Date" />
          </div>
          <EventTypeSelect />
          <label className="block space-y-2">
            <span className="label-caps text-on-surface-variant">
              Project Details
            </span>
            <textarea
              className="form-field min-h-32 resize-none"
              placeholder="Describe the vibe, venue, and technical requirements..."
            />
          </label>
          <div className="flex justify-center pt-3">
            <button className="btn-primary w-full md:w-auto" type="button">
              Submit Inquiry
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});
const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const eventTypes = [
  "Club / Festival",
  "Corporate Event",
  "Luxury Wedding",
  "Private Venue",
];

function EventTypeSelect() {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(eventTypes[0]);
  const selectRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!selectRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  return (
    <div className="relative block space-y-2" ref={selectRef}>
      <span className="label-caps text-on-surface-variant">Event Type</span>
      <button
        className={`form-field custom-select-trigger ${open ? "open" : ""}`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{selectedType}</span>
        <ChevronDown
          className={`custom-select-chevron ${open ? "open" : ""}`}
          size={18}
        />
      </button>
      <input type="hidden" name="eventType" value={selectedType} />
      {open && (
        <div className="custom-select-menu" role="listbox" aria-label="Event Type">
          {eventTypes.map((type) => (
            <button
              className={`custom-select-option ${
                selectedType === type ? "selected" : ""
              }`}
              type="button"
              role="option"
              aria-selected={selectedType === type}
              key={type}
              onClick={() => {
                setSelectedType(type);
                setOpen(false);
              }}
            >
              {type}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

function isSameDate(date, comparisonDate) {
  return (
    date.getFullYear() === comparisonDate.getFullYear() &&
    date.getMonth() === comparisonDate.getMonth() &&
    date.getDate() === comparisonDate.getDate()
  );
}

function DateField({ label }) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewDate, setViewDate] = useState(new Date());
  const pickerRef = useRef(null);
  const today = new Date();
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarCells = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!pickerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  const changeMonth = (offset) => {
    setViewDate(new Date(year, month + offset, 1));
  };

  const selectDate = (day) => {
    const nextDate = new Date(year, month, day);
    setSelectedDate(nextDate);
    setOpen(false);
  };

  const selectToday = () => {
    const nextDate = new Date();
    setSelectedDate(nextDate);
    setViewDate(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
    setOpen(false);
  };

  return (
    <div className="relative block space-y-2" ref={pickerRef}>
      <span className="label-caps text-on-surface-variant">{label}</span>
      <button
        className="form-field flex items-center justify-between gap-3 pr-4 text-left"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={selectedDate ? "text-on-surface" : "text-on-surface-variant/60"}>
          {selectedDate ? formatDate(selectedDate) : "mm/dd/yyyy"}
        </span>
        <Calendar className="shrink-0 text-on-surface-variant" size={18} />
      </button>
      {open && (
        <div className="calendar-popover" role="dialog" aria-label={label}>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-syne text-2xl font-bold text-on-surface">
              {monthFormatter.format(viewDate)}
            </h3>
            <div className="flex items-center gap-2">
              <button
                className="calendar-nav-button"
                type="button"
                aria-label="Previous month"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="calendar-nav-button"
                type="button"
                aria-label="Next month"
                onClick={() => changeMonth(1)}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="calendar-grid mb-3">
            {weekDays.map((day) => (
              <span className="calendar-weekday" key={day}>
                {day}
              </span>
            ))}
            {calendarCells.map((day, index) =>
              day ? (
                <button
                  className={`calendar-day ${
                    selectedDate && isSameDate(new Date(year, month, day), selectedDate)
                      ? "selected"
                      : ""
                  } ${isSameDate(new Date(year, month, day), today) ? "today" : ""}`}
                  type="button"
                  key={`${month}-${day}`}
                  onClick={() => selectDate(day)}
                >
                  {day}
                </button>
              ) : (
                <span key={`empty-${index}`} />
              ),
            )}
          </div>
          <div className="flex items-center justify-between pt-2">
            <button
              className="calendar-text-button"
              type="button"
              onClick={() => setSelectedDate(null)}
            >
              Clear
            </button>
            <button className="calendar-text-button" type="button" onClick={selectToday}>
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, icon, ...props }) {
  return (
    <label className="block space-y-2">
      <span className="label-caps text-on-surface-variant">{label}</span>
      <span className="relative block">
        <input className={`form-field ${icon ? "pr-12" : ""}`} {...props} />
        {icon && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            {icon}
          </span>
        )}
      </span>
    </label>
  );
}

function Footer() {
  const socialLinks = [
    ["Instagram", "#e4405f"],
    ["Spotify", "#1db954"],
    ["SoundCloud", "#ff5500"],
    ["Apple Music", "#fa57c1"],
    ["YouTube", "#ff0000"],
  ];

  return (
    <footer className="footer-frame">
      <div className="footer-marquee" aria-hidden="true">
        <div className="footer-marquee-track">
          {[0, 1].map((group) => (
            <span className="footer-marquee-text" key={group}>
              PECULIAR BEATS
            </span>
          ))}
        </div>
      </div>
      <div className="footer-content">
        <div className="footer-socials">
          {socialLinks.map(([item, color]) => (
            <a
              href="#"
              className="footer-social-link"
              style={{ "--social-color": color }}
              key={item}
            >
              {item}
            </a>
          ))}
        </div>
        <div className="footer-copyright">
          © 2024 Peculiar Beats. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Partners />
        <Intro />
        <Media />
        <Releases />
        <Experiences />
        <Booking />
      </main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
