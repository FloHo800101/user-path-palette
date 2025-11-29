import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VatPeriod } from "@/data/mockClients";

export type ClientStatus = "on-track" | "at-risk";

export interface ClientData {
  id: string;
  name: string;
  vatType: string;
  bankTransactions: number;
  unmatchedBankTransactions: number;
  unmatchedReceipts: number;
  receiptCompleteness: number;
  status: ClientStatus;
  currentVatPeriod?: VatPeriod;
  nextVatPeriod?: VatPeriod;
}

interface ClientCardProps {
  client: ClientData;
}

export const ClientCard = ({ client }: ClientCardProps) => {
  const navigate = useNavigate();
  const isAtRisk = client.status === "at-risk";

  return (
    <Card className="p-4 hover:shadow-medium transition-smooth border-border bg-card">
      <div className="space-y-3">
        <div className="flex items-center gap-6">
          {/* Client Info */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <Building2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-card-foreground">{client.name}</h3>
              <p className="text-xs text-muted-foreground">{client.vatType}</p>
            </div>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-8 flex-1">
            <div className="text-sm">
              <p className="text-muted-foreground text-xs mb-0.5">Bankbuchungen</p>
              <p className="font-medium text-card-foreground">{client.bankTransactions}</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground text-xs mb-0.5">Nicht zugeordnet</p>
              <p
                className={`font-semibold ${
                  client.unmatchedBankTransactions > 15 ? "text-destructive" : "text-card-foreground"
                }`}
              >
                {client.unmatchedBankTransactions}
              </p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground text-xs mb-0.5">Fehlende Belege</p>
              <p
                className={`font-semibold ${
                  client.unmatchedReceipts > 10 ? "text-destructive" : "text-card-foreground"
                }`}
              >
                {client.unmatchedReceipts}
              </p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground text-xs mb-0.5">Belegvollständigkeit</p>
              <p className="font-medium text-card-foreground">{client.receiptCompleteness}%</p>
            </div>
          </div>

          {/* Status & Action */}
          <div className="flex items-center gap-3">
            <Badge
              variant={isAtRisk ? "destructive" : "secondary"}
              className={
                isAtRisk
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : "bg-success/10 text-success border-success/20"
              }
            >
              {isAtRisk ? (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Kritisch
                </>
              ) : (
                <>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Im Plan
                </>
              )}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => navigate(`/clients/${client.id}`)}>
              Mandant öffnen
            </Button>
          </div>
        </div>

        {/* VAT Period Information */}
        {client.currentVatPeriod && client.nextVatPeriod && (
          <div className="pl-8 pt-2 border-t border-border/50 space-y-1.5">
            <div className="flex items-center gap-4 text-xs">
              <span className="text-muted-foreground font-medium min-w-[180px]">
                Aktueller UStVA-Zeitraum:
              </span>
              <span className="text-card-foreground">
                {client.currentVatPeriod.month} – {client.currentVatPeriod.completeness}% vollständig – 
                Fällig am {client.currentVatPeriod.dueDate} –
              </span>
              <Badge
                variant={client.currentVatPeriod.status === "at-risk" ? "destructive" : "secondary"}
                className={
                  client.currentVatPeriod.status === "at-risk"
                    ? "bg-destructive/10 text-destructive border-destructive/20 text-xs"
                    : "bg-success/10 text-success border-success/20 text-xs"
                }
              >
                {client.currentVatPeriod.status === "at-risk" ? "Kritisch" : "Im Plan"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-muted-foreground font-medium min-w-[180px]">
                Nächster UStVA-Zeitraum:
              </span>
              <span className="text-card-foreground">
                {client.nextVatPeriod.month} – {client.nextVatPeriod.completeness}% vollständig – 
                Fällig am {client.nextVatPeriod.dueDate} –
              </span>
              <Badge
                variant={client.nextVatPeriod.status === "at-risk" ? "destructive" : "secondary"}
                className={
                  client.nextVatPeriod.status === "at-risk"
                    ? "bg-destructive/10 text-destructive border-destructive/20 text-xs"
                    : "bg-success/10 text-success border-success/20 text-xs"
                }
              >
                {client.nextVatPeriod.status === "at-risk" ? "Kritisch" : "Im Plan"}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
