import { Building2, Moon, Sparkles } from "lucide-react";
import {
  FaInstagram,
  FaSoundcloud,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

export const images = {
  logo_w: "/images/logo-w.png",
  heroVideo: "/videos/hero-bg.mp4",
  media1: "/videos/media1.mp4",
  media2: "/videos/media2.mp4",
  media3: "/videos/media3.mp4",
  media1Thumb: "/images/media-thumbs/media1.webp",
  media2Thumb: "/images/media-thumbs/media2.webp",
  media3Thumb: "/images/media-thumbs/media3.webp",
  hero: "/images/media-thumbs/media1.webp",
  portrait: "/images/profile.JPEG",
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

export const stats = [
  ["600+", "Events Performed"],
  ["20+", "Cities Toured"],
  ["100+", "Unique Venues"],
  ["10+", "Genre Versatility"],
];

export const experiences = [
  {
    icon: Moon,
    tone: "nightlife",
    title: "Club & Nightlife",
    copy: "Electrifying sets built for packed dance floors. From Bollywood bangers to Techno and commercial anthems, every transition is designed to keep the crowd moving all night long.",
  },
  {
    icon: Building2,
    tone: "gala",
    title: "Corporate Galas",
    copy: "Professional yet energetic musical experiences tailored for corporate events, private parties, launches, and celebrations — creating the perfect atmosphere from start to finish.",
  },
  {
    icon: Sparkles,
    tone: "wedding",
    title: "Luxury Weddings",
    copy: "From elegant entries to unforgettable dance-floor moments, curated music experiences that blend timeless favorites with high-energy celebrations for every generation.",
  },
];

export const mediaVideos = [
  {
    title: "Club Gig",
    meta: "Live performance footage",
    src: images.media1,
    thumbnail: images.media1Thumb,
  },
  {
    title: "College Fest",
    meta: "Crowd energy highlights",
    src: images.media3,
    thumbnail: images.media3Thumb,
  },
  {
    title: "After Hours Set",
    meta: "Club night recap",
    src: images.media2,
    thumbnail: images.media2Thumb,
  },
];

export const partnerLogos = [
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

export const youtubePlaylist = {
  id: "PLvo3DCww7VGHZ1vQmsmo-tptnITXMbhtn",
  url: "https://youtube.com/playlist?list=PLvo3DCww7VGHZ1vQmsmo-tptnITXMbhtn&si=6Nqole-uWL-a2-pf",
};

export const navLinks = [
  ["Media", "#media"],
  ["Releases", "#releases"],
  ["Experience", "#experience"],
  ["Bookings", "#booking"],
  ["Quick Links", "#footer"],
];

export const eventTypes = [
  "Club / Festival",
  "Corporate Event",
  "Luxury Wedding",
  "Private Venue",
];

export const socialLinks = [
  {
    name: "Instagram",
    color: "#e4405f",
    link: "https://www.instagram.com/peculiar_beats/",
    icon: FaInstagram,
  },
  {
    name: "Whatsapp",
    color: "#25D366",
    link: "https://wa.me/917619437950?text=Hi%20Peculiar%20Beats,%20I%20want%20to%20book%20you%20for%20an%20event",
    icon: FaWhatsapp,
  },
  {
    name: "SoundCloud",
    color: "#ff5500",
    link: "https://soundcloud.com/peculiar-beats",
    icon: FaSoundcloud,
  },
  {
    name: "YouTube",
    color: "#ff0000",
    link: "https://www.youtube.com/@Peculiar_Beats",
    icon: FaYoutube,
  },
];
