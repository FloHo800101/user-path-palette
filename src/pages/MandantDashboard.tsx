import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, MessageSquare } from "lucide-react";
import {
  currentVatPeriod,
  periodsNeedingAttention,
  messages,
} from "@/data/mockMandantDashboard";

export default function MandantDashboard() {
  const today = new Date().toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Überblick über Ihre Beleg-Situation</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>
        </div>

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground">
            Willkommen, Muster-Mandant GmbH
          </h2>
        </div>

        {/* Current VAT Period */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Aktueller UStVA-Zeitraum
          </h3>
          <Card className="border-2">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {currentVatPeriod.month} {currentVatPeriod.year}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {currentVatPeriod.missingReceipts > 0 ? (
                      <>
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">
                          {currentVatPeriod.missingReceipts} Belege fehlen
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-medium text-green-600">
                        Alle Belege vorhanden
                      </span>
                    )}
                  </div>
                </div>
                <Badge
                  variant={currentVatPeriod.status === 'im-plan' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {currentVatPeriod.status === 'im-plan' ? 'Im Plan' : 'Kritisch'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Belegvollständigkeit</span>
                  <span className="font-medium">{currentVatPeriod.completeness}%</span>
                </div>
                <Progress value={currentVatPeriod.completeness} className="h-2" />
                {currentVatPeriod.dueDate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Fällig am {currentVatPeriod.dueDate}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Periods Needing Attention */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Weitere Monate mit Klärungsbedarf
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {periodsNeedingAttention.map((period, idx) => (
              <Card key={idx} className="border-destructive/30">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {period.month} {period.year}
                    </CardTitle>
                    <Badge variant="destructive" className="text-xs">
                      Kritisch
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                      <span className="text-sm font-medium text-destructive">
                        {period.missingReceipts} Belege fehlen
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Vollständigkeit</span>
                        <span className="font-medium">{period.completeness}%</span>
                      </div>
                      <Progress value={period.completeness} className="h-1.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Messages from Tax Office */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Nachrichten & Hinweise Ihrer Kanzlei
          </h3>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex gap-3 pb-4 border-b last:border-b-0 last:pb-0"
                  >
                    <MessageSquare className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={message.type === 'kanzlei' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {message.type === 'kanzlei' ? 'Kanzlei' : 'System'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.date).toLocaleDateString('de-DE', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{message.from}:</span> {message.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
