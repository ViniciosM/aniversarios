"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function BirthdayCardSkeletonLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-4">
      <Skeleton className="w-full max-w-md mx-auto h-[212px] bg-gray-200 dark:bg-gray-700 " />
      <Skeleton className="w-full max-w-md mx-auto h-[212px] bg-gray-200 dark:bg-gray-700 " />
      <Skeleton className="w-full max-w-md mx-auto h-[212px] bg-gray-200 dark:bg-gray-700 " />
      <Skeleton className="w-full max-w-md mx-auto h-[212px] bg-gray-200 dark:bg-gray-700 " />
      <Skeleton className="w-full max-w-md mx-auto h-[212px] bg-gray-200 dark:bg-gray-700 " />
      <Skeleton className="w-full max-w-md mx-auto h-[212px] bg-gray-200 dark:bg-gray-700 " />
    </div>
  );
}
