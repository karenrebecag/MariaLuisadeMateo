"use client";

export function BannerStrip() {
  return (
    <div className="banner-strip" aria-hidden="true">
      <video
        className="banner-strip__video"
        src="https://pub-62c41549a44642efbcd3f775bdb039b3.r2.dev/van-gogh-blue-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {/* Subtle vignette so the strip blends with the page */}
      <div className="banner-strip__vignette" />
    </div>
  );
}
