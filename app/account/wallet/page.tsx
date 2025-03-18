"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Wallet, ArrowUpRight, ArrowDownLeft, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Mock wallet data
const walletBalance = 500

// Mock transaction history
const transactions = [
  {
    id: "TXN12345",
    date: "2024-03-10",
    type: "credit",
    amount: 200,
    description: "Cashback from order #ORD12345",
    status: "completed",
  },
  {
    id: "TXN12346",
    date: "2024-03-05",
    type: "debit",
    amount: 150,
    description: "Used for order #ORD12346",
    status: "completed",
  },
  {
    id: "TXN12347",
    date: "2024-02-28",
    type: "credit",
    amount: 100,
    description: "Referral bonus",
    status: "completed",
  },
  {
    id: "TXN12348",
    date: "2024-02-20",
    type: "credit",
    amount: 50,
    description: "Welcome bonus",
    status: "completed",
  },
  {
    id: "TXN12349",
    date: "2024-02-15",
    type: "debit",
    amount: 200,
    description: "Used for order #ORD12347",
    status: "completed",
  },
  {
    id: "TXN12350",
    date: "2024-02-10",
    type: "credit",
    amount: 500,
    description: "Added via UPI payment",
    status: "completed",
  },
]

export default function WalletPage() {
  const [filter, setFilter] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter transactions based on selected filters
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter !== "all" && transaction.type !== filter) {
      return false
    }

    if (dateRange === "last7days") {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return new Date(transaction.date) >= sevenDaysAgo
    }

    if (dateRange === "last30days") {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return new Date(transaction.date) >= thirtyDaysAgo
    }

    return true
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="w-full px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Wallet</h1>
        <Link href="/account">
          <Button variant="outline">Back to Account</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Wallet Balance Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6">
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 mb-4">
                <Wallet className="h-12 w-12 text-primary" />
              </div>
              <div className="text-3xl font-bold">₹{walletBalance}</div>
              <p className="text-sm text-muted-foreground mt-2">Available Balance</p>

              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                <Button>Add Money</Button>
                <Button variant="outline">Withdraw</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => setFilter("all")}>
                    All
                  </TabsTrigger>
                  <TabsTrigger value="credit" onClick={() => setFilter("credit")}>
                    Credits
                  </TabsTrigger>
                  <TabsTrigger value="debit" onClick={() => setFilter("debit")}>
                    Debits
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="last7days">Last 7 Days</SelectItem>
                      <SelectItem value="last30days">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="all" className="mt-0">
                {paginatedTransactions.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Type</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              {new Date(transaction.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>₹{transaction.amount}</TableCell>
                            <TableCell>
                              {transaction.type === "credit" ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  <ArrowDownLeft className="mr-1 h-3 w-3" />
                                  Credit
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                                  <ArrowUpRight className="mr-1 h-3 w-3" />
                                  Debit
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between px-4 py-2 border-t">
                        <div className="text-sm text-muted-foreground">
                          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                          {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{" "}
                          {filteredTransactions.length} transactions
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No transactions found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {filter !== "all"
                        ? `You don't have any ${filter} transactions in the selected time period.`
                        : "You don't have any transactions in the selected time period."}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="credit" className="mt-0">
                {/* Credit transactions will be shown here */}
              </TabsContent>

              <TabsContent value="debit" className="mt-0">
                {/* Debit transactions will be shown here */}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}