import Link from "next/link";

export default function MobileMenu({ open, setOpen }) {
  return (
    <nav
      className={`fixed top-0 left-0 h-screen w-full z-[1500] flex flex-col justify-center items-center transition-all duration-[800ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${
        open ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <ul className="flex flex-col items-center space-y-8 text-white text-2xl font-light uppercase ">
        {["Home", "Tours", "Booking", "Contact"].map((label) => (
          <li key={label}>
            <Link
              href={`/${label === "Home" ? "" : label.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="group relative px-8 py-4 overflow-hidden transition-all duration-500 ease-in-out"
            >
              <span
                className="absolute inset-0 bg-[length:225%_100%] bg-left group-hover:bg-right transition-all duration-500"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, transparent 0%, transparent 50%, white 50%)",
                }}
              />
              <span className="relative z-10 group-hover:text-primary transition-transform duration-500 ease-in-out group-hover:translate-x-4">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
