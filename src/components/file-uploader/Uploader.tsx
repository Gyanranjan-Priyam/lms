"use client";

import { useCallback, useEffect, useState } from 'react';
import {FileRejection, useDropzone} from 'react-dropzone'
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from './RenderState';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useConstructUrl } from '@/hooks/use-construct';
 

interface UploaderState{
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string;
    fileType: "image" | "video" | "pdf";
}

interface iAppProps {
    value?: string;
    onChange?: (value: string) => void;
    fileTypeAccepted: "image" | "video" | "pdf";
}

export function Uploader({ value, onChange, fileTypeAccepted }: iAppProps) {
    const fileUrl = useConstructUrl(value || '');
    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: fileTypeAccepted,
        key: value,
        objectUrl: value ? fileUrl : undefined,
    })

    const uploadFile = useCallback(async (file: File) => {
        setFileState((prev) =>({
            ...prev,
            uploading: true,
            progress: 0,
        }))

        try {
            //Get pre-signed URL from the server
            const presignedResponse = await fetch('/api/s3/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: fileTypeAccepted === 'image' ? true : false,
                    isPdf: fileTypeAccepted === 'pdf' ? true : false,
                })
            })
            if(!presignedResponse.ok) {
                toast.error('Failed to get pre-signed URL');
                setFileState((prev) =>({
                    ...prev,
                    uploading: false,
                    progress: 0,
                    error: true,
                }))
                return;
            }
            const { preSignedUrl, key } = await presignedResponse.json();

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.upload.onprogress = (event) => {
                    if(event.lengthComputable) {
                        const percentageCompleted = (event.loaded / event.total) * 100;
                        setFileState((prev) =>({
                            ...prev,
                            progress: Math.round(percentageCompleted),
                        }));
                    }
                }

                xhr.onload = () => {
                    if(xhr.status === 200 || xhr.status === 204) {
                        setFileState((prev) =>({
                            ...prev,
                            progress: 100,
                            uploading: false,
                            key: key,
                        }));

                        onChange?.(key);

                        toast.success('File uploaded successfully');
                        resolve();
                    } else {
                        reject(new Error('Upload failed'));
                    }
                }
                xhr.onerror = () => {
                        reject(new Error('Upload failed'));
                    }

                xhr.open('PUT', preSignedUrl, true);
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.send(file);
            })
        } catch {
            toast.error('An error occurred during file upload');

            setFileState((prev) =>({
                 ...prev,
                progress: 100,
                uploading: false,
                error: true,
            }));
        }
    }, [fileTypeAccepted, onChange]
    )



    const onDrop = useCallback((acceptedFiles: File[]) => {
    
        if(acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }

            setFileState({
                file: file,
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                id: uuidv4(),
                isDeleting: false,
                fileType: fileTypeAccepted,
            });

            uploadFile(file);
        }
  }, [fileTypeAccepted, uploadFile, fileState.objectUrl]);

    async function handleRemoveFile() {
        if (fileState.isDeleting || !fileState.objectUrl) return;

        try {
            setFileState((prev) =>({
                 ...prev,
                 isDeleting: true,
            }));

            const response = await fetch('/api/s3/delete', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({key: fileState.key})
            });

            if(!response.ok) {
                toast.error('Failed to delete file from server');
                setFileState((prev) =>({
                     ...prev,
                     isDeleting: false,
                }));
                return;
            }

            if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }

            onChange?.("");

            setFileState(() =>({
                 file: null,
                 uploading: false,
                 progress: 0,
                 objectUrl: undefined,
                 error: false,
                 id: null,
                 isDeleting: false,
                 fileType: fileTypeAccepted,
            }));
            toast.success('File deleted successfully');
        } catch {
            toast.error('An error occurred while deleting the file');
            setFileState((prev) =>({
                 ...prev,
                 isDeleting: false,
                 error: true,
            }));
        }
    }

    function rejectedFiles(fileRejection: FileRejection[]) {
        if(fileRejection.length) {
            const tooManyFiles = fileRejection.find((rejection) => rejection.errors[0].code === 'too-many-files')
            const fileTooBig = fileRejection.find((rejection) => rejection.errors[0].code === 'file-too-big')
            const invalidFileType = fileRejection.find((rejection) => rejection.errors[0].code === 'file-invalid-type')

            if(invalidFileType) {
                toast.error(`Invalid file type. Please upload a ${fileTypeAccepted} file.`)
            }
            if(fileTooBig) {
                toast.error('File is too large. Maximum size is 5MB.')
            }
            if(tooManyFiles) {
                toast.error('You can only upload one file at a time.')
            }
        }
    }

    function renderContent() {
        if(fileState.uploading) {
            return (
                <RenderUploadingState 
                    progress={fileState.progress} 
                    file={fileState.file!} 
                    />
            )
        }

        if(fileState.error) {
            return <RenderErrorState />;
        }

        if(fileState.objectUrl) {
            return (
                <RenderUploadedState 
                    previewUrl={fileState.objectUrl}
                    isDeleting={fileState.isDeleting}
                    handleRemoveFile={handleRemoveFile}
                    fileType={fileState.fileType}
                />
            )
        }

        return <RenderEmptyState isDragActive={false} />;
    }

    useEffect(() => {
        return () => {
            if(fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
                URL.revokeObjectURL(fileState.objectUrl);
            }
        }
    }, [fileState.objectUrl]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop,
        accept: fileTypeAccepted === 'image' ? {
            'image/*': []
        } : fileTypeAccepted === 'video' ? {
            'video/*': []
        } : {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        multiple: false,
        maxSize: 500 * 1024 * 1024, // 500 MB
        onDropRejected: rejectedFiles,
        disabled: fileState.uploading || !!fileState.objectUrl,
    })
      return (
        <Card 
            {...getRootProps()} 
            className={cn(
                "mt-2 relative border-2 border-dashed transitions-colors duration-200 ease-in-out w-full h-120",
                isDragActive ? "border=primary bg-primary/10 border-solid" : "border-border hover:border-primary "
            )}
        >
            <CardContent className='flex items-center justify-center h-full w-full p-4'>
                <input 
                    {...getInputProps()} 
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                        e.stopPropagation();
                        const inputProps = getInputProps();
                        if (inputProps.onChange) {
                            inputProps.onChange(e);
                        }
                    }}
                />
                {renderContent()}
            </CardContent>
        </Card>
      ) 
} 