"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/app/components/ui/pagination";

import { useRouter, useSearchParams } from "next/navigation";

type PaginationSmartProps = {
  basePath: string;
  totalPages: number;
  pageParam?: string;
  siblingCount?: number;
};

export function PaginationSmart({
  basePath,
  totalPages,
  pageParam = "page",
  siblingCount = 1,
}: PaginationSmartProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Math.max(1, Number(searchParams.get(pageParam)) || 1);

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(pageParam, page.toString());
    router.push(`${basePath}?${params.toString()}`);
  };

  const getPages = () => {
    const pages: (number | "ellipsis")[] = [];

    const left = Math.max(2, currentPage - siblingCount);
    const right = Math.min(totalPages - 1, currentPage + siblingCount);

    pages.push(1);

    if (left > 2) pages.push("ellipsis");

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) pages.push("ellipsis");

    pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) goToPage(currentPage - 1);
            }}
          />
        </PaginationItem>

        {/* Pages */}
        {pages.map((item, index) => (
          <PaginationItem key={index}>
            {item === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={item === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  goToPage(item);
                }}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) goToPage(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
