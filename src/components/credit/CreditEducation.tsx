import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface EducationTopic {
  id: string;
  title: string;
  description: string;
  content: string;
  icon: string;
}

const CreditEducation = () => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const educationTopics: EducationTopic[] = [
    {
      id: 'what-is-credit-score',
      title: 'What is a Credit Score?',
      description: 'Understanding the basics of credit scores and how they work',
      icon: '📊',
      content: 'A credit score is a three-digit number between 300-850 that represents your creditworthiness. It\'s calculated based on your credit history and helps lenders determine the risk of lending you money. Higher scores indicate lower risk and can lead to better loan terms and interest rates.'
    },
    {
      id: 'factors-affecting-score',
      title: 'Factors Affecting Your Score',
      description: 'Learn what impacts your credit score the most',
      icon: '⚖️',
      content: 'Five main factors affect your credit score: Payment History (35%), Credit Utilization (30%), Length of Credit History (15%), Credit Mix (10%), and New Credit Inquiries (10%). Payment history has the biggest impact, so always pay your bills on time.'
    },
    {
      id: 'improving-credit',
      title: 'How to Improve Your Credit',
      description: 'Actionable steps to boost your credit score',
      icon: '📈',
      content: 'To improve your credit score: 1) Pay all bills on time, 2) Keep credit utilization below 30%, 3) Don\'t close old credit accounts, 4) Only apply for credit when necessary, 5) Monitor your credit report regularly, and 6) Consider becoming an authorized user on someone else\'s account.'
    },
    {
      id: 'credit-utilization',
      title: 'Understanding Credit Utilization',
      description: 'How much of your available credit you should use',
      icon: '💳',
      content: 'Credit utilization is the percentage of available credit you\'re using. Keep it below 30% across all cards, and ideally below 10% for the best scores. For example, if you have a $1,000 credit limit, try to keep your balance below $100-300.'
    },
    {
      id: 'credit-report-vs-score',
      title: 'Credit Report vs Credit Score',
      description: 'Understanding the difference between reports and scores',
      icon: '📋',
      content: 'Your credit report is a detailed record of your credit history, including accounts, payment history, and inquiries. Your credit score is a number calculated from the information in your credit report. You can get free credit reports annually from annualcreditreport.com.'
    },
    {
      id: 'different-score-types',
      title: 'Different Types of Credit Scores',
      description: 'FICO vs VantageScore and industry-specific scores',
      icon: '🔢',
      content: 'There are different credit scoring models: FICO (most widely used by lenders), VantageScore, and industry-specific scores for auto loans or mortgages. Each may give you a slightly different score, but they all use similar factors to evaluate your creditworthiness.'
    }
  ];

  const toggleTopic = (topicId: string) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BookOpen className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Credit Education</h3>
      </div>
      
      <div className="space-y-4">
        {educationTopics.map((topic) => (
          <div key={topic.id} className="liquid-glass-card overflow-hidden">
            <button
              onClick={() => toggleTopic(topic.id)}
              className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-400/50 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">{topic.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">{topic.title}</h4>
                    <p className="text-slate-400 text-sm">{topic.description}</p>
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-4">
                  {expandedTopic === topic.id ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>
            </button>
            
            {expandedTopic === topic.id && (
              <div className="px-6 pb-6">
                <div className="pt-4 border-t border-white/10">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {topic.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="liquid-glass-card p-6">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-white font-semibold mb-2">Need More Help?</h4>
            <p className="text-slate-400 text-sm mb-4">
              Credit building takes time and consistency. If you have specific questions about your credit situation, consider speaking with a financial advisor or credit counselor.
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-600 transition-all">
              Find a Credit Counselor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditEducation; 