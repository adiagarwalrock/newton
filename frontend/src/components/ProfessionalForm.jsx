import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createProfessional } from "@/lib/api"
import { AlertCircle, Loader2, PlusCircle } from "lucide-react"
import { useState } from 'react'

const INITIAL_FORM_DATA = {
  full_name: '',
  email: '',
  phone: '',
  company_name: '',
  job_title: '',
  source: 'direct'
}

const INPUT_CLASS = "border-slate-200 focus:border-slate-400 focus:ring-slate-400 rounded-xl h-11"

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const PHONE_REGEX = /^\+?[0-9]{1,4}?[-.\s]?\(?[0-9]{1,3}?\)?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/

const validateEmail = (email) => {
  if (!email) return null
  return EMAIL_REGEX.test(email) ? null : "Please enter a valid email address"
}

const validatePhone = (phone) => {
  if (!phone) return null
  return PHONE_REGEX.test(phone) ? null : "Please enter a valid phone number (e.g., +1 234 567 8900)"
}

const FormField = ({ id, label, optional, error, ...inputProps }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-slate-700">
      {label}
      {optional && <span className="text-slate-400 font-normal ml-1">(optional)</span>}
    </Label>
    <Input 
      id={id} 
      name={id} 
      className={`${INPUT_CLASS} ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''}`} 
      {...inputProps} 
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)

const formatApiErrors = (response) => {
  if (!response?.data) return "Failed to create professional. Please check the network."
  
  const errors = response.data
  if (typeof errors !== 'object') return "Failed to create professional."
  
  return Object.entries(errors)
    .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(' ') : val}`)
    .join('\n')
}

const ProfessionalForm = ({ onSuccess }) => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: null })
    }
  }

  const handleSourceChange = (value) => setFormData({ ...formData, source: value })

  const validateForm = () => {
    const errors = {}
    
    if (!formData.email && !formData.phone) {
      setError("Either Email or Phone is required.")
      return false
    }

    const emailError = validateEmail(formData.email)
    if (emailError) errors.email = emailError

    const phoneError = validatePhone(formData.phone)
    if (phoneError) errors.phone = phoneError

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})

    if (!validateForm()) return

    setLoading(true)
    try {
      await createProfessional(formData)
      setOpen(false)
      setFormData(INITIAL_FORM_DATA)
      onSuccess?.()
    } catch (err) {
      setError(formatApiErrors(err.response))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all duration-200 font-medium px-5 py-2.5 rounded-xl">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Professional
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden border-0 shadow-2xl bg-white rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <DialogTitle className="text-xl font-semibold text-slate-800">Add New Professional</DialogTitle>
          <DialogDescription className="text-slate-500 mt-1">
            Fill in the details below to create a new professional profile.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl border border-red-100 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <pre className="whitespace-pre-wrap font-sans text-sm">{error}</pre>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormField id="full_name" label="Full Name" value={formData.full_name} onChange={handleChange} required placeholder="Jane Doe" />
            <div className="space-y-2">
              <Label htmlFor="source" className="text-sm font-medium text-slate-700">Source</Label>
              <Select value={formData.source} onValueChange={handleSourceChange}>
                <SelectTrigger className={INPUT_CLASS}>
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  <SelectItem value="direct" className="rounded-lg">Direct</SelectItem>
                  <SelectItem value="partner" className="rounded-lg">Partner</SelectItem>
                  <SelectItem value="internal" className="rounded-lg">Internal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField 
              id="email" 
              label="Email" 
              optional 
              type="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="jane@example.com"
              error={fieldErrors.email}
            />
            <FormField 
              id="phone" 
              label="Phone" 
              optional 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="+1 234 567 8900"
              error={fieldErrors.phone}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField id="company_name" label="Company" value={formData.company_name} onChange={handleChange} required placeholder="Acme Inc." />
            <FormField id="job_title" label="Job Title" value={formData.job_title} onChange={handleChange} required placeholder="Software Engineer" />
          </div>

          <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
            At least one of Email or Phone is required to create a profile.
          </p>

          <DialogFooter className="pt-4 gap-3 sm:gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 px-5">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-lg shadow-slate-900/20 px-6">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProfessionalForm
