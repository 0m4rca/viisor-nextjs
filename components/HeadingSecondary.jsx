export default function HeadingSecondary({ children }) {
  return (
    <h2
      className="
    heading-secondary
    bg-gradient-to-r-primary
    text-[3.5rem]
    uppercase
    font-bold
    block
    mx-auto
    text-center
    bg-clip-text
    text-transparent
    transition-transform
    duration-300
    ease-in-out
    md:text-[3.25rem]
    sm:text-[3rem]
      "
    >
      {children}
    </h2>
  );
}
