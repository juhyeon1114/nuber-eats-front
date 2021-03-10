import React from "react";

interface IPagination {
  page: number;
  totalPages: number | null;
  onPrevPageClick: Function;
  onNextPageClick: Function;
}

export const Pagination = ({
  page,
  onPrevPageClick,
  totalPages,
  onNextPageClick,
}: IPagination) => {
  return (
    <div className="grid grid-cols-3 text-center max-w-md items-centerd mx-auto mt-10">
      {page > 1 ? (
        <button
          onClick={() => onPrevPageClick()}
          className="focus:outline-none font-medium text-2xl"
        >
          &larr;
        </button>
      ) : (
        <div></div>
      )}
      <span className="mx-5">
        Page {page} of {totalPages}
      </span>
      {page !== totalPages ? (
        <button
          onClick={() => onNextPageClick()}
          className="focus:outline-none font-medium text-2xl"
        >
          &rarr;
        </button>
      ) : (
        <div></div>
      )}
    </div>
  );
};
