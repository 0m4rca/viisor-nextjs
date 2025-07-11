import Logo from "./Logo";
import HamburgerBtn from "./HamburgerBtn";

export default function Navigation() {
  return (
    <>
      <div className="absolute top-0 left-0 w-full z-20 bg-white/5 backdrop-blur-sm flex items-center justify-between px-4 py-4">
        <Logo />
      </div>
      <HamburgerBtn />
    </>
  );
}
