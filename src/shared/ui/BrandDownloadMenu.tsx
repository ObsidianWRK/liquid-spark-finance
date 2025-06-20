/**
 * Brand Download Context Menu
 *
 * Specific context menu for Vueni logo with download options for brand assets.
 * Includes icons for each download type and proper file handling.
 */

import React from 'react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
} from './ContextMenu';
import { useDownload } from '@/shared/hooks/useDownload';

// Download icons
const DownloadIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const FileIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
  </svg>
);

const ImageIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21,15 16,10 5,21" />
  </svg>
);

const BookIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const CodeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="16,18 22,12 16,6" />
    <polyline points="8,6 2,12 8,18" />
  </svg>
);

interface BrandDownloadMenuProps {
  children: React.ReactNode;
  onDownloadComplete?: (filename: string) => void;
}

export const BrandDownloadMenu: React.FC<BrandDownloadMenuProps> = ({
  children,
  onDownloadComplete,
}) => {
  const { downloadFile, isDownloading } = useDownload();

  const handleDownload = async (filename: string, url: string) => {
    try {
      await downloadFile(url, filename);
      onDownloadComplete?.(filename);
    } catch (error) {
      console.error(`Failed to download ${filename}:`, error);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuLabel>Brand Assets</ContextMenuLabel>

        <ContextMenuItem
          onClick={() =>
            handleDownload('vueni-logo.svg', '/branding/vueni-logo.svg')
          }
          disabled={isDownloading}
          icon={<ImageIcon />}
        >
          Download SVG Logo
          <span className="text-xs text-white/40 ml-auto">4KB</span>
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() =>
            handleDownload(
              'brand-guidelines.pdf',
              '/branding/brand-guidelines.pdf'
            )
          }
          disabled={isDownloading}
          icon={<BookIcon />}
        >
          Brand Guidelines
          <span className="text-xs text-white/40 ml-auto">PDF</span>
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => handleDownload('LLM.txt', '/branding/LLM.txt')}
          disabled={isDownloading}
          icon={<CodeIcon />}
        >
          LLM Instructions
          <span className="text-xs text-white/40 ml-auto">TXT</span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={() => window.open('https://vueni.com/brand', '_blank')}
          icon={<FileIcon />}
        >
          Brand Portal
          <span className="text-xs text-white/40 ml-auto">↗</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default BrandDownloadMenu;
