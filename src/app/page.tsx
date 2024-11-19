import LadingPageMain from "./components/lading-page-main";
import LadingPageHeader from "./components/lading-page-header";
import { LandingPageFooter } from "./components/lading-page-footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LadingPageHeader></LadingPageHeader>
      <LadingPageMain></LadingPageMain>
      <LandingPageFooter></LandingPageFooter>
    </div>
  );
}
