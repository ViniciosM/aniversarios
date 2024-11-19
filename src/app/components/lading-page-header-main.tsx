import Link from "next/link";
import Image from "next/image";
export default function LandingPageHeaderMain() {
  return (
    <>
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/placeholder.svg" alt="Logo" width={32} height={32} />
        <span className="font-bold">AcmeCorp</span>
      </Link>
      <nav className="hidden md:flex gap-6">
        <Link
          href="#features"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Features
        </Link>
        <Link
          href="#pricing"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Pricing
        </Link>
        <Link
          href="#contact"
          className="text-sm font-medium hover:underline underline-offset-4"
        >
          Contact
        </Link>
      </nav>
    </>
  );
}
