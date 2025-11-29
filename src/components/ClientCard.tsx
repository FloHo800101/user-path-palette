import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, TrendingUp, AlertCircle } from "lucide-react";

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
}

interface ClientCardProps {
  client: ClientData;
}

export const ClientCard = ({ client }: ClientCardProps) => {
  const isAtRisk = client.status === "at-risk";

  return (
    <Card className="p-6 hover:shadow-medium transition-smooth border-border bg-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-card-foreground mb-1">{client.name}</h3>
            <p className="text-sm text-muted-foreground">{client.vatType}</p>
          </div>
        </div>
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
              At risk
            </>
          ) : (
            <>
              <TrendingUp className="h-3 w-3 mr-1" />
              On track
            </>
          )}
        </Badge>
      </div>

      <div className="space-y-3 mb-6">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Bank transactions</p>
            <p className="font-medium text-card-foreground">{client.bankTransactions}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Receipt completeness</p>
            <p className="font-medium text-card-foreground">{client.receiptCompleteness}%</p>
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Unmatched transactions</p>
              <p
                className={`font-semibold ${
                  client.unmatchedBankTransactions > 15 ? "text-destructive" : "text-card-foreground"
                }`}
              >
                {client.unmatchedBankTransactions}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Unmatched receipts</p>
              <p
                className={`font-semibold ${
                  client.unmatchedReceipts > 10 ? "text-destructive" : "text-card-foreground"
                }`}
              >
                {client.unmatchedReceipts}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button className="w-full" variant="outline">
        Open client
      </Button>
    </Card>
  );
};
