"use client";

import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useConstructUrl } from "@/hooks/use-construct";
import { BookIcon, CheckCircle, FileTextIcon } from "lucide-react";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { markLessonAsComplete } from "../actions";
import { useConfetti } from "@/hooks/use-confetti";


interface iAppProps {
   data: LessonContentType
}

export function CourseContent({ data }: iAppProps) {

   const [pending, startTransition] = useTransition();
   const { triggerConfetti } = useConfetti()

   function VideoPlayer({
      thumbnailKey,
      videoKey
   } : {thumbnailKey: string; videoKey: string;}) {
      const videoUrl = useConstructUrl(videoKey);
      const thumbnailUrl = useConstructUrl(thumbnailKey);

      if (!videoKey) {
         return (
            <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
            <BookIcon className="size-16 mx-auto mb-4 text-muted-foreground"/>
            <p>This lesson has no video content.</p>
            </div>
         )
      }

      return (
         <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
            <video poster={thumbnailUrl} controls className="w-full h-full rounded-lg object-cover" >
               <source src={videoUrl} type="video/mp4" />
               <source src={videoUrl} type="video/webm" />
               <source src={videoUrl} type="video/ogg" />
               Your browser does not support the video tag.
            </video>
         </div>
      )
   }

   function DocumentsViewer({ documents }: { documents: Array<{id: string; name: string; fileKey: string; position: number}> }) {
      if (!documents || documents.length === 0) {
         return null;
      }

      return (
         <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
               <FileTextIcon className="size-5 text-red-500" />
               <h3 className="text-lg font-semibold">Course Materials</h3>
            </div>
            <div className="space-y-3">
               {documents.map((document) => (
                  <DocumentItem key={document.id} document={document} />
               ))}
            </div>
         </div>
      )
   }

   function DocumentItem({ document: doc }: { document: {id: string; name: string; fileKey: string; position: number} }) {
      const [secureUrl, setSecureUrl] = useState<string>('');
      const [loading, setLoading] = useState(false);
      const [urlGenerated, setUrlGenerated] = useState(false);
      
      const generateSecureUrl = async (): Promise<boolean> => {
         if (loading || urlGenerated) return urlGenerated;
         
         setLoading(true);
         try {
            const response = await fetch(`/api/documents/${doc.id}`, {
               method: 'GET',
               credentials: 'include', // Include cookies for session
               headers: {
                  'Content-Type': 'application/json',
               }
            });
            
            if (response.ok) {
               const data = await response.json();
               
               // Decode the obfuscated URL with enhanced verification
               const decodedUrl = decodeObfuscatedUrl(data.url);
               if (decodedUrl) {
                  setSecureUrl(decodedUrl);
                  setUrlGenerated(true);
                  return true;
               } else {
                  toast.error('Document access expired or invalid');
                  return false;
               }
            } else if (response.status === 401) {
               toast.error('Please login to access this document');
               return false;
            } else {
               toast.error('Failed to load document');
               return false;
            }
         } catch (error) {
            console.error('Error loading document:', error);
            toast.error('Error loading document');
            return false;
         } finally {
            setLoading(false);
         }
      };

      const decodeObfuscatedUrl = (obfuscatedUrl: string): string | null => {
         try {
            // Check if it's a data URL with our format
            if (obfuscatedUrl.startsWith('data:application/pdf;base64url,')) {
               const encodedPayload = obfuscatedUrl.replace('data:application/pdf;base64url,', '');
               // Convert base64url to base64
               const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
               // Add padding if needed
               const paddedBase64 = base64 + '='.repeat((4 - base64.length % 4) % 4);
               
               const payload = JSON.parse(atob(paddedBase64));
               
               // Enhanced verification
               if (Date.now() < payload.exp && payload.uid && payload.url) {
                  // Additional security check - verify URL format
                  if (payload.url.includes('t3.storage.dev') || payload.url.includes('s3.amazonaws.com')) {
                     return payload.url;
                  }
               }
               
               toast.error('Document access has expired');
            }
            return null;
         } catch (error) {
            console.error('Error decoding URL:', error);
            return null;
         }
      };

      const handleView = async () => {
         if (secureUrl && urlGenerated) {
            // URL already generated and valid
            window.open(secureUrl, '_blank', 'noopener,noreferrer');
            return;
         }
         
         const success = await generateSecureUrl();
         if (success && secureUrl) {
            window.open(secureUrl, '_blank', 'noopener,noreferrer');
         }
      };

      const handleDownload = async () => {
         if (!secureUrl || !urlGenerated) {
            const success = await generateSecureUrl();
            if (!success) return;
         }
         
         if (secureUrl) {
            try {
               // Fetch the PDF and create a blob for download
               const response = await fetch(secureUrl);
               if (response.ok) {
                  const blob = await response.blob();
                  const downloadUrl = window.URL.createObjectURL(blob);
                  
                  // Create a temporary link for download
                  const link = document.createElement('a');
                  link.href = downloadUrl;
                  link.download = `${doc.name}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  
                  // Cleanup
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(downloadUrl);
               } else {
                  toast.error('Failed to download document');
               }
            } catch (error) {
               console.error('Download error:', error);
               toast.error('Download failed');
            }
         }
      };
      
      return (
         <div className="border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <FileTextIcon className="size-8 text-red-500" />
                  <div>
                     <p className="font-medium">{doc.name}</p>
                     <p className="text-sm text-muted-foreground">PDF Document</p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <Button 
                     variant="outline" 
                     size="sm"
                     onClick={handleView}
                     disabled={loading}
                  >
                     {loading ? 'Loading...' : 'View PDF'}
                  </Button>
                  <Button 
                     size="sm"
                     onClick={handleDownload}
                     disabled={loading}
                  >
                     {loading ? 'Loading...' : 'Download'}
                  </Button>
               </div>
            </div>
         </div>
      );
   }

   function onSubmit() {
         startTransition(async () =>{
      const{data: result, error} = await tryCatch(markLessonAsComplete(data.id, data.Chapter.Course.slug));

      if(error) {
        toast.error("An unexpected error occured. Please try again.");
        return ;
      }
      if (result.status === 'success') {
        toast.success(result.message);
        triggerConfetti();
      }
      else if(result.status === 'error'){
        toast.error(result.message)
      }
    });
  }




   return (
      <div className="flex flex-col h-full bg-background pl-6">
         <VideoPlayer thumbnailKey={data.thumbnailKey ?? ""} videoKey={data.videoKey ?? ""} />
         <div className="py-4 border-b">

            {data.lessonProgress.length > 0 ? (
               <Button variant="outline" className="bg-green-500/10 text-green-500">
                  <CheckCircle className="size-4 mr-2 text-green-500"/> Lesson Completed
               </Button>
            ) : (
               <Button variant="outline" onClick={onSubmit} disabled={pending}>
                  <CheckCircle className="size-4 mr-2 text-green-500"/> Mark as Complete
               </Button>
            )}

            <DocumentsViewer documents={data.documents} />

         </div>
         <div className="space-y-3">
            <h1 className="font-semibold text-2xl mb-4">{data.title}</h1>
            <p className="text-sm text-muted-foreground">{data.description && (
               <RenderDescription json={JSON.parse(data.description)}/>
            )}</p>
         </div>
      </div>
   )
}