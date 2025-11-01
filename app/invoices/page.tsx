"use client"
import { useMemo, useState } from 'react'
import { listInvoices, createInvoice, updateInvoice, listProjects } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(listInvoices())
  const projects = listProjects()
  const [form, setForm] = useState({
    projectId: projects[0]?.id ?? '',
    invoiceNumber: `INV-${1000 + invoices.length}`,
    date: new Date().toISOString().slice(0, 10),
    dueDate: new Date().toISOString().slice(0, 10),
    amount: 10000,
    status: 'Draft' as const,
  })

  const totals = useMemo(() => {
    const total = invoices.reduce((s, x) => s + x.amount, 0)
    const paid = invoices.filter(i => i.status === 'Paid').reduce((s, x) => s + x.amount, 0)
    return { total, paid, ar: total - paid }
  }, [invoices])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.invoiceNumber || !form.projectId) return
    const created = createInvoice({ ...form, amount: Number(form.amount) })
    setInvoices([created, ...invoices])
    setForm({ ...form, invoiceNumber: `INV-${1000 + invoices.length + 1}` })
  }

  function markPaid(id: string) {
    const inv = invoices.find(i => i.id === id)
    if (!inv) return
    const updated = updateInvoice({ ...inv, status: 'Paid' })
    setInvoices(invoices.map(i => (i.id === id ? updated : i)))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>New Invoice</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <div>
              <Label>Project</Label>
              <Select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
            </div>
            <div>
              <Label>Number</Label>
              <Input value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} />
            </div>
            <div>
              <Label>Amount</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <Label>Due</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Paid">Paid</option>
              </Select>
            </div>
            <div className="md:col-span-3"><Button type="submit">Create Invoice</Button></div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Invoices (AR ${totals.ar.toLocaleString()})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Number</TH>
                <TH>Project</TH>
                <TH>Date</TH>
                <TH>Due</TH>
                <TH>Status</TH>
                <TH>Amount</TH>
                <TH></TH>
              </TR>
            </THead>
            <TBody>
              {invoices.map(inv => {
                const proj = projects.find(p => p.id === inv.projectId)
                return (
                  <TR key={inv.id}>
                    <TD>{inv.invoiceNumber}</TD>
                    <TD>{proj?.name}</TD>
                    <TD>{inv.date}</TD>
                    <TD>{inv.dueDate}</TD>
                    <TD>{inv.status}</TD>
                    <TD>${inv.amount.toLocaleString()}</TD>
                    <TD>
                      {inv.status !== 'Paid' && (
                        <Button variant="outline" onClick={() => markPaid(inv.id)}>Mark Paid</Button>
                      )}
                    </TD>
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
