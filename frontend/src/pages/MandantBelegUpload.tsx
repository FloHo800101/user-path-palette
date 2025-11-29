import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Upload, FileText } from "lucide-react";
import { mandantReceipts, MandantReceipt } from "@/data/mockMandantReceipts";
import { useToast } from "@/hooks/use-toast";

export default function MandantBelegUpload() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [receipts, setReceipts] = useState<MandantReceipt[]>(mandantReceipts);
  const [selectedReceipt, setSelectedReceipt] = useState<MandantReceipt | null>(null);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newReceipts: MandantReceipt[] = Array.from(files).map((file, idx) => ({
        id: `r${receipts.length + idx + 1}`,
        filename: file.name,
        uploadedAt: new Date().toISOString(),
        status: 'neu' as const,
      }));
      
      setReceipts([...newReceipts, ...receipts]);
      toast({
        title: "Belege hochgeladen",
        description: `${files.length} Datei(en) wurden erfolgreich hochgeladen.`,
      });
    }
  };

  const handleOpenDetails = (receipt: MandantReceipt) => {
    setSelectedReceipt(receipt);
    setDetailsPanelOpen(true);
  };

  const handleNavigateToTransactions = () => {
    navigate('/mandant/konto-vorgaenge');
    setDetailsPanelOpen(false);
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

  const getStatusBadge = (status: MandantReceipt['status']) => {
    switch (status) {
      case 'neu':
        return <Badge variant="secondary" className="text-xs">Neu – noch nicht zugeordnet</Badge>;
      case 'vorgeschlagen':
        return <Badge variant="outline" className="text-xs border-primary text-primary">Zuordnung vorgeschlagen</Badge>;
      case 'zugeordnet':
        return <Badge variant="default" className="text-xs bg-blue-600 hover:bg-blue-700">Zugeordnet</Badge>;
      case 'verarbeitet':
        return <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">Von Kanzlei verarbeitet</Badge>;
    }
  };

  const getStatusText = (receipt: MandantReceipt) => {
    if (receipt.linkedTransactionDescription && receipt.linkedTransactionDate) {
      return `Zugeordnet zu ${receipt.linkedTransactionDescription} – ${new Date(receipt.linkedTransactionDate).toLocaleDateString('de-DE')} – ${formatCurrency(receipt.amount)}`;
    }
    return getStatusBadge(receipt.status);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Belege hochladen</h1>
          <p className="text-muted-foreground">
            Laden Sie mehrere Belege gleichzeitig hoch. Die Zuordnung zu Ihren Konto-Vorgängen erfolgt automatisch oder durch Ihre Kanzlei.
          </p>
        </div>

        {/* Upload Area */}
        <Card className="mb-8">
          <CardContent className="p-12">
            <label className="cursor-pointer block">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed rounded-lg p-12 text-center hover:bg-muted/50 transition-colors">
                <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Dateien hierher ziehen oder auswählen</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Sie können mehrere Dateien oder ganze Ordner auswählen.
                </p>
                <Button size="lg">Dateien auswählen</Button>
              </div>
            </label>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Unterstützte Formate: PDF, JPG, PNG (simuliert)
            </p>
          </CardContent>
        </Card>

        {/* Uploaded Receipts List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Hochgeladene Belege ({receipts.length})
          </h2>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dateiname</TableHead>
                    <TableHead>Hochgeladen am</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aktion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {receipt.filename}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(receipt.uploadedAt)}</TableCell>
                      <TableCell>{getStatusText(receipt)}</TableCell>
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
        </div>

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
                  <CardHeader>
                    <CardTitle className="text-base">Grunddaten</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
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
                        <span className="text-muted-foreground">Geschätzter Betrag:</span>
                        <span className="font-medium">{formatCurrency(selectedReceipt.amount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-muted-foreground">Status:</span>
                      {getStatusBadge(selectedReceipt.status)}
                    </div>
                    {selectedReceipt.linkedTransactionDescription && (
                      <div className="pt-2 border-t">
                        <span className="text-sm text-muted-foreground block mb-1">
                          Zugeordnet zu:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedReceipt.linkedTransactionDescription}
                        </span>
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {selectedReceipt.linkedTransactionDate && 
                            new Date(selectedReceipt.linkedTransactionDate).toLocaleDateString('de-DE')} – {formatCurrency(selectedReceipt.amount)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="space-y-3">
                  <Button className="w-full" onClick={handleNavigateToTransactions}>
                    Zu Konto-Vorgängen springen
                  </Button>
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
