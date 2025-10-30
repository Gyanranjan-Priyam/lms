"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Check, Upload, X, MoreVertical } from "lucide-react";
import { LessonDocumentSchemaType } from "@/lib/zodSchema";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DocumentItem {
  id: string;
  name: string;
  fileKey: string;
  uploaded: boolean;
}

interface MultiPdfUploaderProps {
  value?: LessonDocumentSchemaType[];
  onChange?: (documents: LessonDocumentSchemaType[]) => void;
  maxDocuments?: number;
}

interface CompactUploaderProps {
  value?: string;
  onChange?: (value: string) => void;
  fileTypeAccepted: "pdf";
}

// Compact uploader component for small spaces
function CompactUploader({ value, onChange }: CompactUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toastId, setToastId] = useState<string | number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault(); // Prevent any default behavior
    event.stopPropagation(); // Stop event bubbling
    
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    // Validate file size (500MB max)
    if (file.size > 500 * 1024 * 1024) {
      toast.error('File size must be less than 500MB');
      return;
    }

    setUploading(true);
    setProgress(0);

    // Show initial upload toast
    const uploadToastId = toast.loading('Uploading PDF...', {
      description: '0% complete',
    });
    setToastId(uploadToastId);

    try {
      // Get pre-signed URL
      const presignedResponse = await fetch('/api/s3/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: false,
          isPdf: true,
        })
      });

      if (!presignedResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { preSignedUrl, key } = await presignedResponse.json();

      // Upload to S3
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentage = (event.loaded / event.total) * 100;
            const roundedPercentage = Math.round(percentage);
            setProgress(roundedPercentage);
            
            // Update the toast with progress
            toast.loading(`Uploading PDF... ${roundedPercentage}%`, {
              id: uploadToastId,
              description: `${roundedPercentage}% complete`,
            });
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            onChange?.(key);
            toast.success('PDF uploaded successfully!', {
              id: uploadToastId,
              description: 'Your document is ready',
            });
            resolve();
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));

        xhr.open('PUT', preSignedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });
    } catch {
      toast.error('Failed to upload PDF', {
        id: uploadToastId,
        description: 'Please try again',
      });
    } finally {
      setUploading(false);
      setProgress(0);
      setToastId(null);
    }
  };

  const handleRemove = async (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (!value) return;

    const deleteToastId = toast.loading('Removing PDF...', {
      description: 'Please wait',
    });

    try {
      const response = await fetch('/api/s3/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: value })
      });

      if (response.ok) {
        onChange?.('');
        toast.success('PDF removed successfully', {
          id: deleteToastId,
          description: 'Document has been deleted',
        });
      } else {
        throw new Error('Delete failed');
      }
    } catch {
      toast.error('Failed to remove PDF', {
        id: deleteToastId,
        description: 'Please try again',
      });
    }
  };

  const handleButtonClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (value) {
    return (
      <div className="flex items-center ml-2 gap-1">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className={cn("flex items-center gap-1 h-10 bg-green-400 text-black dark:bg-green-500 dark:text-white")}
          disabled
        >
          <Check className="size-4 mr-2 dark:text-white" />
          <span className="text-black dark:text-white">Uploaded</span>
        </Button>
      </div>
    );
  }



  return (
    <div className="ml-5 relative">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="flex items-center gap-1 h-10 px-2 text-xs hover:bg-gray-50"
        onClick={handleButtonClick}
        disabled={uploading}
      >
        <Upload className="size-4" />
        <span>Upload</span>
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

export function MultiPdfUploader({ 
  value = [], 
  onChange, 
  maxDocuments = 5 
}: MultiPdfUploaderProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    // Initialize with existing documents or empty state
    if (value.length > 0) {
      return value.map((doc, index) => ({
        id: `doc-${index}`,
        name: doc.name,
        fileKey: doc.fileKey,
        uploaded: true,
      }));
    }
    return [{ id: "doc-0", name: "", fileKey: "", uploaded: false }];
  });

  const handleNameChange = (id: string, name: string) => {
    setDocuments(prev => {
      const updated = prev.map(doc => 
        doc.id === id ? { ...doc, name } : doc
      );
      updateParent(updated);
      return updated;
    });
  };

  const handleFileUpload = (id: string, fileKey: string) => {
    setDocuments(prev => {
      const updated = prev.map(doc => 
        doc.id === id ? { ...doc, fileKey, uploaded: true } : doc
      );
      updateParent(updated);
      return updated;
    });
  };

  const handleFileDelete = (id: string) => {
    setDocuments(prev => {
      const updated = prev.map(doc => 
        doc.id === id ? { ...doc, fileKey: "", uploaded: false } : doc
      );
      updateParent(updated);
      return updated;
    });
    
    // Also trigger the actual file deletion from S3
    const documentToDelete = documents.find(doc => doc.id === id);
    if (documentToDelete?.fileKey) {
      handleActualFileDelete(documentToDelete.fileKey);
    }
  };

  const handleActualFileDelete = async (fileKey: string) => {
    const deleteToastId = toast.loading('Removing PDF from storage...', {
      description: 'Please wait',
    });

    try {
      const response = await fetch('/api/s3/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: fileKey })
      });

      if (response.ok) {
        toast.success('PDF removed from storage', {
          id: deleteToastId,
          description: 'File has been deleted',
        });
      } else {
        throw new Error('Delete failed');
      }
    } catch {
      toast.error('Failed to remove PDF from storage', {
        id: deleteToastId,
        description: 'Please try again',
      });
    }
  };

  const addDocument = () => {
    if (documents.length < maxDocuments) {
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: "",
        fileKey: "",
        uploaded: false,
      };
      setDocuments(prev => [...prev, newDoc]);
    }
  };

  const removeDocument = (id: string) => {
    if (documents.length > 1) {
      setDocuments(prev => {
        const updated = prev.filter(doc => doc.id !== id);
        updateParent(updated);
        return updated;
      });
    }
  };

  const updateParent = (docs: DocumentItem[]) => {
    // Only include documents that have both name and fileKey
    const validDocuments = docs
      .filter(doc => doc.name.trim() && doc.fileKey.trim())
      .map(doc => ({
        name: doc.name.trim(),
        fileKey: doc.fileKey.trim(),
      }));
    
    onChange?.(validDocuments);
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Course Documents</h4>
        
        {documents.map((document, index) => (
          <div key={document.id} className="flex gap-3 items-center p-3 border rounded-lg ">
            {/* Document name input */}
            <div className="flex-1">
              <Input
                placeholder={`Document ${index + 1} name`}
                value={document.name}
                onChange={(e) => handleNameChange(document.id, e.target.value)}
                className="h-9"
              />
            </div>

            {/* Compact file uploader */}
            <div className="w-32">
              <div className="relative">
                <CompactUploader
                  value={document.fileKey}
                  onChange={(fileKey: string) => {
                    if (fileKey) {
                      handleFileUpload(document.id, fileKey);
                    } else {
                      handleFileDelete(document.id);
                    }
                  }}
                  fileTypeAccepted="pdf"
                />
              </div>
            </div>

            {/* Status and actions */}
            <div className="flex items-center gap-2">
              {document.uploaded && document.name && (
                <div className="bg-green-100 rounded-full p-1">
                  <Check className="size-4 text-green-600" />
                </div>
              )}
              
              {/* 3-dot action menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 border hover:bg-gray-100"
                  >
                    <MoreVertical className="size-4 text-white-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {document.uploaded && document.fileKey && (
                    <DropdownMenuItem
                      onClick={() => handleFileDelete(document.id)}
                      className="text-red-600 focus:text-red-600 font-bold cursor-pointer h-10 mt-2 mb-2"
                    >
                      <X className="size-4 mr-2" />
                      Delete File
                    </DropdownMenuItem>
                  )}
                  {documents.length > 1 && (
                    <DropdownMenuItem
                      onClick={() => removeDocument(document.id)}
                      className="text-red-600 focus:text-red-600 font-bold cursor-pointer h-10 mb-2"
                    >
                      <Trash2 className="size-4 mr-2" />
                      Remove Document
                    </DropdownMenuItem>
                  )}
                  {(!document.uploaded || !document.fileKey) && documents.length === 1 && (
                    <DropdownMenuItem disabled className="text-gray-400 cursor-not-allowed">
                      <span className="text-xs">No actions available</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}

        {/* Add new document button */}
        {documents.length < maxDocuments && (
          <Button
            type="button"
            variant="outline"
            onClick={addDocument}
            className="w-full gap-2 h-9"
            size="sm"
          >
            <Plus className="size-4" />
            Add Document ({documents.length}/{maxDocuments})
          </Button>
        )}

        {documents.length >= maxDocuments && (
          <p className="text-xs text-muted-foreground text-center">
            Maximum {maxDocuments} documents allowed
          </p>
        )}
      </div>
    </Card>
  );
}