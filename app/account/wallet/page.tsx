"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Wallet, ArrowUpRight, ArrowDownLeft, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { serverGetRewardData } from "@/services/serverApi"
import { useAuth } from "@/components/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

export default function WalletPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true);
  const [rewardData, setRewardData] = useState<any>(null);
  const itemsPerPage = 5

  // Filter transactions based on selected filters
  const filteredTransactions = rewardData?.rewards?.filter((transaction: any) => {
    if (!transaction) return false;
  
    const transactionDate = transaction?.createdAt ? new Date(transaction.createdAt) : null;
    const now = new Date();
  
    // Filtering based on credit/debit type
    if (filter === 'credit' && !transaction?.isEarned) return false;
    if (filter === 'debit' && transaction?.isEarned) return false;
  
    // Filtering based on date range
    if (dateRange === "last7days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      if (transactionDate && transactionDate < sevenDaysAgo) return false;
    }
  
    if (dateRange === "last30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      if (transactionDate && transactionDate < thirtyDaysAgo) return false;
    }
  
    return true;
  }) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, dateRange]);

  const getRewardData = async () => {
    try {
      setLoading(true);
      const res = await serverGetRewardData(String(user?._id?.toString()));
      setRewardData(res?.data);
    } catch (err) {
      console.error("Error fetching reward data:", err);
      setRewardData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?._id) {
      getRewardData();
    }
  }, [user]);

  // Component for transaction table - reused across tabs
  const TransactionTable = () => {
    if (loading) {
      return <TableSkeleton />;
    }
    
    if (paginatedTransactions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No transactions found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {filter !== "all"
              ? `You don't have any ${filter} transactions in the selected time period.`
              : "You don't have any transactions in the selected time period."}
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction: any) => (
              <TableRow key={transaction?._id}>
                <TableCell className="font-medium">
                  {new Date(transaction?.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>₹{transaction?.reward}</TableCell>
                <TableCell>
                  {transaction?.isEarned ? (
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
    );
  };

  // Skeleton loaders
  const TableSkeleton = () => (
    <div className="space-y-3">
      <div className="flex space-x-4 h-10">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/4" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex space-x-4 h-12">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-1/3" />
        </div>
      ))}
    </div>
  );

  const BalanceSkeleton = () => (
    <div className="flex flex-col items-center justify-center p-6">
      <Skeleton className="h-24 w-24 rounded-full mb-4" />
      <Skeleton className="h-8 w-28 mb-2" />
      <Skeleton className="h-4 w-40 mb-6" />
      <div className="grid grid-cols-2 gap-4 w-full">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );

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
            {loading ? (
              <BalanceSkeleton />
            ) : (
              <div className="flex flex-col items-center justify-center p-6">
                <div className="flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 mb-4">
                  <Wallet className="h-12 w-12 text-primary" />
                </div>
                <div className="text-3xl font-bold">₹{rewardData?.remainingReward || 0}</div>
                <p className="text-sm text-muted-foreground mt-2">Available Balance</p>

                <div className="grid grid-cols-2 gap-4 w-full mt-6">
                  <Button className="bg-green-100 text-green-800">
                    ₹{rewardData?.totalEarnedReward || 0}
                  </Button>
                  <Button className="bg-red-100 text-red-800 hover:bg-red-100">
                    ₹{rewardData?.totalRedeemedReward || 0}
                  </Button>
                </div>
              </div>
            )}
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

              {/* Using the same TransactionTable component for all tabs */}
              <TabsContent value="all" className="mt-0">
                <TransactionTable />
              </TabsContent>

              <TabsContent value="credit" className="mt-0">
                <TransactionTable />
              </TabsContent>

              <TabsContent value="debit" className="mt-0">
                <TransactionTable />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}