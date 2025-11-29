import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mockClients } from "@/data/mockClients";
import { mockTransactions, Transaction } from "@/data/mockTransactions";
import { ChevronRight, Search, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Matching = () => {
  const { id } = useParams();
  const client = mockClients.find((c) => c.id === id);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>(
    mockTransactions[2]
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!client) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Client not found
          </h1>
          <Link to="/">
            <Button variant="outline">Back to clients</Button>
          </Link>
        </div>
      </div>
    );
  }

  const matchedCount = mockTransactions.filter((t) => t.status === "matched").length;
  const totalCount = mockTransactions.length;

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unmatched" && transaction.status === "unmatched") ||
      (statusFilter === "suggestion" && transaction.status === "suggestion") ||
      (statusFilter === "matched" && transaction.status === "matched");

    const matchesSearch =
      searchQuery === "" ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toString().includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "matched":
        return (
          <Badge className="bg-success/10 text-success hover:bg-success/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Matched
          </Badge>
        );
      case "suggestion":
        return (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            <HelpCircle className="h-3 w-3 mr-1" />
            Suggestion
          </Badge>
        );
      case "unmatched":
        return (
          <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            Unmatched
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar with breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="px-8 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Clients</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/clients/${id}`}>{client.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Matching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main header */}
      <header className="border-b border-border bg-card">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Matching – {client.name}
              </h1>
              <p className="text-muted-foreground">
                Match bank transactions with receipts
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <Select defaultValue="march-2026">
                  <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value="march-2026">March 2026</SelectItem>
                    <SelectItem value="february-2026">February 2026</SelectItem>
                    <SelectItem value="january-2026">January 2026</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  {matchedCount} of {totalCount} transactions matched
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content - two panels */}
      <main className="px-8 py-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Left panel - Transaction list */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Bank transactions
              </h2>

              {/* Filter bar */}
              <div className="flex gap-3 mb-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px] bg-card">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unmatched">Unmatched</SelectItem>
                    <SelectItem value="suggestion">With suggestion</SelectItem>
                    <SelectItem value="matched">Matched</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by description or amount…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card"
                  />
                </div>
              </div>
            </div>

            {/* Transaction table */}
            <Card className="bg-card border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className={`cursor-pointer border-border ${
                        selectedTransaction.id === transaction.id
                          ? "bg-secondary/50"
                          : "hover:bg-secondary/30"
                      }`}
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <TableCell className="font-medium">
                        {new Date(transaction.date).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="font-semibold">
                        €{transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {transaction.description}
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Right panel - Match details */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Match details
            </h2>

            {/* Selected transaction details */}
            <Card className="bg-card border-border mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Transaction details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <span className="text-sm font-medium">
                    {new Date(selectedTransaction.date).toLocaleDateString(
                      "de-DE",
                      { day: "2-digit", month: "2-digit", year: "numeric" }
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="text-sm font-semibold">
                    €{selectedTransaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Description:
                  </span>
                  <span className="text-sm font-medium text-right max-w-[200px]">
                    {selectedTransaction.description}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
              </CardContent>
            </Card>

            {/* Suggested receipt */}
            {selectedTransaction.suggestedReceipt && (
              <Card className="bg-card border-border mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">Suggested receipt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Supplier:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedTransaction.suggestedReceipt.supplier}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Date:</span>
                      <span className="text-sm font-medium">
                        {new Date(
                          selectedTransaction.suggestedReceipt.date
                        ).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Amount:
                      </span>
                      <span className="text-sm font-semibold">
                        €{selectedTransaction.suggestedReceipt.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">VAT:</span>
                      <span className="text-sm font-medium">
                        €{selectedTransaction.suggestedReceipt.vat.toFixed(2)}
                      </span>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-2">
                        Description:
                      </p>
                      <p className="text-sm">
                        {selectedTransaction.suggestedReceipt.description}
                      </p>
                    </div>
                    <div className="pt-2">
                      <div className="h-24 bg-secondary/20 rounded-md flex items-center justify-center border border-border">
                        <span className="text-xs text-muted-foreground">
                          Receipt preview placeholder
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2">
                    <Button className="w-full">Confirm match</Button>
                    <Button variant="outline" className="w-full">
                      Change receipt
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" className="flex-1 text-xs">
                        Mark as cash payment
                      </Button>
                      <Button variant="ghost" className="flex-1 text-xs">
                        Mark as not relevant
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No suggested receipt */}
            {!selectedTransaction.suggestedReceipt && (
              <Card className="bg-card border-border mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">No suggested receipt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    No receipt suggestion found for this transaction.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Select receipt manually
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" className="flex-1 text-xs">
                        Mark as cash payment
                      </Button>
                      <Button variant="ghost" className="flex-1 text-xs">
                        Mark as not relevant
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Other available receipts */}
            {selectedTransaction.availableReceipts &&
              selectedTransaction.availableReceipts.length > 0 && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Other available receipts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedTransaction.availableReceipts.map((receipt) => (
                        <div
                          key={receipt.id}
                          className="p-3 border border-border rounded-md hover:bg-secondary/30 cursor-pointer transition-colors"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium">
                              {receipt.supplier}
                            </span>
                            <span className="text-sm font-semibold">
                              €{receipt.amount.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(receipt.date).toLocaleDateString("de-DE", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Matching;
