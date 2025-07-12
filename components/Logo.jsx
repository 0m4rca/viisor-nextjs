import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className=" top-4 left-4 z-[20]">
      {/* Small logo - visible on small screens, hidden on md and up */}
      <Image
        src="/viisor-small.png"
        alt="Logo small"
        className="block top-4 left-6 w-16 h-16 md:hidden"
      />
      {/* Big logo - hidden on small screens, visible md and up */}
      <Image
        src="/viisor-big.png"
        alt="Logo big"
        width={150}
        height={60}
        className="hidden md:block"
      />
    </Link>
  );
}
