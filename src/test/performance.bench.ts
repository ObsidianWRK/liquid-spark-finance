import { bench, describe } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import React from 'react';

// Import components for performance testing
import { SharedScoreCircle } from '../components/shared/SharedScoreCircle';
import { GlassCard } from '../components/GlassCard';
import { LiquidGlassTopMenuBar } from '../components/LiquidGlassTopMenuBar';
import { TransactionWithScores } from '../components/TransactionWithScores';

// Import liquid glass hooks
import { useLiquidGlass } from '../hooks/useLiquidGlass';
import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization';

// Import utilities for performance testing
import {
  calculateCompoundInterest,
  calculateLoanPayment,
  calculateROI,
  calculateFinancialFreedomYears,
} from '../utils/calculators';

// Mock data for performance tests
const mockTransaction = {
  id: '1',
  merchant: 'Test Merchant',
  amount: 25.50,
  date: '2024-01-01',
  category: 'Food & Dining',
  healthScore: 85,
  ecoScore: 72,
  financialScore: 90,
};

const largeTransactionSet = Array.from({ length: 1000 }, (_, i) => ({
  id: `txn-${i}`,
  merchant: `Merchant ${i}`,
  amount: Math.random() * 1000,
  date: new Date(2024, 0, i % 30 + 1).toISOString().split('T')[0],
  category: ['Food & Dining', 'Gas & Transport', 'Shopping', 'Bills & Utilities'][i % 4],
  healthScore: Math.floor(Math.random() * 100),
  ecoScore: Math.floor(Math.random() * 100),
  financialScore: Math.floor(Math.random() * 100),
}));

describe('Performance Benchmarks - WebGL and Liquid Glass Effects', () => {
  
  describe('Component Rendering Performance', () => {
    bench('SharedScoreCircle - Single render', () => {
      const { unmount } = render(React.createElement(SharedScoreCircle, { score: 85, type: 'health' }));
      unmount();
    });

    bench('SharedScoreCircle - Multiple renders (100x)', () => {
      for (let i = 0; i < 100; i++) {
        const { unmount } = render(React.createElement(SharedScoreCircle, { 
          score: Math.floor(Math.random() * 100), 
          type: ['health', 'eco', 'financial'][i % 3] as any 
        }));
        unmount();
      }
    });

    bench('GlassCard - Single render with backdrop blur', () => {
      const { unmount } = render(React.createElement(GlassCard, {}, 'Test Content'));
      unmount();
    });

    bench('GlassCard - Multiple nested glass cards', () => {
      const { unmount } = render(
        React.createElement(GlassCard, {},
          React.createElement(GlassCard, {},
            React.createElement(GlassCard, {}, 'Nested Content')
          )
        )
      );
      unmount();
    });

    bench('LiquidGlassTopMenuBar - Full navigation render', () => {
      const { unmount } = render(React.createElement(LiquidGlassTopMenuBar));
      unmount();
    });

    bench('TransactionWithScores - Single transaction render', () => {
      const { unmount } = render(React.createElement(TransactionWithScores, { transaction: mockTransaction }));
      unmount();
    });

    bench('TransactionWithScores - Large transaction list (1000 items)', () => {
      const { unmount } = render(
        React.createElement('div', {},
          ...largeTransactionSet.slice(0, 100).map((txn, i) =>
            React.createElement(TransactionWithScores, { key: i, transaction: txn })
          )
        )
      );
      unmount();
    });
  });

  describe('CSS Animation Performance', () => {
    bench('Liquid glass backdrop-blur rendering', () => {
      const element = document.createElement('div');
      element.className = 'backdrop-blur-md bg-white/10 border border-white/20 rounded-xl';
      element.style.transform = 'translateZ(0)'; // Force GPU acceleration
      document.body.appendChild(element);
      
      // Simulate animation frames
      for (let i = 0; i < 60; i++) {
        element.style.opacity = (Math.sin(i * 0.1) + 1) / 2 + '';
      }
      
      document.body.removeChild(element);
    });

    bench('Multiple glass elements with animations', () => {
      const elements = [];
      
      // Create 20 glass elements
      for (let i = 0; i < 20; i++) {
        const element = document.createElement('div');
        element.className = 'backdrop-blur-lg bg-gradient-to-br from-white/20 to-white/5 border border-white/30 rounded-2xl';
        element.style.position = 'absolute';
        element.style.width = '100px';
        element.style.height = '100px';
        element.style.left = (i * 50) + 'px';
        element.style.transform = 'translateZ(0)';
        document.body.appendChild(element);
        elements.push(element);
      }
      
      // Animate all elements
      for (let frame = 0; frame < 60; frame++) {
        elements.forEach((element, i) => {
          const offset = frame + i * 0.2;
          element.style.transform = `translateZ(0) translateY(${Math.sin(offset * 0.1) * 10}px)`;
          element.style.opacity = (Math.sin(offset * 0.05) + 1) / 2 + '';
        });
      }
      
      // Cleanup
      elements.forEach(element => document.body.removeChild(element));
    });

    bench('Gradient background transitions', () => {
      const element = document.createElement('div');
      element.className = 'bg-gradient-to-br';
      element.style.width = '200px';
      element.style.height = '200px';
      document.body.appendChild(element);
      
      const gradients = [
        'from-blue-400/20 to-purple-600/20',
        'from-green-400/20 to-blue-500/20',
        'from-purple-400/20 to-pink-600/20',
        'from-yellow-400/20 to-red-500/20',
      ];
      
      for (let i = 0; i < 100; i++) {
        element.className = `bg-gradient-to-br ${gradients[i % gradients.length]}`;
      }
      
      document.body.removeChild(element);
    });
  });

  describe('WebGL Performance Simulation', () => {
    bench('WebGL context creation and basic operations', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        // Simulate basic WebGL operations for liquid glass effects
        gl.clearColor(0.0, 0.0, 0.0, 0.1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        // Create and use a basic shader program
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        
        if (vertexShader && fragmentShader) {
          gl.shaderSource(vertexShader, `
            attribute vec2 position;
            void main() {
              gl_Position = vec4(position, 0.0, 1.0);
            }
          `);
          gl.compileShader(vertexShader);
          
          gl.shaderSource(fragmentShader, `
            precision mediump float;
            uniform float time;
            void main() {
              gl_FragColor = vec4(0.5 + 0.5 * sin(time), 0.0, 0.5, 0.8);
            }
          `);
          gl.compileShader(fragmentShader);
          
          const program = gl.createProgram();
          if (program) {
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            gl.useProgram(program);
            
            // Simulate animation loop
            for (let i = 0; i < 60; i++) {
              const timeUniform = gl.getUniformLocation(program, 'time');
              gl.uniform1f(timeUniform, i * 0.016);
              gl.drawArrays(gl.TRIANGLES, 0, 3);
            }
          }
        }
      }
    });

    bench('Canvas-based liquid effect simulation', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Simulate liquid wave effect
        for (let frame = 0; frame < 60; frame++) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Create gradient for liquid effect
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, `rgba(99, 102, 241, ${0.1 + 0.1 * Math.sin(frame * 0.1)})`);
          gradient.addColorStop(0.5, `rgba(139, 92, 246, ${0.05 + 0.05 * Math.cos(frame * 0.08)})`);
          gradient.addColorStop(1, `rgba(59, 130, 246, ${0.08 + 0.08 * Math.sin(frame * 0.12)})`);
          
          ctx.fillStyle = gradient;
          
          // Draw wave-like shapes
          ctx.beginPath();
          for (let x = 0; x <= canvas.width; x += 10) {
            const y = canvas.height / 2 + 50 * Math.sin((x + frame * 5) * 0.02);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.lineTo(canvas.width, canvas.height);
          ctx.lineTo(0, canvas.height);
          ctx.closePath();
          ctx.fill();
        }
      }
    });
  });

  describe('Mathematical Calculations Performance', () => {
    bench('Financial calculator - Compound Interest (1000 calculations)', () => {
      for (let i = 0; i < 1000; i++) {
        calculateCompoundInterest(10000 + i, 5 + (i % 10), 10, 12);
      }
    });

    bench('Financial calculator - Loan Payment (1000 calculations)', () => {
      for (let i = 0; i < 1000; i++) {
        calculateLoanPayment(200000 + i * 100, 4.5 + (i % 5), 30);
      }
    });

    bench('Financial calculator - ROI (10000 calculations)', () => {
      for (let i = 0; i < 10000; i++) {
        calculateROI(1000 + i, 1200 + i * 0.2);
      }
    });

    bench('Financial calculator - Financial Freedom (100 calculations)', () => {
      for (let i = 0; i < 100; i++) {
        calculateFinancialFreedomYears(500000 + i * 1000, 4000 + i * 10, 0.04 + i * 0.001);
      }
    });

    bench('Complex financial scenario calculations', () => {
      for (let i = 0; i < 100; i++) {
        // Simulate a complete financial analysis
        const principal = 300000 + i * 1000;
        const rate = 4.5 + (i % 10) * 0.1;
        const years = 15 + (i % 20);
        
        const monthlyPayment = calculateLoanPayment(principal, rate, years);
        const futureValue = calculateCompoundInterest(50000, 7, years, 12);
        const roi = calculateROI(principal, futureValue);
        const freedomYears = calculateFinancialFreedomYears(futureValue, monthlyPayment * 12, 0.04);
        
        // Combine results to ensure calculations are not optimized away
        const result = monthlyPayment + futureValue + roi + freedomYears;
      }
    });
  });

  describe('Data Processing Performance', () => {
    bench('Transaction scoring - Single transaction', () => {
      const transaction = mockTransaction;
      
      // Simulate scoring calculation
      const healthScore = Math.max(0, Math.min(100, 
        100 - (transaction.amount / 100) * 10 + 
        (transaction.category === 'Health & Fitness' ? 20 : 0)
      ));
      
      const ecoScore = Math.max(0, Math.min(100,
        100 - (transaction.amount / 50) * 5 +
        (transaction.category === 'Public Transportation' ? 30 : 0)
      ));
      
      const financialScore = Math.max(0, Math.min(100,
        90 - (transaction.amount / 500) * 10
      ));
    });

    bench('Transaction scoring - Large dataset (1000 transactions)', () => {
      largeTransactionSet.forEach(transaction => {
        const healthScore = Math.max(0, Math.min(100, 
          100 - (transaction.amount / 100) * 10 + 
          (transaction.category === 'Health & Fitness' ? 20 : 0)
        ));
        
        const ecoScore = Math.max(0, Math.min(100,
          100 - (transaction.amount / 50) * 5 +
          (transaction.category === 'Public Transportation' ? 30 : 0)
        ));
        
        const financialScore = Math.max(0, Math.min(100,
          90 - (transaction.amount / 500) * 10
        ));
      });
    });

    bench('Complex data aggregation and analysis', () => {
      const transactions = largeTransactionSet;
      
      // Group by category
      const byCategory = transactions.reduce((acc, txn) => {
        if (!acc[txn.category]) acc[txn.category] = [];
        acc[txn.category].push(txn);
        return acc;
      }, {} as Record<string, typeof transactions>);
      
      // Calculate category totals and averages
      const categoryStats = Object.entries(byCategory).map(([category, txns]) => ({
        category,
        total: txns.reduce((sum, txn) => sum + txn.amount, 0),
        average: txns.reduce((sum, txn) => sum + txn.amount, 0) / txns.length,
        count: txns.length,
        averageHealthScore: txns.reduce((sum, txn) => sum + txn.healthScore, 0) / txns.length,
        averageEcoScore: txns.reduce((sum, txn) => sum + txn.ecoScore, 0) / txns.length,
        averageFinancialScore: txns.reduce((sum, txn) => sum + txn.financialScore, 0) / txns.length,
      }));
      
      // Sort by total spending
      categoryStats.sort((a, b) => b.total - a.total);
    });
  });

  describe('Memory and DOM Performance', () => {
    bench('DOM manipulation - Creating glass elements', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      
      for (let i = 0; i < 100; i++) {
        const element = document.createElement('div');
        element.className = 'backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4';
        element.textContent = `Item ${i}`;
        container.appendChild(element);
      }
      
      document.body.removeChild(container);
    });

    bench('DOM manipulation - Updating glass element styles', () => {
      const elements = [];
      const container = document.createElement('div');
      document.body.appendChild(container);
      
      // Create elements
      for (let i = 0; i < 50; i++) {
        const element = document.createElement('div');
        element.className = 'backdrop-blur-md bg-white/10';
        container.appendChild(element);
        elements.push(element);
      }
      
      // Update styles rapidly
      for (let frame = 0; frame < 100; frame++) {
        elements.forEach((element, i) => {
          const opacity = (Math.sin(frame * 0.1 + i * 0.2) + 1) / 2;
          element.style.opacity = opacity.toString();
          element.style.transform = `scale(${0.9 + opacity * 0.1})`;
        });
      }
      
      document.body.removeChild(container);
    });

    bench('Memory allocation - Large object creation', () => {
      const objects = [];
      
      for (let i = 0; i < 10000; i++) {
        objects.push({
          id: i,
          data: new Array(100).fill(i),
          timestamp: Date.now(),
          metadata: {
            type: 'performance-test',
            iteration: i,
            random: Math.random(),
          }
        });
      }
      
      // Access all objects to prevent optimization
      let sum = 0;
      objects.forEach(obj => {
        sum += obj.data.reduce((a, b) => a + b, 0);
      });
    });
  });
});

describe('Performance Optimization Benchmarks', () => {
  
  bench('Memoization performance - React.memo equivalent', () => {
    const memoizedResults = new Map();
    
    for (let i = 0; i < 1000; i++) {
      const key = `${i % 10}-${Math.floor(i / 10) % 5}`;
      
      if (!memoizedResults.has(key)) {
        // Expensive calculation
        const result = calculateCompoundInterest(10000, 5, 10, 12);
        memoizedResults.set(key, result);
      }
      
      const cached = memoizedResults.get(key);
    }
  });

  bench('Virtual scrolling simulation', () => {
    const itemHeight = 60;
    const containerHeight = 400;
    const totalItems = 10000;
    const scrollPosition = 5000; // Simulate scroll position
    
    const startIndex = Math.floor(scrollPosition / itemHeight);
    const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight) + 1, totalItems);
    const visibleItems = [];
    
    for (let i = startIndex; i < endIndex; i++) {
      visibleItems.push({
        index: i,
        top: i * itemHeight,
        data: largeTransactionSet[i % largeTransactionSet.length]
      });
    }
  });

  bench('Debounced calculations', () => {
    let lastCalculation = 0;
    const debounceMs = 16; // ~60fps
    
    for (let i = 0; i < 1000; i++) {
      const now = i; // Simulate timestamp
      
      if (now - lastCalculation >= debounceMs) {
        calculateCompoundInterest(10000 + i, 5, 10, 12);
        lastCalculation = now;
      }
    }
  });
});