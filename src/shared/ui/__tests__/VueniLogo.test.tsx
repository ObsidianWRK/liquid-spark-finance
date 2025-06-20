/**
 * VueniLogo Component Unit Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { VueniLogo, VueniTextLogo } from '../VueniLogo';

// Mock the BrandDownloadMenu component
vi.mock('../BrandDownloadMenu', () => ({
  BrandDownloadMenu: ({ children, onDownloadComplete }: any) => (
    <div data-testid="brand-download-menu">
      {children}
      <button onClick={() => onDownloadComplete?.('test.svg')}>
        Mock Download
      </button>
    </div>
  ),
}));

describe('VueniLogo', () => {
  describe('Basic Rendering', () => {
    test('renders with default props', () => {
      render(<VueniLogo />);
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByLabelText(/vueni logo/i)).toBeInTheDocument();
    });

    test('renders with text-only variant', () => {
      render(<VueniLogo variant="text-only" />);
      const logo = screen.getByRole('button');
      expect(logo).toBeInTheDocument();
    });

    test('renders with icon-only variant', () => {
      render(<VueniLogo variant="icon-only" />);
      const logo = screen.getByRole('button');
      expect(logo).toBeInTheDocument();
    });

    test('renders with full variant', () => {
      render(<VueniLogo variant="full" />);
      const logo = screen.getByRole('button');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    test.each(['sm', 'md', 'lg', 'xl'] as const)(
      'renders with %s size',
      (size) => {
        render(<VueniLogo size={size} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
      }
    );
  });

  describe('Click Handling', () => {
    test('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<VueniLogo onClick={handleClick} />);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('calls onClick on Enter key press', () => {
      const handleClick = vi.fn();
      render(<VueniLogo onClick={handleClick} />);

      const logo = screen.getByRole('button');
      fireEvent.keyDown(logo, { key: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('calls onClick on Space key press', () => {
      const handleClick = vi.fn();
      render(<VueniLogo onClick={handleClick} />);

      const logo = screen.getByRole('button');
      fireEvent.keyDown(logo, { key: ' ' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Context Menu Integration', () => {
    test('renders with context menu by default', () => {
      render(<VueniLogo />);
      expect(screen.getByTestId('brand-download-menu')).toBeInTheDocument();
    });

    test('renders without context menu when disabled', () => {
      render(<VueniLogo showContextMenu={false} />);
      expect(
        screen.queryByTestId('brand-download-menu')
      ).not.toBeInTheDocument();
    });

    test('calls onDownloadComplete callback', () => {
      const handleDownloadComplete = vi.fn();
      render(<VueniLogo onDownloadComplete={handleDownloadComplete} />);

      fireEvent.click(screen.getByText('Mock Download'));
      expect(handleDownloadComplete).toHaveBeenCalledWith('test.svg');
    });
  });

  describe('Accessibility', () => {
    test('has proper aria-label', () => {
      render(<VueniLogo />);
      expect(
        screen.getByLabelText(/vueni logo.*right-click.*download/i)
      ).toBeInTheDocument();
    });

    test('has proper role', () => {
      render(<VueniLogo />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('is keyboard focusable', () => {
      render(<VueniLogo />);
      const logo = screen.getByRole('button');
      expect(logo).toHaveAttribute('tabIndex', '0');
    });

    test('prevents default on Enter/Space key events', () => {
      const preventDefault = vi.fn();
      render(<VueniLogo onClick={vi.fn()} />);

      const logo = screen.getByRole('button');
      fireEvent.keyDown(logo, { key: 'Enter', preventDefault });
      expect(preventDefault).toHaveBeenCalled();
    });
  });

  describe('Custom Styling', () => {
    test('applies custom className', () => {
      render(<VueniLogo className="custom-class" />);
      const logo = screen.getByRole('button');
      expect(logo).toHaveClass('custom-class');
    });

    test('applies size-based classes', () => {
      render(<VueniLogo size="xl" />);
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toHaveClass('h-12');
    });
  });
});

describe('VueniTextLogo', () => {
  test('renders text logo', () => {
    render(<VueniTextLogo />);
    expect(screen.getByText('Vueni')).toBeInTheDocument();
  });

  test('applies gradient text styling', () => {
    render(<VueniTextLogo />);
    const textElement = screen.getByText('Vueni');
    expect(textElement).toHaveClass(
      'bg-gradient-to-r',
      'from-blue-400',
      'to-purple-400',
      'bg-clip-text'
    );
  });

  test('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<VueniTextLogo onClick={handleClick} />);

    fireEvent.click(screen.getByText('Vueni'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies custom className', () => {
    render(<VueniTextLogo className="custom-text-class" />);
    expect(screen.getByText('Vueni')).toHaveClass('custom-text-class');
  });
});
