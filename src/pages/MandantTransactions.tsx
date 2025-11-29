import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X, Upload, Camera, FileUp } from "lucide-react";
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
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  
  // Form state
  const [editedClassification, setEditedClassification] = useState<'Geschäftlich' | 'Privat' | 'Gemischt'>('Geschäftlich');
  const [editedIsRecurring, setEditedIsRecurring] = useState(false);
  const [editedNotifyAdvisor, setEditedNotifyAdvisor] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Month filter
      if (filterMonth) {
        const [month, year] = filterMonth.split(" ");
        if (transaction.month !== month || transaction.year.toString() !== year) {
          return false;
        }
      }

      // Status filter - enhanced
      if (statusFilter === "open" && transaction.status !== "offen") {
        return false;
      }
      if (statusFilter === "with-receipt" && !transaction.attachments?.length) {
        return false;
      }
      if (statusFilter === "done" && transaction.status !== "erledigt") {
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

  const handleOpenDetailsPanel = (transaction: MandantTransaction) => {
    setSelectedTransaction(transaction);
    setEditedClassification(transaction.classification || 'Geschäftlich');
    setEditedIsRecurring(transaction.isRecurring || false);
    setEditedNotifyAdvisor(transaction.notifyAdvisor || false);
    setUploadedFiles(transaction.attachments || []);
    setDetailsPanelOpen(true);
  };

  const handleSaveTransaction = () => {
    if (selectedTransaction) {
      setTransactions(prev =>
        prev.map(t =>
          t.id === selectedTransaction.id
            ? {
                ...t,
                classification: editedClassification,
                isRecurring: editedIsRecurring,
                notifyAdvisor: editedNotifyAdvisor,
                attachments: uploadedFiles,
                status: uploadedFiles.length > 0 ? 'eingereicht' as const : t.status
              }
            : t
        )
      );
      toast({
        title: "Änderungen gespeichert",
        description: uploadedFiles.length > 0 
          ? "Der Beleg wurde erfolgreich hochgeladen und an Ihre Kanzlei übermittelt."
          : "Ihre Änderungen wurden gespeichert.",
      });
      setDetailsPanelOpen(false);
      setSelectedTransaction(null);
    }
  };

  const handleCancelEdit = () => {
    setDetailsPanelOpen(false);
    setSelectedTransaction(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map(f => f.name);
      setUploadedFiles(prev => [...prev, ...fileNames]);
      toast({
        title: "Datei hinzugefügt",
        description: `${fileNames.join(', ')} wurde hinzugefügt.`,
      });
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
        return <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">Beleg vorhanden</Badge>;
      case 'erledigt':
        return <Badge variant="secondary" className="text-xs">Erledigt</Badge>;
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
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle anzeigen</SelectItem>
                <SelectItem value="open">Nur offene</SelectItem>
                <SelectItem value="with-receipt">Nur mit Beleg</SelectItem>
                <SelectItem value="done">Erledigt</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              Kontoauszug hochladen
            </Button>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetailsPanel(transaction);
                          }}
                        >
                          + Beleg
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetailsPanel(transaction);
                          }}
                        >
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

        {/* Details Panel */}
        <Sheet open={detailsPanelOpen} onOpenChange={setDetailsPanelOpen}>
          <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle>Vorgangsdetails</SheetTitle>
              <SheetDescription>
                Buchungsinformationen und Beleg-Upload
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

                {/* Receipt Upload Section */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Beleg</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Card className="h-32 hover:bg-muted/50 transition-colors">
                        <CardContent className="h-full flex flex-col items-center justify-center p-4 text-center">
                          <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
                          <p className="font-medium text-sm">Datei hochladen</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Datei auswählen oder hierher ziehen
                          </p>
                        </CardContent>
                      </Card>
                    </label>
                    <Card className="h-32 hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardContent className="h-full flex flex-col items-center justify-center p-4 text-center">
                        <Camera className="h-8 w-8 mb-2 text-muted-foreground" />
                        <p className="font-medium text-sm">Mit Kamera scannen</p>
                        <p className="text-xs text-muted-foreground mt-1">(simuliert)</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-medium">Hochgeladene Dateien:</p>
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
                          <FileUp className="h-4 w-4" />
                          <span className="flex-1">{file}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                          >
                            <X className="h-3 w-3" />
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
                      <SelectItem value="Gemischt">Gemischt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Options Section */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Weitere Optionen</Label>
                  
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="recurring"
                      checked={editedIsRecurring}
                      onCheckedChange={(checked) => setEditedIsRecurring(checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="recurring"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Wiederkehrende Zahlung
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Zukünftige Zahlungen automatisch zuordnen (simuliert).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="notify"
                      checked={editedNotifyAdvisor}
                      onCheckedChange={(checked) => setEditedNotifyAdvisor(checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="notify"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Steuerberater benachrichtigen
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Die Kanzlei wird über die vorgenommenen Änderungen informiert (simuliert).
                      </p>
                    </div>
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
