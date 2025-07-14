export default function HeadingPrimary({ main, sub }) {
  return (
    <div className="heading-primary text-white uppercase mb-0">
      <span
        className="
          block
          text-[3rem]
          font-light
          tracking-[0.15em]
          leading-tight
          animate-moveInLeft
          sm:text-[3.5rem]
          md:text-[4rem]
        "
        style={{ animationDuration: "1s", animationTimingFunction: "ease-out" }}
      >
        {main}
      </span>
      <span
        className="
          block
          text-[1.75rem]
          font-bold
          tracking-[0.1em]
          leading-tight
          animate-moveInRight
          sm:text-[2rem]
          md:text-[2.25rem]
        "
        style={{ animationDuration: "1s", animationTimingFunction: "ease-out" }}
      >
        {sub}
      </span>
    </div>
  );
}
