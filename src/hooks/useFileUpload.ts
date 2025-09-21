import { useState, useCallback, useRef } from 'react';

interface UseFileUploadOptions {
  onDrop: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
}

interface FileError {
  file: File;
  errors: Error[];
}

export function useFileUpload({
  onDrop,
  accept = {},
  maxFiles = 1,
  maxSize = Infinity,
}: UseFileUploadOptions) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileRejections, setFileRejections] = useState<FileError[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    const acceptedFiles: File[] = [];
    const newFileRejections: FileError[] = [];

    if (files.length > maxFiles && maxFiles > 0) {
        newFileRejections.push({
            file: files[0],
            errors: [new Error(`Exceeds maximum number of files. Max: ${maxFiles}`)]
        });
        setFileRejections(newFileRejections);
        return;
    }

    files.forEach(file => {
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const isTypeAccepted = Object.entries(accept).some(([mimeType, extensions]) => {
        if (file.type === mimeType) {
          return extensions.includes(fileExtension);
        }
        const [baseMime] = mimeType.split('/');
        const [fileBaseMime] = file.type.split('/');
        if (`${baseMime}/*` === mimeType && fileBaseMime === baseMime) {
            return true;
        }
        return false;
      });

      if (!isTypeAccepted) {
        newFileRejections.push({
          file,
          errors: [new Error(`File type not accepted.`)],
        });
      } else if (file.size > maxSize) {
        newFileRejections.push({
          file,
          errors: [new Error(`File is larger than ${maxSize / 1024 / 1024}MB.`)],
        });
      } else {
        acceptedFiles.push(file);
      }
    });

    if (newFileRejections.length > 0) {
      setFileRejections(newFileRejections);
    }

    if (acceptedFiles.length > 0) {
      onDrop(acceptedFiles);
    }
  }, [accept, maxFiles, maxSize, onDrop]);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragActive(false);
      setFileRejections([]);

      const files = Array.from(event.dataTransfer?.files || []);
      handleFiles(files);
    },
    [handleFiles]
  );

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFileRejections([]);
    const files = Array.from(event.target.files || []);
    handleFiles(files);
    // reset the input value to allow re-uploading the same file
    if(event.target) {
        event.target.value = '';
    }
  }, [handleFiles]);

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const getRootProps = () => ({
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    onClick: openFileDialog,
  });

  const getInputProps = () => ({
    ref: inputRef,
    type: 'file',
    style: { display: 'none' },
    onChange: handleChange,
    multiple: maxFiles > 1,
    accept: Object.keys(accept).join(','),
  });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
  };
}