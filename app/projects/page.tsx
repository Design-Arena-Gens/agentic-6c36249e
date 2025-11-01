"use client"
import { useState } from 'react'
import { listProjects, createProject, listClients } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'

export default function ProjectsPage() {
  const [projects, setProjects] = useState(listProjects())
  const clients = listClients()
  const [form, setForm] = useState({
    clientId: clients[0]?.id ?? '',
    name: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    hourlyRate: 180,
    budgetHours: 100,
    status: 'Active' as const,
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.clientId) return
    const created = createProject({ ...form, hourlyRate: Number(form.hourlyRate), budgetHours: Number(form.budgetHours) })
    setProjects([created, ...projects])
    setForm({ ...form, name: '' })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>New Project</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div>
              <Label>Client</Label>
              <Select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Project Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <Label>Hourly Rate</Label>
              <Input type="number" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Budget Hours</Label>
              <Input type="number" value={form.budgetHours} onChange={(e) => setForm({ ...form, budgetHours: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Button type="submit">Add Project</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Projects</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Project</TH>
                <TH>Client</TH>
                <TH>Status</TH>
                <TH>Rate</TH>
                <TH>Budget Hours</TH>
              </TR>
            </THead>
            <TBody>
              {projects.map(p => {
                const c = clients.find(x => x.id === p.clientId)
                return (
                  <TR key={p.id}>
                    <TD>{p.name}</TD>
                    <TD>{c?.name}</TD>
                    <TD>{p.status}</TD>
                    <TD>${p.hourlyRate}</TD>
                    <TD>{p.budgetHours}</TD>
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
