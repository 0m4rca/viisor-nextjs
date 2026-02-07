import Logo from "../common/Logo";
import HamburgerBtn from "./HamburgerBtn";

export default function Navigation() {
  return (
    <>
      <div className="absolute top-0 left-0 w-full z-20  flex items-center justify-between px-1 py-4 ">
        <Logo />
      </div>
      <HamburgerBtn />
    </>
  );
}
