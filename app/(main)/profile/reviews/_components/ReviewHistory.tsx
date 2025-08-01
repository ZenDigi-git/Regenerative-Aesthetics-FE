'use client';

import { useReviews } from '@/lib/hooks/reviews/use-reviews';
import ReviewHistoryItem from './ReviewHistoryItem';
import ReviewHistorySkeleton from './ReviewHistorySkeleton';
import PaginationUI from '@/app/components/PaginationUI';
import { useState } from 'react';

const ReviewsHistory = () => {
  const { data: reviews, isLoading, isFetched } = useReviews();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderData = () => {
    if (isLoading || !isFetched) return <ReviewHistorySkeleton />;

    if (isFetched && !reviews?.length)
      return <p className='text-gray-600 text-center'>No reviews found.</p>;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentReviews = reviews!.slice(startIndex, endIndex);

    return currentReviews.map(review => (
      <div key={review.id} className='even:bg-gray-100 p-5 '>
        <ReviewHistoryItem review={review} />
      </div>
    ));
  };

  const totalItems = reviews?.length || ITEMS_PER_PAGE;

  return (
    <div>
      <div className='space-y-5 border-1 border-gray-200 rounded-md mb-10'>
        {renderData()}
      </div>
      {totalItems > ITEMS_PER_PAGE && (
        <PaginationUI
          limit={totalItems}
          pageSize={ITEMS_PER_PAGE}
          initialPage={currentPage}
          onClick={handlePageChange}
        />
      )}
    </div>
  );
};

export default ReviewsHistory;
