'use client'

import { useState } from 'react'
import { Save, Shield, AlertCircle, Bell } from 'lucide-react'

interface Settings {
  platformName: string
  emailNotifications: boolean
  duplicateEmailPrevention: boolean
  duplicatePhonePrevention: boolean
  lifetimeWinnerRestriction: boolean
  ipTrackingProtection: boolean
  twoFactorAuth: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    platformName: 'YoungTraderViraj Platform',
    emailNotifications: true,
    duplicateEmailPrevention: true,
    duplicatePhonePrevention: true,
    lifetimeWinnerRestriction: true,
    ipTrackingProtection: true,
    twoFactorAuth: false,
  })

  const [saved, setSaved] = useState(false)

  const handleToggle = (key: keyof Settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 mb-4 relative z-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 drop-shadow-sm tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">Configure your platform and security settings</p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-sm font-medium flex items-center gap-2">
          ✓ Settings saved successfully
        </div>
      )}

      <div className="max-w-3xl space-y-6">
        {/* General Settings */}
        <div className="card-surface p-6 border-primary/10 shadow-[0_4px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 relative z-10">
            <Bell size={20} className="text-primary" />
            General Settings
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Platform Name
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => {
                  setSettings((prev) => ({
                    ...prev,
                    platformName: e.target.value,
                  }))
                  setSaved(false)
                }}
                className="input-field"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 card-inset cursor-pointer hover:border-primary/50 hover:bg-muted/60 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  className="w-4 h-4 rounded border-border accent-primary focus:ring-primary/20"
                />
                <div>
                  <p className="font-semibold text-foreground">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Receive email updates about giveaway activity
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Giveaway Rules */}
        <div className="card-surface p-6 border-primary/10 shadow-[0_4px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-chart-2/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 relative z-10">
            <Shield size={20} className="text-chart-2" />
            Giveaway Rules
          </h3>

          <div className="space-y-4 relative z-10">
            <label className="flex items-start gap-3 p-4 card-inset cursor-pointer hover:border-primary/50 hover:bg-muted/60 transition-colors">
              <input
                type="checkbox"
                checked={settings.duplicateEmailPrevention}
                onChange={() => handleToggle('duplicateEmailPrevention')}
                className="w-4 h-4 rounded border-border accent-primary focus:ring-primary/20 mt-1 flex-shrink-0"
              />
              <div>
                <p className="font-semibold text-foreground">Duplicate Email Prevention</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Prevent participants from entering with the same email address across
                  giveaways
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 card-inset cursor-pointer hover:border-primary/50 hover:bg-muted/60 transition-colors">
              <input
                type="checkbox"
                checked={settings.duplicatePhonePrevention}
                onChange={() => handleToggle('duplicatePhonePrevention')}
                className="w-4 h-4 rounded border-border accent-primary focus:ring-primary/20 mt-1 flex-shrink-0"
              />
              <div>
                <p className="font-semibold text-foreground">Duplicate Phone Prevention</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Prevent participants from entering with the same phone number
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 card-inset cursor-pointer hover:border-primary/50 hover:bg-muted/60 transition-colors">
              <input
                type="checkbox"
                checked={settings.lifetimeWinnerRestriction}
                onChange={() => handleToggle('lifetimeWinnerRestriction')}
                className="w-4 h-4 rounded border-border accent-primary focus:ring-primary/20 mt-1 flex-shrink-0"
              />
              <div>
                <p className="font-semibold text-foreground">Lifetime Winner Restriction</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Winners cannot participate in future giveaways
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 card-inset cursor-pointer hover:border-primary/50 hover:bg-muted/60 transition-colors">
              <input
                type="checkbox"
                checked={settings.ipTrackingProtection}
                onChange={() => handleToggle('ipTrackingProtection')}
                className="w-4 h-4 rounded border-border accent-primary focus:ring-primary/20 mt-1 flex-shrink-0"
              />
              <div>
                <p className="font-semibold text-foreground">IP Tracking Protection</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Prevent multiple entries from the same IP address
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card-surface p-6 border-primary/10 shadow-[0_4px_30px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-chart-1/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
          <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 relative z-10">
            <Shield size={20} className="text-chart-1" />
            Security
          </h3>

          <div className="space-y-4 relative z-10">
            <label className="flex items-center gap-3 p-4 card-inset cursor-pointer hover:border-primary/50 hover:bg-muted/60 transition-colors">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={() => handleToggle('twoFactorAuth')}
                className="w-4 h-4 rounded border-border accent-primary focus:ring-primary/20"
              />
              <div>
                <p className="font-semibold text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">
                  Enable 2FA for added account security
                </p>
              </div>
            </label>

            {settings.twoFactorAuth && (
              <div className="p-4 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-300 text-sm flex gap-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">2FA Enabled</p>
                  <p className="text-xs mt-1">
                    You will need to verify with your authenticator app on next login
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-6 backdrop-blur-md">
          <h3 className="text-lg font-bold text-destructive mb-4 flex items-center gap-2">
            <AlertCircle size={20} />
            Danger Zone
          </h3>

          <div className="space-y-3">
            <button className="w-full px-6 py-2.5 rounded-xl bg-destructive/15 text-destructive border border-destructive/30 font-medium hover:bg-destructive/25 hover:shadow-sm transition-all duration-300 text-sm">
              Reset All Data
            </button>
            <button className="w-full px-6 py-2.5 rounded-xl bg-destructive/15 text-destructive border border-destructive/30 font-medium hover:bg-destructive/25 hover:shadow-sm transition-all duration-300 text-sm">
              Delete Platform
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="btn-primary w-full py-3"
        >
          <Save size={18} />
          <span>Save All Settings</span>
        </button>
      </div>
    </div>
  )
}
