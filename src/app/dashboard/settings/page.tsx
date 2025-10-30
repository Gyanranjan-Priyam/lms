import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Bell, 
  Lock, 
  CreditCard,
  Download,
  Eye,
  Moon,
  Sun,
  Globe,
  Smartphone,
  Mail,
  Shield
} from "lucide-react";
import UserProfileSettings from "./_components/UserProfileSettings";

export default function UserSettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 w-full mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="size-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>
      </div>

      {/* Profile Section */}
      <UserProfileSettings />
    </div>
  );
}