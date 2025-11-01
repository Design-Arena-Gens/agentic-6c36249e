"use client"
import { useMemo, useState } from 'react'
import { listSOWs, createSOW, listProjects } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'

export default function SOWsPage() {
  const [sows, setSows] = useState(listSOWs())
  const projects = listProjects()
  const [form, setForm] = useState({
    projectId: projects[0]?.id ?? '',
    title: '',
    amount: 10000,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
  })

  const totals = useMemo(() => {
    return sows.reduce((s, x) => s + x.amount, 0)
  }, [sows])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.projectId) return
    const created = createSOW({ ...form, amount: Number(form.amount) })
    setSows([created, ...sows])
    setForm({ ...form, title: '' })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>New SOW</CardTitle></CardHeader>
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
            <div>
              <Label>Amount</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
            <div className="md:col-span-3"><Button type="submit">Add SOW</Button></div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>SOWs (Total ${totals.toLocaleString()})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Project</TH>
                <TH>Title</TH>
                <TH>Amount</TH>
                <TH>Start</TH>
                <TH>End</TH>
              </TR>
            </THead>
            <TBody>
              {sows.map(s => {
                const proj = projects.find(p => p.id === s.projectId)
                return (
                  <TR key={s.id}>
                    <TD>{proj?.name}</TD>
                    <TD>{s.title}</TD>
                    <TD>${s.amount.toLocaleString()}</TD>
                    <TD>{s.startDate}</TD>
                    <TD>{s.endDate}</TD>
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
