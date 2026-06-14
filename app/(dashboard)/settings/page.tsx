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
      <div>
        <h1 className="text-4xl font-extrabold mb-2"><span className="text-gradient">Settings</span></h1>
        <p className="text-muted">Configure your platform and security settings</p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-sm font-medium flex items-center gap-2">
          ✓ Settings saved successfully
        </div>
      )}

      <div className="max-w-3xl space-y-6">
        {/* General Settings */}
        <div className="card-surface p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Bell size={20} className="text-sky-500" />
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
              <label className="flex items-center gap-3 p-4 card-inset cursor-pointer hover:border-sky-400/50 transition-colors">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  className="w-4 h-4 rounded border-slate-300 accent-sky-500"
                />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Email Notifications</p>
                  <p className="text-xs text-muted">
                    Receive email updates about giveaway activity
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Giveaway Rules */}
        <div className="card-surface p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Shield size={20} className="text-sky-500" />
            Giveaway Rules
          </h3>

          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 card-inset cursor-pointer hover:border-sky-400/50 transition-colors">
              <input
                type="checkbox"
                checked={settings.duplicateEmailPrevention}
                onChange={() => handleToggle('duplicateEmailPrevention')}
                className="w-4 h-4 rounded border-slate-300 accent-sky-500 mt-1 flex-shrink-0"
              />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Duplicate Email Prevention</p>
                <p className="text-xs text-muted mt-1">
                  Prevent participants from entering with the same email address across
                  giveaways
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 card-inset cursor-pointer hover:border-sky-400/50 transition-colors">
              <input
                type="checkbox"
                checked={settings.duplicatePhonePrevention}
                onChange={() => handleToggle('duplicatePhonePrevention')}
                className="w-4 h-4 rounded border-slate-300 accent-sky-500 mt-1 flex-shrink-0"
              />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Duplicate Phone Prevention</p>
                <p className="text-xs text-muted mt-1">
                  Prevent participants from entering with the same phone number
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 card-inset cursor-pointer hover:border-sky-400/50 transition-colors">
              <input
                type="checkbox"
                checked={settings.lifetimeWinnerRestriction}
                onChange={() => handleToggle('lifetimeWinnerRestriction')}
                className="w-4 h-4 rounded border-slate-300 accent-sky-500 mt-1 flex-shrink-0"
              />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Lifetime Winner Restriction</p>
                <p className="text-xs text-muted mt-1">
                  Winners cannot participate in future giveaways
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 card-inset cursor-pointer hover:border-sky-400/50 transition-colors">
              <input
                type="checkbox"
                checked={settings.ipTrackingProtection}
                onChange={() => handleToggle('ipTrackingProtection')}
                className="w-4 h-4 rounded border-slate-300 accent-sky-500 mt-1 flex-shrink-0"
              />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">IP Tracking Protection</p>
                <p className="text-xs text-muted mt-1">
                  Prevent multiple entries from the same IP address
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card-surface p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Shield size={20} className="text-sky-500" />
            Security
          </h3>

          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 card-inset cursor-pointer hover:border-sky-400/50 transition-colors">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={() => handleToggle('twoFactorAuth')}
                className="w-4 h-4 rounded border-slate-300 accent-sky-500"
              />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</p>
                <p className="text-xs text-muted">
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
        <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-6">
          <h3 className="text-lg font-bold text-rose-500 mb-4 flex items-center gap-2">
            <AlertCircle size={20} />
            Danger Zone
          </h3>

          <div className="space-y-3">
            <button className="w-full px-6 py-2.5 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30 font-medium hover:bg-rose-500/25 transition-colors text-sm">
              Reset All Data
            </button>
            <button className="w-full px-6 py-2.5 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30 font-medium hover:bg-rose-500/25 transition-colors text-sm">
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
