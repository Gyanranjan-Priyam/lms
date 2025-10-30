import AdminProfileSettings from "./_components/AdminProfileSettings";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings className="size-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground">
            Manage your learning management system configuration
          </p>
        </div>
      </div>

      <AdminProfileSettings />
    </div>
  );
}
