import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ReviewService } from '../services/ReviewService';
import ProgressBar from '../components/review/ProgressBar';
import ReviewCardWidget from '../components/review/ReviewCardWidget';
import SessionComplete from '../components/review/SessionComplete';

export default function ReviewPage() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const initialData = location.state?.initialReviewData;

  const [activeReviewCard, setActiveReviewCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({
    percentage: 0,
    total: initialData?.totalCards || 0,
    archived: 0,
    isFinished: initialData?.isFinished || false
  });

  // Extract the first card on mount
  useEffect(() => {
    if (initialData && initialData.reviewCards && initialData.reviewCards.length > 0) {
      const firstActive = initialData.reviewCards.find(rc => rc.state === 'ACTIVE') || initialData.reviewCards[0];
      setActiveReviewCard(firstActive);

      const archivedCount = initialData.reviewCards.filter(rc => rc.state === 'ARCHIVED').length;
      const pct = initialData.totalCards > 0 ? (archivedCount / initialData.totalCards) * 100 : 0;
      
      setProgress({
        percentage: pct,
        total: initialData.totalCards,
        archived: archivedCount,
        isFinished: archivedCount >= initialData.totalCards
      });
    }
  }, [initialData]);

  // Handle choice submissions safely
  const handleChoiceSubmit = async (choice) => {
    if (!activeReviewCard) return;
    try {
      setLoading(true);
      const progressOutput = await ReviewService.submitChoice(reviewId, activeReviewCard.id, choice);
      
      // 🛡️ CRITICAL FIX: If the session is finished, update progress and STOP trying to read nextCard!
      if (progressOutput.isFinished) {
        setProgress({
          percentage: 100, // Force 100% bar visualization
          total: progressOutput.totalCards,
          archived: progressOutput.cardsArchivedCount,
          isFinished: true
        });
        setActiveReviewCard(null); // Clean out the widget safely
        return; 
      }

      // If NOT finished, update state normally for the next card loop iteration
      setProgress({
        percentage: progressOutput.progressPercentage,
        total: progressOutput.totalCards,
        archived: progressOutput.cardsArchivedCount,
        isFinished: false
      });
      setActiveReviewCard(progressOutput.nextCard); 
      setIsFlipped(false);
    } catch (err) {
      console.error("Spaced repetition loop submit failure:", err);
      alert("Error saving review progress.");
    } finally {
      setLoading(false);
    }
  };

  // Triggers your custom Splash Screen component when the state becomes true
  if (progress.isFinished) {
    return <SessionComplete onReturnHome={() => navigate('/')} />;
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 mt-10">
      <ProgressBar 
        archived={progress.archived} 
        total={progress.total} 
        percentage={progress.percentage} 
      />
      
      <ReviewCardWidget 
        activeReviewCard={activeReviewCard}
        isFlipped={isFlipped}
        onFlip={(value) => setIsFlipped(value)}
        onChoice={handleChoiceSubmit}
        loading={loading}
      />
    </div>
  );
}