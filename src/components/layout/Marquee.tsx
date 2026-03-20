const Marquee = () => {
  const items = [
    "VIDEO EDITING",
    "MOTION GRAPHICS",
    "COLOR GRADING",
    "STORYTELLING",
    "AI WORKFLOWS",
    "SOUND DESIGN",
    "VFX",
    "CINEMATOGRAPHY",
  ];

  const content = items.map((item) => (
    <span key={item} className="flex items-center gap-8">
      <span className="font-display text-lg md:text-xl tracking-[0.2em] text-off-white whitespace-nowrap">
        {item}
      </span>
      <span className="text-orange text-2xl">•</span>
    </span>
  ));

  return (
    <div className="w-full bg-deep-black py-4 overflow-hidden border-y border-dark-gray">
      <div className="flex animate-marquee" style={{ width: "max-content" }}>
        <div className="flex items-center gap-8 pr-8">
          {content}
        </div>
        <div className="flex items-center gap-8 pr-8">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
