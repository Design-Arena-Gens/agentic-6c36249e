"use client"
import { useMemo, useState } from 'react'
import { listCRs, createCR, listProjects } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'

export default function CRsPage() {
  const [crs, setCRs] = useState(listCRs())
  const projects = listProjects()
  const [form, setForm] = useState({
    projectId: projects[0]?.id ?? '',
    title: '',
    description: '',
    amount: 5000,
    status: 'Proposed' as const,
  })

  const totals = useMemo(() => {
    return {
      proposed: crs.filter(c => c.status === 'Proposed').reduce((s, x) => s + x.amount, 0),
      approved: crs.filter(c => c.status === 'Approved').reduce((s, x) => s + x.amount, 0),
      rejected: crs.filter(c => c.status === 'Rejected').reduce((s, x) => s + x.amount, 0),
    }
  }, [crs])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.projectId) return
    const created = createCR({ ...form, amount: Number(form.amount) })
    setCRs([created, ...crs])
    setForm({ ...form, title: '' })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>New Change Request</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div>
              <Label>Project</Label>
              <Select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="md:col-span-3">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label>Amount</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                <option value="Proposed">Proposed</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Select>
            </div>
            <div className="md:col-span-3"><Button type="submit">Add CR</Button></div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Change Requests (Approved ${totals.approved.toLocaleString()})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Project</TH>
                <TH>Title</TH>
                <TH>Status</TH>
                <TH>Amount</TH>
              </TR>
            </THead>
            <TBody>
              {crs.map(s => {
                const proj = projects.find(p => p.id === s.projectId)
                return (
                  <TR key={s.id}>
                    <TD>{proj?.name}</TD>
                    <TD>{s.title}</TD>
                    <TD>{s.status}</TD>
                    <TD>${s.amount.toLocaleString()}</TD>
                  </TR>
                )
              })}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
