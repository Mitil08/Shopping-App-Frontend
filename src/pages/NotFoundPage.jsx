import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-28 text-center">
      <span className="text-[10px] uppercase tracking-[0.3em] text-[#C2A676] font-semibold">
        Error 404
      </span>
      <h1 className="font-serif text-4xl sm:text-6xl text-[#141414] font-normal uppercase mt-2 mb-4">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-[#787570] font-light max-w-sm mx-auto mb-8">
        The destination you are attempting to reach does not exist or has been relocated to another salon archive.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#2A2A2A] transition-colors shadow-lg"
      >
        <span>Return to Homepage</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
