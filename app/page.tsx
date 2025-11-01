"use client"
import { useMemo } from 'react'
import { listClients, listProjects, listSOWs, listCRs, listInvoices, listRevenue, listTimeEntries } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts'

export default function DashboardPage() {
  const clients = listClients()
  const projects = listProjects()
  const sows = listSOWs()
  const crs = listCRs()
  const invoices = listInvoices()
  const revenue = listRevenue()
  const time = listTimeEntries()

  const kpis = useMemo(() => {
    const pipeline = sows.reduce((s, x) => s + x.amount, 0) + crs.filter(c => c.status === 'Approved').reduce((s, x) => s + x.amount, 0)
    const invTotal = invoices.reduce((s, x) => s + x.amount, 0)
    const invPaid = invoices.filter(i => i.status === 'Paid').reduce((s, x) => s + x.amount, 0)
    const ar = invTotal - invPaid
    const cost = time.reduce((s, t) => s + t.hours * t.costRate, 0)
    const rev = revenue.reduce((s, r) => s + r.amount, 0)
    const profit = rev - cost
    const margin = rev > 0 ? (profit / rev) * 100 : 0
    return { pipeline, ar, rev, cost, profit, margin }
  }, [sows, crs, invoices, revenue, time])

  const revByDate = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of revenue) map[r.date] = (map[r.date] ?? 0) + r.amount
    return Object.entries(map).sort(([a],[b]) => a.localeCompare(b)).map(([date, amount]) => ({ date, amount }))
  }, [revenue])

  const hoursByProject = useMemo(() => {
    const map: Record<string, number> = {}
    for (const t of time) map[t.projectId] = (map[t.projectId] ?? 0) + t.hours
    return projects.map(p => ({ name: p.name, hours: map[p.id] ?? 0 }))
  }, [time, projects])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Kpi title="Pipeline" value={kpis.pipeline} prefix="$" />
        <Kpi title="Revenue" value={kpis.rev} prefix="$" />
        <Kpi title="Outstanding AR" value={kpis.ar} prefix="$" />
        <Kpi title="Delivery Cost" value={kpis.cost} prefix="$" />
        <Kpi title="Profit" value={kpis.profit} prefix="$" />
        <Kpi title="Margin" value={kpis.margin} suffix="%" decimals={1} />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Revenue Over Time</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Hours by Project</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hoursByProject}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" hide={hoursByProject.length > 5} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Invoices</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Number</TH>
                <TH>Project</TH>
                <TH>Date</TH>
                <TH>Status</TH>
                <TH>Amount</TH>
              </TR>
            </THead>
            <TBody>
              {invoices.slice(0, 8).map((inv) => {
                const proj = projects.find(p => p.id === inv.projectId)
                return (
                  <TR key={inv.id}>
                    <TD>{inv.invoiceNumber}</TD>
                    <TD>{proj?.name ?? 'Unknown'}</TD>
                    <TD>{inv.date}</TD>
                    <TD>{inv.status}</TD>
                    <TD>${inv.amount.toLocaleString()}</TD>
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

function Kpi({ title, value, prefix, suffix, decimals = 0 }: { title: string; value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const formatted = `${prefix ?? ''}${value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${suffix ?? ''}`
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{formatted}</div>
      </CardContent>
    </Card>
  )
}
