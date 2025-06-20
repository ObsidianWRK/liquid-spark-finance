/**
 * useDownload Hook
 *
 * Type-safe hook for downloading files with progress tracking and error handling.
 * Supports blob downloads and direct URL downloads with proper MIME type handling.
 */

import { useState, useCallback } from 'react';
import { saveAs } from 'file-saver';

interface DownloadState {
  isDownloading: boolean;
  progress: number;
  error: string | null;
}

interface UseDownloadReturn {
  downloadFile: (url: string, filename?: string) => Promise<void>;
  downloadBlob: (blob: Blob, filename: string) => void;
  isDownloading: boolean;
  progress: number;
  error: string | null;
  resetError: () => void;
}

export const useDownload = (): UseDownloadReturn => {
  const [state, setState] = useState<DownloadState>({
    isDownloading: false,
    progress: 0,
    error: null,
  });

  const resetError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const downloadBlob = useCallback((blob: Blob, filename: string) => {
    try {
      saveAs(blob, filename);
    } catch (error) {
      console.error('Failed to download blob:', error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Download failed',
      }));
    }
  }, []);

  const downloadFile = useCallback(
    async (url: string, filename?: string): Promise<void> => {
      setState((prev) => ({
        ...prev,
        isDownloading: true,
        progress: 0,
        error: null,
      }));

      try {
        // Fetch with progress tracking if possible
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();

        // Extract filename from URL if not provided
        const finalFilename = filename || extractFilenameFromUrl(url);

        // Set MIME type if not already set
        const mimeType = blob.type || getMimeTypeFromExtension(finalFilename);
        const finalBlob = blob.type
          ? blob
          : new Blob([blob], { type: mimeType });

        setState((prev) => ({ ...prev, progress: 100 }));

        // Small delay to show 100% progress
        setTimeout(() => {
          downloadBlob(finalBlob, finalFilename);
          setState((prev) => ({ ...prev, isDownloading: false, progress: 0 }));
        }, 300);
      } catch (error) {
        console.error('Download failed:', error);
        setState((prev) => ({
          ...prev,
          isDownloading: false,
          progress: 0,
          error: error instanceof Error ? error.message : 'Download failed',
        }));
        throw error;
      }
    },
    [downloadBlob]
  );

  return {
    downloadFile,
    downloadBlob,
    isDownloading: state.isDownloading,
    progress: state.progress,
    error: state.error,
    resetError,
  };
};

// Helper functions
function extractFilenameFromUrl(url: string): string {
  try {
    const pathname = new URL(url, window.location.origin).pathname;
    const filename = pathname.split('/').pop();
    return filename || 'download';
  } catch {
    return 'download';
  }
}

function getMimeTypeFromExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();

  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    svg: 'image/svg+xml',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    txt: 'text/plain',
    json: 'application/json',
    csv: 'text/csv',
    zip: 'application/zip',
  };

  return mimeTypes[ext || ''] || 'application/octet-stream';
}

export default useDownload;
