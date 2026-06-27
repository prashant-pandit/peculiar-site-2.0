import { createRoot } from "react-dom/client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { App } from "./components";
import "./styles.css";

createRoot(document.getElementById("root")).render(<App />);
