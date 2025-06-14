
import React from 'react';
import ScoreCircle from './ScoreCircle';
import { TransactionScores } from '@/utils/transactionScoring';

interface ScoreCirclesProps {
  scores: TransactionScores;
  isVisible: boolean;
}

const ScoreCircles = ({ scores, isVisible }: ScoreCirclesProps) => {
  return (
    <div className={`flex gap-2 transition-all duration-300 ease-out ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
    }`}>
      <ScoreCircle 
        score={scores.health} 
        label="Health"
        isVisible={isVisible}
        delay={0}
        type="health"
      />
      <ScoreCircle 
        score={scores.eco} 
        label="Eco"
        isVisible={isVisible}
        delay={50}
        type="eco"
      />
      <ScoreCircle 
        score={scores.financial} 
        label="Financial"
        isVisible={isVisible}
        delay={100}
        type="financial"
      />
    </div>
  );
};

export default ScoreCircles;
