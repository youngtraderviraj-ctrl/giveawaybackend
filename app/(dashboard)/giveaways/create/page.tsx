'use client'

import { useState, useTransition } from 'react'
import { ChevronRight, ChevronLeft, Upload, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createGiveaway } from '../actions'

type FormStep = 'basic' | 'rules' | 'schedule' | 'status'

interface FormData {
  name: string
  prize: string
  description: string
  banner: File | null
  winners: number
  multipleEntries: boolean
  emailVerificationRequired: boolean
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
  const [currentStep, setCurrentStep] = useState<FormStep>('basic')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    prize: '',
    description: '',
    banner: null,
    winners: 1,
    multipleEntries: true,
    emailVerificationRequired: true,
    lifetimeWinnerRestriction: true,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    status: 'Draft',
  })

  const steps: FormStep[] = ['basic', 'rules', 'schedule', 'status']
  const stepLabels: Record<FormStep, string> = {
    basic: 'Basic Info',
    rules: 'Rules',
    schedule: 'Schedule',
    status: 'Status',
  }

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

  const goToStep = (step: FormStep) => {
    setCurrentStep(step)
  }

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const isStepComplete = (step: FormStep): boolean => {
    switch (step) {
      case 'basic':
        return !!(formData.name && formData.prize && formData.description)
      case 'rules':
        return true
      case 'schedule':
        return !!(formData.startDate && formData.endDate)
      case 'status':
        return !!formData.status
      default:
        return false
    }
  }

  const currentIndex = steps.indexOf(currentStep)

  const toIso = (date: string, time: string) =>
    date ? new Date(`${date}T${time || '00:00'}`).toISOString() : ''

  const handleCreate = () => {
    setSubmitError('')
    startTransition(async () => {
      const result = await createGiveaway({
        name: formData.name,
        prize: formData.prize,
        description: formData.description,
        winners: formData.winners,
        multipleEntries: formData.multipleEntries,
        emailVerificationRequired: formData.emailVerificationRequired,
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
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/giveaways"
          className="text-sky-600 dark:text-sky-400 hover:text-emerald-500 text-sm font-medium mb-4 inline-flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          Back to Giveaways
        </Link>
        <h1 className="text-4xl font-extrabold"><span className="text-gradient">Create Giveaway</span></h1>
        <p className="text-muted mt-2">Follow the steps below to create a new giveaway campaign</p>
      </div>

      {/* Progress Steps */}
      <div className="flex gap-4">
        {steps.map((step, idx) => (
          <div key={step} className="flex items-center gap-3">
            <button
              onClick={() => goToStep(step)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                step === currentStep
                  ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-md shadow-sky-500/20'
                  : isStepComplete(step)
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/60 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10'
              }`}
            >
              <span className="text-sm">{idx + 1}</span>
              <span className="hidden sm:inline">{stepLabels[step]}</span>
            </button>
            {idx < steps.length - 1 && (
              <div className="hidden sm:block w-8 h-0.5 bg-slate-200 dark:bg-white/10" />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="card-surface p-8">
            {/* Basic Info Step */}
            {currentStep === 'basic' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Giveaway Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., iPhone 15 Pro Launch Giveaway"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Prize *</label>
                  <input
                    type="text"
                    placeholder="e.g., iPhone 15 Pro Max 256GB"
                    value={formData.prize}
                    onChange={(e) => handleInputChange('prize', e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your giveaway..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="input-field resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Banner Image
                  </label>
                  {formData.banner ? (
                    <div className="flex items-center justify-between px-4 py-3 card-inset">
                      <span className="text-sm text-muted">{formData.banner.name}</span>
                      <button
                        onClick={() => handleInputChange('banner', null)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 px-4 py-6 border border-dashed border-slate-300 dark:border-white/15 rounded-xl cursor-pointer hover:border-sky-400/60 bg-slate-50/60 dark:bg-white/5 transition-colors">
                      <Upload size={20} className="text-slate-400" />
                      <span className="text-sm text-muted">Upload banner image</span>
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
            )}

            {/* Rules Step */}
            {currentStep === 'rules' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Number of Winners *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.winners}
                    onChange={(e) =>
                      handleInputChange('winners', Math.max(1, parseInt(e.target.value)))
                    }
                    className="input-field"
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 card-inset cursor-pointer hover:border-sky-400/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.multipleEntries}
                      onChange={(e) =>
                        handleInputChange('multipleEntries', e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 accent-sky-500"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Allow Multiple Entries</p>
                      <p className="text-xs text-muted">
                        Participants can enter multiple times
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 card-inset cursor-pointer hover:border-sky-400/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.emailVerificationRequired}
                      onChange={(e) =>
                        handleInputChange('emailVerificationRequired', e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 accent-sky-500"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Email Verification Required</p>
                      <p className="text-xs text-muted">
                        Participants must verify their email
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 card-inset cursor-pointer hover:border-sky-400/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.lifetimeWinnerRestriction}
                      onChange={(e) =>
                        handleInputChange('lifetimeWinnerRestriction', e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300 accent-sky-500"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Lifetime Winner Restriction</p>
                      <p className="text-xs text-muted">
                        Winners cannot win again in future giveaways
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Schedule Step */}
            {currentStep === 'schedule' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Start Date & Time *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    End Date & Time *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
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
            )}

            {/* Status Step */}
            {currentStep === 'status' && (
              <div className="space-y-6">
                <p className="text-sm text-muted">Choose the initial status for this giveaway</p>

                <div className="space-y-3">
                  {(['Draft', 'Scheduled', 'Live'] as const).map((status) => (
                    <label
                      key={status}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.status === status
                          ? 'bg-sky-500/15 border-sky-500/50 text-sky-600 dark:text-sky-300'
                          : 'card-inset text-slate-500 dark:text-slate-400 hover:border-sky-400/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={formData.status === status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-semibold">{status}</p>
                        <p className="text-xs opacity-75">
                          {status === 'Draft' &&
                            'Save as draft - not visible to participants'}
                          {status === 'Scheduled' &&
                            'Schedule for a future date - participants can see it'}
                          {status === 'Live' && 'Launch immediately - participants can enter now'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 pt-8 border-t border-slate-200/70 dark:border-white/10">
              <button
                onClick={prevStep}
                disabled={currentIndex === 0}
                className="btn-ghost px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
                <span>Back</span>
              </button>

              {currentIndex < steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  disabled={!isStepComplete(currentStep)}
                  className="btn-primary px-6"
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleCreate}
                  disabled={isPending || !isStepComplete('basic')}
                  className="btn-primary flex-1 px-6"
                >
                  {isPending ? <Loader2 size={18} className="animate-spin" /> : null}
                  <span>{isPending ? 'Creating…' : 'Create Giveaway'}</span>
                </button>
              )}
            </div>
            {submitError && (
              <p className="mt-4 text-sm font-medium text-rose-500">{submitError}</p>
            )}
          </div>
        </div>

        {/* Preview Sidebar */}
        <div className="card-surface p-6 h-fit">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Preview</h3>

          <div className="space-y-4">
            {formData.banner && (
              <div className="w-full h-40 rounded-xl card-inset overflow-hidden">
                <img
                  src={URL.createObjectURL(formData.banner)}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {formData.name && (
              <div>
                <p className="text-xs text-muted font-medium mb-1">Giveaway Name</p>
                <p className="font-semibold text-slate-900 dark:text-white">{formData.name}</p>
              </div>
            )}

            {formData.prize && (
              <div>
                <p className="text-xs text-muted font-medium mb-1">Prize</p>
                <p className="text-sm text-slate-900 dark:text-white">{formData.prize}</p>
              </div>
            )}

            {formData.description && (
              <div>
                <p className="text-xs text-muted font-medium mb-1">Description</p>
                <p className="text-sm text-muted line-clamp-3">{formData.description}</p>
              </div>
            )}

            {formData.winners && (
              <div>
                <p className="text-xs text-muted font-medium mb-1">Winners</p>
                <p className="text-sm text-slate-900 dark:text-white">{formData.winners}</p>
              </div>
            )}

            {formData.startDate && formData.endDate && (
              <div>
                <p className="text-xs text-muted font-medium mb-1">Duration</p>
                <p className="text-sm text-slate-900 dark:text-white">
                  {new Date(formData.startDate).toLocaleDateString()} to{' '}
                  {new Date(formData.endDate).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200/70 dark:border-white/10">
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                  formData.status === 'Live'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
                    : formData.status === 'Scheduled'
                    ? 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/30'
                    : 'bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30'
                }`}
              >
                {formData.status}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
