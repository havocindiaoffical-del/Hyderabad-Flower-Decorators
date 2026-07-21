import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-ivory">
      <div className="text-center">
        <p className="text-8xl font-serif text-gold/20">404</p>
        <h2 className="heading-section text-charcoal mt-4">Page Not Found</h2>
        <p className="text-warm-gray font-body mt-4 max-w-md mx-auto font-light">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-charcoal text-ivory px-8 py-4 rounded-full label-uppercase mt-8 hover:bg-graphite transition-colors text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
