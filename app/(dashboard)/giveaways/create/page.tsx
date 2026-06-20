'use client'

import { useState, useTransition } from 'react'
import { ChevronLeft, Upload, X, Loader2, Sparkles, Trophy, Calendar, Settings2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createGiveaway } from '../actions'

interface FormData {
  name: string
  prize: string
  description: string
  banner: File | null
  winners: number
  multipleEntries: boolean
  brokerVerificationRequired: boolean
  lifetimeWinnerRestriction: boolean
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  status: 'Draft' | 'Scheduled' | 'Live'
}

export default function CreateGiveawayPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    prize: '',
    description: '',
    banner: null,
    winners: 1,
    multipleEntries: true,
    brokerVerificationRequired: true,
    lifetimeWinnerRestriction: true,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    status: 'Draft',
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleInputChange('banner', file)
    }
  }

  const toIso = (date: string, time: string) =>
    date ? new Date(`${date}T${time || '00:00'}`).toISOString() : ''

  const isFormValid = () => {
    return !!(formData.name && formData.prize && formData.description && formData.startDate && formData.endDate && formData.status)
  }

  const handleCreate = () => {
    setSubmitError('')
    startTransition(async () => {
      const result = await createGiveaway({
        name: formData.name,
        prize: formData.prize,
        description: formData.description,
        winners: formData.winners,
        multipleEntries: formData.multipleEntries,
        brokerVerificationRequired: formData.brokerVerificationRequired,
        lifetimeWinnerRestriction: formData.lifetimeWinnerRestriction,
        startDate: toIso(formData.startDate, formData.startTime),
        endDate: toIso(formData.endDate, formData.endTime),
        status: formData.status,
      }, formData.banner)
      if (!result.ok) {
        setSubmitError(result.error)
        return
      }
      router.push('/giveaways')
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <Link
          href="/giveaways"
          className="text-primary hover:text-primary/80 text-sm font-semibold mb-6 inline-flex items-center gap-1 transition-colors bg-primary/10 px-3 py-1.5 rounded-full"
        >
          <ChevronLeft size={16} />
          Back to Giveaways
        </Link>
        <h1 className="text-4xl md:text-5xl font-black mt-4"><span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-chart-1 to-chart-2">Create New Campaign</span></h1>
        <p className="text-muted-foreground text-lg mt-3 max-w-2xl">Configure the details of your new giveaway. Changes are reflected in the preview instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form Scrollable Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Basic Info */}
          <div className="card-surface p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3 border-b border-border/50 pb-4">
              <Sparkles className="text-primary" size={24} />
              Basic Information
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Giveaway Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., iPhone 15 Pro Launch Giveaway"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input-field text-lg py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Prize *</label>
                <input
                  type="text"
                  placeholder="e.g., iPhone 15 Pro Max 256GB"
                  value={formData.prize}
                  onChange={(e) => handleInputChange('prize', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your giveaway rules, eligibility, etc."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="input-field resize-y min-h-[120px]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Banner Image
                </label>
                {formData.banner ? (
                  <div className="flex items-center justify-between px-4 py-3 card-inset border-primary/20 bg-primary/5">
                    <span className="text-sm font-medium text-primary">{formData.banner.name}</span>
                    <button
                      onClick={() => handleInputChange('banner', null)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-3 px-4 py-10 border-2 border-dashed border-border/60 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                      <Upload size={24} className="text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-semibold text-foreground block">Click to upload banner</span>
                      <span className="text-xs text-muted-foreground mt-1 block">PNG, JPG up to 5MB</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Rules & Eligibility */}
          <div className="card-surface p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-chart-2/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-chart-2/10 transition-colors"></div>
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3 border-b border-border/50 pb-4">
              <Trophy className="text-chart-2" size={24} />
              Rules & Eligibility
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Number of Winners *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.winners}
                  onChange={(e) =>
                    handleInputChange('winners', Math.max(1, parseInt(e.target.value)))
                  }
                  className="input-field max-w-[200px] text-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 p-4 card-inset cursor-pointer hover:border-chart-2/50 hover:bg-chart-2/5 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.multipleEntries}
                    onChange={(e) =>
                      handleInputChange('multipleEntries', e.target.checked)
                    }
                    className="w-5 h-5 mt-0.5 rounded border-border accent-chart-2 focus:ring-chart-2/20"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Allow Multiple Entries</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Participants can enter multiple times
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 card-inset cursor-pointer hover:border-chart-2/50 hover:bg-chart-2/5 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.brokerVerificationRequired}
                    onChange={(e) =>
                      handleInputChange('brokerVerificationRequired', e.target.checked)
                    }
                    className="w-5 h-5 mt-0.5 rounded border-border accent-chart-2 focus:ring-chart-2/20"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Require Broker Verification</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Participants must have verified broker account
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 card-inset cursor-pointer hover:border-chart-2/50 hover:bg-chart-2/5 transition-all md:col-span-2">
                  <input
                    type="checkbox"
                    checked={formData.lifetimeWinnerRestriction}
                    onChange={(e) =>
                      handleInputChange('lifetimeWinnerRestriction', e.target.checked)
                    }
                    className="w-5 h-5 mt-0.5 rounded border-border accent-chart-2 focus:ring-chart-2/20"
                  />
                  <div>
                    <p className="font-semibold text-foreground">Lifetime Winner Restriction</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Past winners cannot win again in future giveaways
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Schedule & Status */}
          <div className="card-surface p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-chart-1/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-chart-1/10 transition-colors"></div>
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3 border-b border-border/50 pb-4">
              <Calendar className="text-chart-1" size={24} />
              Schedule & Status
            </h3>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Start Date & Time *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    End Date & Time *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Settings2 size={16} className="text-muted-foreground" />
                  Initial Status
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['Draft', 'Scheduled', 'Live'] as const).map((status) => (
                    <label
                      key={status}
                      className={`flex flex-col gap-2 p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.status === status
                          ? 'bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)] ring-1 ring-primary/20'
                          : 'card-inset hover:border-primary/30 hover:bg-muted/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${formData.status === status ? 'text-primary' : 'text-foreground'}`}>{status}</span>
                        <input
                          type="radio"
                          name="status"
                          value={status}
                          checked={formData.status === status}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="w-4 h-4 accent-primary"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {status === 'Draft' && 'Save silently'}
                        {status === 'Scheduled' && 'Visible but locked'}
                        {status === 'Live' && 'Launch immediately'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Preview Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="card-surface p-0 overflow-hidden shadow-xl shadow-black/5 dark:shadow-black/20 border-primary/10">
              <div className="p-4 border-b border-border/50 bg-muted/30 backdrop-blur-md flex items-center justify-between">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  Live Preview
                </h3>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {formData.banner ? (
                    <div className="w-full h-48 rounded-xl overflow-hidden shadow-inner ring-1 ring-border/50 relative group">
                      <img
                        src={URL.createObjectURL(formData.banner)}
                        alt="Banner preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  ) : (
                    <div className="w-full h-48 rounded-xl bg-muted/50 border border-dashed border-border flex items-center justify-center flex-col gap-2">
                      <Upload className="text-muted-foreground/30" size={32} />
                      <span className="text-sm font-medium text-muted-foreground/50">No Banner Uploaded</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-2xl font-black leading-tight text-foreground line-clamp-2">
                        {formData.name || <span className="text-muted-foreground/30">Giveaway Name...</span>}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          {formData.status}
                        </span>
                        {formData.winners > 1 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-chart-2/10 text-chart-2 border border-chart-2/20">
                            {formData.winners} Winners
                          </span>
                        )}
                      </div>
                    </div>

                    {formData.prize && (
                      <div className="p-3 rounded-lg bg-chart-2/5 border border-chart-2/20 flex items-start gap-3">
                        <Trophy size={20} className="text-chart-2 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-chart-2 uppercase tracking-wider mb-0.5">Prize</p>
                          <p className="text-sm font-bold text-foreground">{formData.prize}</p>
                        </div>
                      </div>
                    )}

                    {formData.description && (
                      <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                        {formData.description}
                      </p>
                    )}

                    {formData.startDate && formData.endDate && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground p-3 rounded-lg card-inset">
                        <Calendar size={16} className="text-primary" />
                        <span className="font-medium text-foreground">
                          {new Date(formData.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(formData.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="card-surface p-6 shadow-xl shadow-primary/5 border-primary/20">
              <button
                onClick={handleCreate}
                disabled={isPending || !isFormValid()}
                className="btn-primary w-full py-4 text-base rounded-xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transform hover:-translate-y-1 transition-all duration-300"
              >
                {isPending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Sparkles size={20} />
                )}
                <span className="font-bold tracking-wide">
                  {isPending ? 'Publishing...' : 'Publish Giveaway'}
                </span>
              </button>
              {!isFormValid() && (
                <p className="text-xs text-center text-muted-foreground mt-3 font-medium">
                  Please fill out all required fields (*)
                </p>
              )}
              {submitError && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm font-medium text-destructive text-center">
                  {submitError}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
