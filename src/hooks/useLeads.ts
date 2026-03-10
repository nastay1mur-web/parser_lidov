import { useState, useMemo, useCallback } from 'react'
import type { Lead, LeadStatus, LeadSource } from '@/types/lead'
import { MOCK_LEADS } from '@/lib/mock-leads'

const STORAGE_KEY = 'leads-data'
const SETTINGS_KEY = 'lead-settings'

function loadLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : MOCK_LEADS
  } catch {
    return MOCK_LEADS
  }
}

function saveLeads(leads: Lead[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
}

export type FilterSource = LeadSource | 'all'

export function useLeads(filterSource: FilterSource = 'all') {
  const [leads, setLeads] = useState<Lead[]>(loadLeads)

  const filtered = useMemo(() => {
    const base = filterSource === 'all'
      ? leads
      : leads.filter(l => l.source === filterSource)
    return base.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [leads, filterSource])

  const hotLeads = useMemo(
    () => leads.filter(l => l.isHot || l.status === 'contacted' || l.status === 'replied'),
    [leads],
  )

  const newCount = useMemo(
    () => leads.filter(l => l.status === 'new').length,
    [leads],
  )

  const updateStatus = useCallback((id: string, status: LeadStatus) => {
    setLeads(prev => {
      const next = prev.map(l => l.id === id ? { ...l, status } : l)
      saveLeads(next)
      return next
    })
  }, [])

  const updateNote = useCallback((id: string, note: string) => {
    setLeads(prev => {
      const next = prev.map(l => l.id === id ? { ...l, note } : l)
      saveLeads(next)
      return next
    })
  }, [])

  const markViewed = useCallback((id: string) => {
    setLeads(prev => {
      const lead = prev.find(l => l.id === id)
      if (!lead || lead.status !== 'new') return prev
      const next = prev.map(l => l.id === id ? { ...l, status: 'viewed' as LeadStatus } : l)
      saveLeads(next)
      return next
    })
  }, [])

  const toggleHot = useCallback((id: string) => {
    setLeads(prev => {
      const next = prev.map(l => l.id === id ? { ...l, isHot: !l.isHot } : l)
      saveLeads(next)
      return next
    })
  }, [])

  const getById = useCallback((id: string) => leads.find(l => l.id === id), [leads])

  return { leads: filtered, hotLeads, newCount, updateStatus, updateNote, markViewed, toggleHot, getById }
}

// ── Настройки ──────────────────────────────────────────────────

export interface LeadSettings {
  specialties: string[]
  keywords: string[]
  stopWords: string[]
  sources: LeadSource[]
}

const DEFAULT_SETTINGS: LeadSettings = {
  specialties: [],
  keywords: [],
  stopWords: [],
  sources: ['telegram', 'vk', 'forum'],
}

export function loadSettings(): LeadSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: LeadSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
