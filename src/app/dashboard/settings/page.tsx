'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState({ orderUpdates: true, promotions: false, newsletter: true });

  useEffect(() => setMounted(true), []);

  function handleSaveNotifications() {
    toast.success('Notification preferences saved');
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-slate-500">Manage your preferences</p>
      </div>

      <Card className="p-6">
        <h2 className="font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-slate-500">Choose how ShopNest looks for you</p>
        {mounted && (
          <Select className="mt-4 max-w-xs" value={theme} onChange={(e) => setTheme(e.target.value)} aria-label="Theme">
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </Select>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold">Notifications</h2>
        <p className="mt-1 text-sm text-slate-500">Choose what you want to be notified about</p>
        <div className="mt-4 space-y-3">
          {(
            [
              { key: 'orderUpdates', label: 'Order status updates' },
              { key: 'promotions', label: 'Promotions and discounts' },
              { key: 'newsletter', label: 'Weekly newsletter' },
            ] as const
          ).map((item) => (
            <label key={item.key} className="flex items-center justify-between gap-4 text-sm">
              {item.label}
              <input
                type="checkbox"
                className="size-4 accent-brand"
                checked={notifications[item.key]}
                onChange={(e) => setNotifications((prev) => ({ ...prev, [item.key]: e.target.checked }))}
              />
            </label>
          ))}
        </div>
        <Button className="mt-5" size="sm" onClick={handleSaveNotifications}>
          Save Preferences
        </Button>
      </Card>
    </div>
  );
}
