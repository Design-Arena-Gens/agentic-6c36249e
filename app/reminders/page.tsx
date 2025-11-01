"use client"
import { useState } from 'react'
import { listReminders, createReminder, listProjects } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'

export default function RemindersPage() {
  const [reminders, setReminders] = useState(listReminders())
  const projects = listProjects()
  const [form, setForm] = useState({
    title: '',
    dueDate: new Date().toISOString().slice(0, 10),
    entityType: 'Project' as const,
    entityId: projects[0]?.id ?? '',
    notes: '',
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title) return
    const created = createReminder(form)
    setReminders([created, ...reminders])
    setForm({ ...form, title: '' })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>New Reminder</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Due Date</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div>
              <Label>Entity</Label>
              <Select value={form.entityType} onChange={(e) => setForm({ ...form, entityType: e.target.value as any })}>
                <option value="Project">Project</option>
                <option value="Invoice">Invoice</option>
                <option value="SOW">SOW</option>
                <option value="CR">CR</option>
              </Select>
            </div>
            <div>
              <Label>Project</Label>
              <Select value={form.entityId} onChange={(e) => setForm({ ...form, entityId: e.target.value })}>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            </div>
            <div className="md:col-span-3">
              <Label>Notes</Label>
              <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="md:col-span-3"><Button type="submit">Add Reminder</Button></div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Reminders</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Title</TH>
                <TH>Due</TH>
                <TH>Entity</TH>
                <TH>Notes</TH>
              </TR>
            </THead>
            <TBody>
              {reminders.map(r => (
                <TR key={r.id}>
                  <TD>{r.title}</TD>
                  <TD>{r.dueDate}</TD>
                  <TD>{r.entityType}</TD>
                  <TD>{r.notes}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
