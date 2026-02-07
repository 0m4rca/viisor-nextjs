export default function HeadingSecondary({ children }) {
  return (
    <h2
      className="
    heading-secondary
    bg-gradient-to-r-primary
    text-xl
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
    md:text-4xl
    py-8
      "
    >
      {children}
    </h2>
  );
}
