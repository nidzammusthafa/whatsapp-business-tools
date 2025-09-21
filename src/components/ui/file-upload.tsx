import { useState, useCallback } from "react";
import {
  Upload,
  File as FileIcon,
  X,
  CheckCircle,
  AlertCircle,
  File,
} from "lucide-react";
import { Button } from "./button";
import { Progress } from "./progress";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/hooks/useFileUpload";

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
}

interface UploadedFile {
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
}

export function FileUpload({
  onFileUpload,
  accept = {
    "text/csv": [".csv"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
  },
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: "uploading" as const,
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Simulate upload process
      newFiles.forEach((uploadedFile) => {
        const interval = setInterval(() => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.file === uploadedFile.file
                ? { ...f, progress: Math.min(f.progress + 10, 100) }
                : f
            )
          );
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.file === uploadedFile.file
                ? { ...f, progress: 100, status: "success" }
                : f
            )
          );
          onFileUpload([uploadedFile.file]);
        }, 1000);
      });
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useFileUpload({
      onDrop,
      accept,
      maxFiles,
      maxSize,
    });

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles((prev) => prev.filter((f) => f.file !== fileToRemove));
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-primary font-medium">Drop files here...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Drag & drop files here, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Supports CSV, Excel files up to{" "}
              {(maxSize / 1024 / 1024).toFixed(0)}MB
            </p>
          </div>
        )}
      </div>

      {fileRejections.length > 0 && (
        <div className="space-y-2">
          {fileRejections.map(
            ({ file, errors }: { file: File; errors: Error[] }) => (
              <div
                key={file.name}
                className="flex items-center gap-2 text-sm text-destructive"
              >
                <AlertCircle className="h-4 w-4" />
                <span>
                  {file.name}: {errors[0]?.message}
                </span>
              </div>
            )
          )}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          {uploadedFiles.map((uploadedFile) => (
            <div
              key={uploadedFile.file.name}
              className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
            >
              <FileIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {uploadedFile.file.name}
                  </span>
                  <div className="flex items-center gap-2">
                    {uploadedFile.status === "success" && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                    {uploadedFile.status === "error" && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadedFile.file)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {uploadedFile.status === "uploading" && (
                  <Progress value={uploadedFile.progress} className="h-1" />
                )}
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
