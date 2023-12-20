import { init } from "ityped";
import { useEffect } from "react";

const Loader = () => {
  useEffect(() => {
    init(document.getElementById("typed") as HTMLElement, {
      backDelay: 1500,
      backSpeed: 60,
      strings: ["Loading..."],
      showCursor: false,
    });
  }, []);
  return (
    <div
      className="w-full h-screen flex items-center justify-center absolute top-0 left-0 z-40 flex-col gap-y-4"
      style={{
        background: "rgba(0,0,0,0.9)",
      }}
    >
      <div className="center__loading">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <h1
        className={"text-white font-inter text-2xl font-semibold"}
        id={"typed"}
      />
    </div>
  );
};

export default Loader;
