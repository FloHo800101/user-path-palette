import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FileText, Filter, Download } from "lucide-react";
import { mandantTransactions, MandantTransaction } from "@/data/mockMandantTransactions";
import { useToast } from "@/hooks/use-toast";

export default function MandantBelege() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [transactions, setTransactions] = useState<MandantTransaction[]>(mandantTransactions);
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<MandantTransaction | null>(null);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  
  // Form state for side panel
  const [editedClassification, setEditedClassification] = useState<'Geschäftlich' | 'Privat' | 'Zahlungsdienstleister' | 'Sonstiges'>('Geschäftlich');
  const [editedIsRecurring, setEditedIsRecurring] = useState(false);
  const [editedNotifyAdvisor, setEditedNotifyAdvisor] = useState(false);
  const [editedAdvisorMessage, setEditedAdvisorMessage] = useState('');
  const [messageError, setMessageError] = useState('');

  // Filter to show only transactions with attachments (receipts)
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Only show transactions with attachments
      if (!transaction.attachments || transaction.attachments.length === 0) {
        return false;
      }

      // Month filter
      if (monthFilter !== "all") {
        const monthYear = `${transaction.month} ${transaction.year}`;
        if (monthYear !== monthFilter) {
          return false;
        }
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          transaction.recipient.toLowerCase().includes(query) ||
          transaction.description.toLowerCase().includes(query) ||
          transaction.attachments?.some(file => file.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [transactions, monthFilter, searchQuery]);

  const handleOpenDetailsPanel = (transaction: MandantTransaction) => {
    setSelectedTransaction(transaction);
    setEditedClassification(transaction.classification || 'Geschäftlich');
    setEditedIsRecurring(transaction.isRecurring || false);
    setEditedNotifyAdvisor(transaction.notifyAdvisor || false);
    setEditedAdvisorMessage(transaction.advisorMessage || '');
    setMessageError('');
    setDetailsPanelOpen(true);
  };

  const handleSaveTransaction = () => {
    if (selectedTransaction) {
      // Validation: if notify advisor is checked, message should not be empty
      if (editedNotifyAdvisor && !editedAdvisorMessage.trim()) {
        setMessageError('Bitte geben Sie eine kurze Nachricht ein oder deaktivieren Sie die Benachrichtigung.');
        return;
      }
      
      const now = new Date();
      const timestamp = now.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      setTransactions(prev =>
        prev.map(t =>
          t.id === selectedTransaction.id
            ? {
                ...t,
                classification: editedClassification,
                isRecurring: editedIsRecurring,
                notifyAdvisor: editedNotifyAdvisor,
                advisorMessage: editedNotifyAdvisor && editedAdvisorMessage.trim() ? editedAdvisorMessage : undefined,
                advisorMessageTimestamp: editedNotifyAdvisor && editedAdvisorMessage.trim() ? timestamp : undefined,
              }
            : t
        )
      );
      toast({
        title: "Änderungen gespeichert",
        description: "Ihre Änderungen wurden erfolgreich gespeichert.",
      });
      setDetailsPanelOpen(false);
      setSelectedTransaction(null);
      setMessageError('');
    }
  };

  const handleCancelEdit = () => {
    setDetailsPanelOpen(false);
    setSelectedTransaction(null);
    setMessageError('');
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

  const getMonthYearOptions = () => {
    const uniqueMonths = new Set<string>();
    transactions.forEach(t => {
      if (t.attachments && t.attachments.length > 0) {
        uniqueMonths.add(`${t.month} ${t.year}`);
      }
    });
    return Array.from(uniqueMonths).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      return parseInt(yearB) - parseInt(yearA);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Belege</h1>
          <p className="text-muted-foreground">
            Übersicht über alle von Ihnen hochgeladenen Belege.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-end mb-6 gap-3">
          <Input
            placeholder="Belege durchsuchen…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Monate</SelectItem>
              {getMonthYearOptions().map((monthYear) => (
                <SelectItem key={monthYear} value={monthYear}>
                  {monthYear}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  <TableHead>Belegdatei</TableHead>
                  <TableHead className="text-right">Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow 
                    key={transaction.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleOpenDetailsPanel(transaction)}
                  >
                    <TableCell className="font-medium">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{transaction.recipient}</span>
                        <span className="text-sm text-muted-foreground">
                          {transaction.description}
                        </span>
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
                    <TableCell>
                      {transaction.attachments && transaction.attachments.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetailsPanel(transaction);
                          }}
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <FileText className="h-4 w-4" />
                          {transaction.attachments[0]}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast({
                            title: "Download simuliert",
                            description: "Diese Funktion ist im Prototyp nicht verfügbar.",
                          });
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Details Panel */}
        <Sheet open={detailsPanelOpen} onOpenChange={setDetailsPanelOpen}>
          <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle>Vorgangsdetails</SheetTitle>
              <SheetDescription>
                Buchungsinformationen und Beleg-Details
              </SheetDescription>
            </SheetHeader>

            {selectedTransaction && (
              <div className="space-y-6">
                {/* Transaction Information Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{selectedTransaction.recipient}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedTransaction.description}
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {formatDate(selectedTransaction.date)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Brutto-Betrag:</span>
                      <span className="font-medium text-destructive">
                        {formatCurrency(selectedTransaction.grossAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Umsatzsteuer ({selectedTransaction.vatRate.toFixed(2)} %):
                      </span>
                      <span className="font-medium">
                        {formatCurrency(selectedTransaction.vat)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Receipt Files Section */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Beleg</Label>
                  {selectedTransaction.attachments && selectedTransaction.attachments.length > 0 && (
                    <div className="space-y-2">
                      {selectedTransaction.attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 border border-border rounded-md bg-muted/30">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <span className="flex-1 text-sm font-medium">{file}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-primary hover:text-primary/80"
                          >
                            Ansehen
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Classification Section */}
                <div className="space-y-3">
                  <Label htmlFor="classification" className="text-base font-semibold">
                    Klassifikation
                  </Label>
                  <Select
                    value={editedClassification}
                    onValueChange={(value) => setEditedClassification(value as any)}
                  >
                    <SelectTrigger id="classification">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Geschäftlich">Geschäftlich</SelectItem>
                      <SelectItem value="Privat">Privat</SelectItem>
                      <SelectItem value="Zahlungsdienstleister">Zahlungsdienstleister</SelectItem>
                      <SelectItem value="Sonstiges">Sonstiges</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Options Section */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Weitere Optionen</Label>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="recurring-belege"
                      checked={editedIsRecurring}
                      onCheckedChange={(checked) => setEditedIsRecurring(checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="recurring-belege"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Wiederkehrende Zahlung
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Zukünftige Zahlungen automatisch zuordnen (simuliert).
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="notify-belege"
                        checked={editedNotifyAdvisor}
                        onCheckedChange={(checked) => {
                          setEditedNotifyAdvisor(checked as boolean);
                          if (!checked) {
                            setMessageError('');
                          }
                        }}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="notify-belege"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          Steuerberater benachrichtigen
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Die Kanzlei wird über die vorgenommenen Änderungen informiert (simuliert).
                        </p>
                      </div>
                    </div>

                    {editedNotifyAdvisor && (
                      <div className="ml-7 space-y-2">
                        <Label htmlFor="advisorMessage-belege" className="text-sm">
                          Nachricht an Ihre Kanzlei
                        </Label>
                        <Textarea
                          id="advisorMessage-belege"
                          placeholder="z. B. Hinweis zur Rechnung, Teilzahlung, privater Anteil …"
                          value={editedAdvisorMessage}
                          onChange={(e) => {
                            setEditedAdvisorMessage(e.target.value);
                            if (messageError) setMessageError('');
                          }}
                          className="min-h-[100px]"
                        />
                        {messageError && (
                          <p className="text-xs text-destructive">{messageError}</p>
                        )}
                        {selectedTransaction?.advisorMessage && (
                          <div className="pt-2 space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                              Zuletzt an Ihre Kanzlei gesendete Nachricht:
                            </p>
                            <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                              {selectedTransaction.advisorMessage.length > 100
                                ? selectedTransaction.advisorMessage.substring(0, 100) + '...'
                                : selectedTransaction.advisorMessage}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Abbrechen
                  </Button>
                  <Button onClick={handleSaveTransaction}>
                    Speichern
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
