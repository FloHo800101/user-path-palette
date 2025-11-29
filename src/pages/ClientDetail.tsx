import { useParams, Link } from "react-router-dom";
import { mockClients } from "@/data/mockClients";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

const ClientDetail = () => {
  const { id } = useParams();
  const client = mockClients.find((c) => c.id === id);

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

  const statusColor = client.status === "on-track" ? "success" : "warning";
  const statusLabel = client.status === "on-track" ? "On track" : "At risk";

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar with breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
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
                  <BreadcrumbPage>{client.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to clients
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="border-b border-border bg-card">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                {client.name}
              </h1>
              <p className="text-muted-foreground">{client.vatType}</p>
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
                  Last updated: 12 minutes ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="px-8 py-6 border-b border-border bg-card">
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-background border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bank transactions (period)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">
                {client.bankTransactions}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unmatched transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-semibold text-foreground">
                  {client.unmatchedBankTransactions}
                </div>
                <Badge
                  variant={
                    client.unmatchedBankTransactions < 10
                      ? "default"
                      : "destructive"
                  }
                  className={
                    client.unmatchedBankTransactions < 10
                      ? "bg-success/10 text-success hover:bg-success/20"
                      : "bg-warning/10 text-warning hover:bg-warning/20"
                  }
                >
                  {client.unmatchedBankTransactions < 10 ? "Low" : "High"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unmatched receipts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">
                {client.unmatchedReceipts}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Receipt completeness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-semibold text-foreground">
                  {client.receiptCompleteness}%
                </div>
                <Progress value={client.receiptCompleteness} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main content - two columns */}
      <main className="px-8 py-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Left column - Open work */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Open work for this client
              </h2>
              <p className="text-sm text-muted-foreground">
                Use these shortcuts to jump into the detailed views.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Unmatched transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-2xl font-semibold text-foreground mb-2">
                        {client.unmatchedBankTransactions} open
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Bank transactions that need to be matched with receipts
                        or invoices.
                      </p>
                    </div>
                    <Button className="w-full">Go to matching</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Unmatched receipts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-2xl font-semibold text-foreground mb-2">
                        {client.unmatchedReceipts} missing
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Receipts that have not yet been uploaded or assigned to
                        transactions.
                      </p>
                    </div>
                    <Button className="w-full" variant="outline">
                      Go to missing receipts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right column - Risk & reminders */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Risk & reminders
              </h2>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Status overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">
                        Receipt completeness
                      </span>
                      <Badge
                        variant={
                          client.status === "on-track" ? "default" : "destructive"
                        }
                        className={
                          client.status === "on-track"
                            ? "bg-success/10 text-success hover:bg-success/20"
                            : "bg-warning/10 text-warning hover:bg-warning/20"
                        }
                      >
                        {statusLabel}
                      </Badge>
                    </div>
                    <Progress
                      value={client.receiptCompleteness}
                      className="h-2"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {client.receiptCompleteness}% of receipts are matched
                    </p>
                  </div>

                  <div className="border-t border-border pt-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          VAT return deadline
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {client.vatType === "Monthly VAT filer"
                            ? "10 April 2026"
                            : "10 May 2026"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          Chasing effort
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Client reminders this period:{" "}
                          {client.status === "on-track" ? "1" : "3"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDetail;
