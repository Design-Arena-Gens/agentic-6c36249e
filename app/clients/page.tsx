"use client"
import { useState } from 'react'
import { listClients, createClient } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function ClientsPage() {
  const [clients, setClients] = useState(listClients())
  const [form, setForm] = useState({ name: '', industry: '', contactName: '', contactEmail: '' })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) return
    const created = createClient(form)
    setClients([created, ...clients])
    setForm({ name: '', industry: '', contactName: '', contactEmail: '' })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>New Client</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="contactName">Contact Name</Label>
              <Input id="contactName" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Add Client</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Clients</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Industry</TH>
                <TH>Contact</TH>
                <TH>Email</TH>
              </TR>
            </THead>
            <TBody>
              {clients.map(c => (
                <TR key={c.id}>
                  <TD>{c.name}</TD>
                  <TD>{c.industry}</TD>
                  <TD>{c.contactName}</TD>
                  <TD>{c.contactEmail}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
