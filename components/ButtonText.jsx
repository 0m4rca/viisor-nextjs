import Link from "next/link";

export default function ButtonText({ href = "#", children, className = "" }) {
  return (
    <Link
      href={href}
      className={`
        uppercase 
        no-underline 
        inline-block 
        rounded-full 
        px-8 py-4 
        transition-all duration-200 
        text-base 
        tap-transparent
        font-medium
        ${className}
        hover:-translate-y-[3px]
        active:translate-y-[1px]
        hover:shadow-[0_1rem_2rem_rgba(0,0,0,0.35)]
        active:shadow-[0_0.5rem_1rem_rgba(0,0,0,0.35)]
        `}
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {children}
    </Link>
  );
}
