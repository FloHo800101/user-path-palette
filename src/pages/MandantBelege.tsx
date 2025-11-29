import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { FileText } from "lucide-react";
import { mandantReceipts, MandantReceipt } from "@/data/mockMandantReceipts";

export default function MandantBelege() {
  const navigate = useNavigate();
  const [receipts] = useState<MandantReceipt[]>(mandantReceipts);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<MandantReceipt | null>(null);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);

  const filteredReceipts = useMemo(() => {
    return receipts.filter(receipt => {
      // Status filter
      if (statusFilter === "ohne-zuordnung" && receipt.linkedTransactionId) {
        return false;
      }
      if (statusFilter === "zugeordnet" && !receipt.linkedTransactionId) {
        return false;
      }
      if (statusFilter === "verarbeitet" && receipt.status !== "verarbeitet") {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          receipt.filename.toLowerCase().includes(query) ||
          receipt.amount?.toString().includes(query)
        );
      }

      return true;
    });
  }, [receipts, statusFilter, searchQuery]);

  const handleOpenDetails = (receipt: MandantReceipt) => {
    setSelectedReceipt(receipt);
    setDetailsPanelOpen(true);
  };

  const handleNavigateToTransaction = (transactionId?: string) => {
    if (transactionId) {
      navigate(`/mandant/konto-vorgaenge`);
      setDetailsPanelOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'n/a';
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusBadge = (receipt: MandantReceipt) => {
    if (receipt.status === 'verarbeitet') {
      return <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">Erledigt</Badge>;
    }
    if (receipt.linkedTransactionId) {
      return <Badge variant="default" className="text-xs bg-amber-600 hover:bg-amber-700">Zur Prüfung in der Kanzlei</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">Ohne Zuordnung</Badge>;
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
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="ohne-zuordnung">Ohne Zuordnung</SelectItem>
                <SelectItem value="zugeordnet">Zu Konto-Vorgang zugeordnet</SelectItem>
                <SelectItem value="verarbeitet">Von Kanzlei verarbeitet</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Nach Dateiname oder Betrag suchen…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        {/* Receipts Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dateiname</TableHead>
                  <TableHead>Hochgeladen am</TableHead>
                  <TableHead className="text-right">Betrag</TableHead>
                  <TableHead>Zugeordneter Konto-Vorgang</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aktion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.map((receipt) => (
                  <TableRow key={receipt.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {receipt.filename}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(receipt.uploadedAt)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(receipt.amount)}
                    </TableCell>
                    <TableCell>
                      {receipt.linkedTransactionDescription && receipt.linkedTransactionDate ? (
                        <button
                          onClick={() => handleNavigateToTransaction(receipt.linkedTransactionId)}
                          className="text-sm text-primary hover:underline text-left"
                        >
                          {receipt.linkedTransactionDescription} – {new Date(receipt.linkedTransactionDate).toLocaleDateString('de-DE')}
                        </button>
                      ) : (
                        <span className="text-sm text-muted-foreground">Noch nicht zugeordnet</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(receipt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDetails(receipt)}
                      >
                        Details anzeigen
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
          <SheetContent className="w-[500px] sm:max-w-[500px]">
            <SheetHeader className="mb-6">
              <SheetTitle>Beleg-Details</SheetTitle>
              <SheetDescription>
                Informationen zum hochgeladenen Beleg
              </SheetDescription>
            </SheetHeader>

            {selectedReceipt && (
              <div className="space-y-6">
                {/* Preview Placeholder */}
                <Card>
                  <CardContent className="p-8">
                    <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Vorschau-Platzhalter</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Receipt Information */}
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dateiname:</span>
                      <span className="font-medium text-right max-w-[60%]">
                        {selectedReceipt.filename}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Hochgeladen am:</span>
                      <span className="font-medium">{formatDate(selectedReceipt.uploadedAt)}</span>
                    </div>
                    {selectedReceipt.amount && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Betrag:</span>
                        <span className="font-medium">{formatCurrency(selectedReceipt.amount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-muted-foreground">Status:</span>
                      {getStatusBadge(selectedReceipt)}
                    </div>
                    {selectedReceipt.linkedTransactionDescription && (
                      <div className="pt-2 border-t">
                        <span className="text-sm text-muted-foreground block mb-1">
                          Zugeordnet zu:
                        </span>
                        <button
                          onClick={() => handleNavigateToTransaction(selectedReceipt.linkedTransactionId)}
                          className="text-sm font-medium text-primary hover:underline text-left"
                        >
                          {selectedReceipt.linkedTransactionDescription}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {selectedReceipt.linkedTransactionDate && 
                              new Date(selectedReceipt.linkedTransactionDate).toLocaleDateString('de-DE')} – {formatCurrency(selectedReceipt.amount)}
                          </span>
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="space-y-3">
                  {selectedReceipt.linkedTransactionId && (
                    <Button 
                      className="w-full" 
                      onClick={() => handleNavigateToTransaction(selectedReceipt.linkedTransactionId)}
                    >
                      Zum Konto-Vorgang springen
                    </Button>
                  )}
                  <Button variant="outline" className="w-full" onClick={() => setDetailsPanelOpen(false)}>
                    Schließen
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
