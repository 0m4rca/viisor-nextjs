import Link from "next/link";

export default function ButtonText({ href = "#", children }) {
  return (
    <Link
      href={href}
      className={`
        hover:bg-opacity-90 
        text-lg 
        font-medium 
        px-6 
        py-3 
        rounded-full 
        bg-[var(--color-secondary)] text-black
        hover:bg-[var(--color-tertiary)] hover:text-white hover:text-xl
        `}
    >
      {children}
    </Link>
  );
}
