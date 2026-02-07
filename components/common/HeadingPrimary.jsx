export default function HeadingPrimary({ main, sub }) {
  return (
    <div className="heading-primary py-6 text-white uppercase mb-0">
      <span
        className="
          block
          text-2xl
          md:text-4xl
          font-light
          tracking-[.16em]
          md:tracking-[.125em]
          leading-tight
          animate-moveInLeft
        "
        style={{ animationDuration: "1s", animationTimingFunction: "ease-out" }}
      >
        {main}
      </span>
      <span
        className="
          block
          text-l
          md:text-xl
          font-bold
          tracking-normal
          md:tracking-widest
          leading-tight
          animate-moveInRight
        "
        style={{ animationDuration: "1s", animationTimingFunction: "ease-out" }}
      >
        {sub}
      </span>
    </div>
  );
}
