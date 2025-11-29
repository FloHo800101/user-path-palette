import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X, Upload } from "lucide-react";
import { mandantTransactions, MandantTransaction } from "@/data/mockMandantTransactions";
import { useToast } from "@/hooks/use-toast";

export default function MandantTransactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  const initialMonth = searchParams.get("month");
  const initialYear = searchParams.get("year");
  
  const [transactions, setTransactions] = useState<MandantTransaction[]>(mandantTransactions);
  const [filterMonth, setFilterMonth] = useState<string | null>(
    initialMonth && initialYear ? `${initialMonth} ${initialYear}` : null
  );
  const [statusFilter, setStatusFilter] = useState<string>("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<MandantTransaction | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadNote, setUploadNote] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Month filter
      if (filterMonth) {
        const [month, year] = filterMonth.split(" ");
        if (transaction.month !== month || transaction.year.toString() !== year) {
          return false;
        }
      }

      // Status filter
      if (statusFilter === "open" && transaction.status !== "offen") {
        return false;
      }
      if (statusFilter === "eingereicht" && transaction.status !== "eingereicht") {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          transaction.recipient.toLowerCase().includes(query) ||
          transaction.description.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [transactions, filterMonth, statusFilter, searchQuery]);

  const handleRemoveFilter = () => {
    setFilterMonth(null);
    setSearchParams({});
  };

  const handleOpenUploadDialog = (transaction: MandantTransaction) => {
    setSelectedTransaction(transaction);
    setUploadDialogOpen(true);
    setUploadNote("");
  };

  const handleUploadReceipt = () => {
    if (selectedTransaction) {
      setTransactions(prev =>
        prev.map(t =>
          t.id === selectedTransaction.id
            ? { ...t, status: 'eingereicht' as const }
            : t
        )
      );
      toast({
        title: "Beleg hochgeladen",
        description: "Der Beleg wurde erfolgreich an Ihre Kanzlei übermittelt.",
      });
      setUploadDialogOpen(false);
      setSelectedTransaction(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: MandantTransaction['status']) => {
    switch (status) {
      case 'offen':
        return <Badge variant="destructive" className="text-xs">Offen</Badge>;
      case 'eingereicht':
        return <Badge variant="secondary" className="text-xs">Eingereicht</Badge>;
      case 'erledigt':
        return <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">Erledigt</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Konto-Vorgänge</h1>
          <p className="text-muted-foreground">
            Bankbewegungen und zugehörige Belege im ausgewählten Zeitraum
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            {filterMonth && (
              <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                Filter aktiv: {filterMonth}
                <button
                  onClick={handleRemoveFilter}
                  className="ml-2 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Input
              placeholder="Suchen…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Nur offene</SelectItem>
                <SelectItem value="eingereicht">Eingereichte</SelectItem>
                <SelectItem value="all">Alle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Empfänger/Zweck</TableHead>
                  <TableHead className="text-right">Brutto-Betrag</TableHead>
                  <TableHead className="text-right">USt-Satz</TableHead>
                  <TableHead className="text-right">USt</TableHead>
                  <TableHead>Klassifikation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{transaction.recipient}</span>
                        <span className="text-sm text-muted-foreground">
                          {transaction.description}
                        </span>
                        {transaction.isPartialPayment && (
                          <Badge variant="outline" className="text-xs w-fit mt-1">
                            Teilzahlung
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={transaction.grossAmount < 0 ? "text-destructive font-medium" : "font-medium"}>
                        {formatCurrency(transaction.grossAmount)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.vatRate.toFixed(2)} %
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(transaction.vat)}
                    </TableCell>
                    <TableCell>{transaction.classification}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="text-right">
                      {transaction.status === 'offen' ? (
                        <Button
                          size="sm"
                          onClick={() => handleOpenUploadDialog(transaction)}
                        >
                          + Beleg
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          Beleg ansehen
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Beleg hinzufügen</DialogTitle>
              <DialogDescription>
                Laden Sie den Beleg für diese Buchung hoch
              </DialogDescription>
            </DialogHeader>

            {selectedTransaction && (
              <div className="space-y-4 py-4">
                {/* Transaction Summary */}
                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Datum:</span>
                    <span className="font-medium">{formatDate(selectedTransaction.date)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Empfänger:</span>
                    <span className="font-medium">{selectedTransaction.recipient}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Betrag:</span>
                    <span className="font-medium text-destructive">
                      {formatCurrency(selectedTransaction.grossAmount)}
                    </span>
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Beleg</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Datei hier ablegen oder klicken zum Auswählen
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG, PNG (max. 20 MB)
                    </p>
                  </div>
                </div>

                {/* Note */}
                <div className="space-y-2">
                  <Label htmlFor="note">Hinweis an Ihre Kanzlei (optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="z.B. Hinweise zur Buchung oder fehlende Informationen…"
                    value={uploadNote}
                    onChange={(e) => setUploadNote(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleUploadReceipt}>
                Beleg hochladen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
