import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { mockClients } from "@/data/mockClients";
import { mockTransactions, Transaction, ClientRequest } from "@/data/mockTransactions";
import { ChevronRight, Search, CheckCircle2, AlertCircle, HelpCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
  const [searchParams] = useSearchParams();
  const client = mockClients.find((c) => c.id === id);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>(
    transactions[2]
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");

  // Initialize filter from URL params
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam) {
      setStatusFilter(filterParam);
    }
  }, [searchParams]);

  if (!client) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Mandant nicht gefunden
          </h1>
          <Link to="/">
            <Button variant="outline">Zurück zur Mandantenübersicht</Button>
          </Link>
        </div>
      </div>
    );
  }

  const matchedCount = transactions.filter((t) => t.status === "matched").length;
  const totalCount = transactions.length;

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unmatched" && (transaction.status === "unmatched" || transaction.status === "waiting")) ||
      (statusFilter === "suggestion" && transaction.status === "suggestion") ||
      (statusFilter === "matched" && transaction.status === "matched") ||
      (statusFilter === "waiting" && transaction.status === "waiting");

    const matchesSearch =
      searchQuery === "" ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toString().includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredTransactions.map((t) => t.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectTransaction = (transactionId: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(transactionId);
    } else {
      newSelected.delete(transactionId);
    }
    setSelectedIds(newSelected);
  };

  const handleGenerateRequest = () => {
    // Generate default message
    const defaultMessage = `Dear ${client?.name},

We are missing receipts for the following transactions in March 2026:

${selectedTransactions
  .map(
    (t) =>
      `• ${new Date(t.date).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })} - €${t.amount.toFixed(2)} - ${t.description}`
  )
  .join("\n")}

Please provide the missing receipts at your earliest convenience.

Best regards,
Your Tax Office`;
    
    setRequestMessage(defaultMessage);
    setIsRequestModalOpen(true);
  };

  const handleConfirmRequest = () => {
    const timestamp = new Date().toISOString();
    const clientRequest: ClientRequest = {
      timestamp,
      message: requestMessage,
    };

    // Update status and store request data for selected transactions
    setTransactions((prev) =>
      prev.map((t) =>
        selectedIds.has(t.id) 
          ? { ...t, status: "waiting" as const, lastRequest: clientRequest } 
          : t
      )
    );
    setSelectedIds(new Set());
    setIsRequestModalOpen(false);
    setRequestMessage("");
  };

  const selectedTransactions = transactions.filter((t) => selectedIds.has(t.id));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "matched":
        return (
          <Badge className="bg-success/10 text-success hover:bg-success/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Zugeordnet
          </Badge>
        );
      case "suggestion":
        return (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            <HelpCircle className="h-3 w-3 mr-1" />
            Vorschlag
          </Badge>
        );
      case "unmatched":
        return (
          <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            Nicht zugeordnet
          </Badge>
        );
      case "waiting":
        return (
          <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">
            <Clock className="h-3 w-3 mr-1" />
            Wartet auf Mandanten
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
                  <Link to="/">Mandanten</Link>
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
                <BreadcrumbPage>Zuordnung</BreadcrumbPage>
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
                Zuordnung – {client.name}
              </h1>
              <p className="text-muted-foreground">
                Bankbuchungen Belegen zuordnen
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <Select defaultValue="march-2026">
                  <SelectTrigger className="w-[180px] bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value="march-2026">März 2026</SelectItem>
                    <SelectItem value="february-2026">Februar 2026</SelectItem>
                    <SelectItem value="january-2026">Januar 2026</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  {matchedCount} von {totalCount} Buchungen zugeordnet
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
                Bankbuchungen
              </h2>

              {/* Filter bar */}
              <div className="flex gap-3 mb-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[220px] bg-card">
                    <SelectValue placeholder="Nach Status filtern" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value="all">Alle</SelectItem>
                    <SelectItem value="unmatched">Nicht zugeordnet</SelectItem>
                    <SelectItem value="suggestion">Mit Vorschlag</SelectItem>
                    <SelectItem value="matched">Zugeordnet</SelectItem>
                    <SelectItem value="waiting">Wartet auf Mandanten</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nach Beschreibung oder Betrag suchen…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card"
                  />
                </div>
              </div>
            </div>

            {/* Bulk action bar */}
            {selectedIds.size > 0 && (
              <div className="flex items-center justify-between p-3 bg-secondary/30 border border-border rounded-md mb-4">
                <span className="text-sm font-medium">
                  {selectedIds.size} Buchung{selectedIds.size > 1 ? "en" : ""} ausgewählt
                </span>
                <div className="flex gap-2">
                  <Button onClick={handleGenerateRequest}>
                    Anfrage an Mandanten erstellen
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedIds(new Set())}
                  >
                    Auswahl aufheben
                  </Button>
                </div>
              </div>
            )}

            {/* Transaction table */}
            <Card className="bg-card border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          filteredTransactions.length > 0 &&
                          filteredTransactions.every((t) => selectedIds.has(t.id))
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Betrag</TableHead>
                    <TableHead>Beschreibung</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className={`border-border ${
                        selectedTransaction.id === transaction.id
                          ? "bg-secondary/50"
                          : "hover:bg-secondary/30"
                      }`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(transaction.id)}
                          onCheckedChange={(checked) =>
                            handleSelectTransaction(transaction.id, checked as boolean)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell
                        className="font-medium cursor-pointer"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        {new Date(transaction.date).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell
                        className="font-semibold cursor-pointer"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        €{transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell
                        className="text-sm cursor-pointer"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        {transaction.description}
                      </TableCell>
                      <TableCell onClick={() => setSelectedTransaction(transaction)}>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Right panel - Match details */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Zuordnungsdetails
            </h2>

            {/* Selected transaction details */}
            <Card className="bg-card border-border mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Buchungsdetails</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Datum:</span>
...
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Betrag:</span>
...
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Beschreibung:
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
                  <CardTitle className="text-lg">Kein vorgeschlagener Beleg</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Für diese Buchung wurde kein Beleg vorgeschlagen.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Beleg manuell auswählen
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" className="flex-1 text-xs">
                        Als Barzahlung markieren
                      </Button>
                      <Button variant="ghost" className="flex-1 text-xs">
                        Als nicht relevant markieren
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Client request section (only for "waiting" status) */}
            {selectedTransaction.status === "waiting" && selectedTransaction.lastRequest && (
              <Card className="bg-card border-border mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">Mandantenanfrage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Letzte Anfrage gesendet:</span>
...
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Gesendete Nachricht:
                    </label>
                    <Textarea
                      readOnly
                      value={selectedTransaction.lastRequest.message}
                      className="min-h-[200px] font-mono text-sm bg-background resize-none"
                    />
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
                      Weitere verfügbare Belege
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

      {/* Request generation modal */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle>Anfrage an Mandanten erstellen</DialogTitle>
            <DialogDescription>
              Fehlende Belege von {client?.name} für {selectedIds.size}{" "}
              Buchung{selectedIds.size > 1 ? "en" : ""} anfordern
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Nachricht an Mandanten
              </label>
              <Textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="min-h-[300px] font-mono text-sm bg-background"
                placeholder="Bearbeiten Sie die Nachricht, die an den Mandanten gesendet wird..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleConfirmRequest}>
              Bestätigen & als wartend markieren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Matching;
