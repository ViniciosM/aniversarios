import UserButton from "@/components/user-button";
import LandingPageHeaderMain from "./lading-page-header-main";
export default function LadingPageHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <LandingPageHeaderMain></LandingPageHeaderMain>
        <UserButton></UserButton>
      </div>
    </header>
  );
}
