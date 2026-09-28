import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="w-full aspect-[3/4] bg-[#EAE8E2]" />
      <div className="pt-3.5 space-y-2">
        <div className="h-2.5 bg-[#EAE8E2] w-1/3" />
        <div className="h-4 bg-[#EAE8E2] w-3/4" />
        <div className="h-3.5 bg-[#EAE8E2] w-1/4" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
