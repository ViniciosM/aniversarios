import { SignIn } from "@/components/auth-components";
import Link from "next/link";
export default function LandingPageMenu({
  onClickAnyLink,
}: {
  onClickAnyLink: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 bg-background md:hidden">
      <nav className="flex flex-col items-center justify-center h-full space-y-8">
        <Link
          href="#features"
          className="text-2xl font-medium"
          onClick={onClickAnyLink}
        >
          Features
        </Link>
        <Link
          href="#pricing"
          className="text-2xl font-medium"
          onClick={onClickAnyLink}
        >
          Pricing
        </Link>
        <Link
          href="#contact"
          className="text-2xl font-medium"
          onClick={onClickAnyLink}
        >
          Contact
        </Link>
        <SignIn></SignIn>
      </nav>
    </div>
  );
}
