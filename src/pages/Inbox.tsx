import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockInboxItems, InboxItem } from "@/data/mockInboxItems";
import { mockClients } from "@/data/mockClients";
import { Search, CheckCircle2, AlertCircle, HelpCircle, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

const Inbox = () => {
  const navigate = useNavigate();
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("this-month");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = mockInboxItems.filter((item) => {
    const matchesClient = clientFilter === "all" || item.clientId === clientFilter;
    
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unmatched" && item.status === "unmatched") ||
      (statusFilter === "waiting" && item.status === "waiting") ||
      (statusFilter === "suggestion" && item.status === "suggestion") ||
      (statusFilter === "matched" && item.status === "matched");

    const matchesSearch =
      searchQuery === "" ||
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesClient && matchesStatus && matchesSearch;
  });

  const totalOpenItems = mockInboxItems.filter(
    (item) => item.status !== "matched"
  ).length;
  
  const unmatchedCount = mockInboxItems.filter(
    (item) => item.status === "unmatched"
  ).length;
  
  const waitingCount = mockInboxItems.filter(
    (item) => item.status === "waiting"
  ).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "matched":
        return (
          <Badge className="bg-success/10 text-success hover:bg-success/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Matched
          </Badge>
        );
      case "suggestion":
        return (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            <HelpCircle className="h-3 w-3 mr-1" />
            Suggestion
          </Badge>
        );
      case "unmatched":
        return (
          <Badge className="bg-warning/10 text-warning hover:bg-warning/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            Unmatched
          </Badge>
        );
      case "waiting":
        return (
          <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">
            <Clock className="h-3 w-3 mr-1" />
            Waiting for client
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleOpenMatching = (item: InboxItem) => {
    navigate(`/clients/${item.clientId}/matching`);
  };

  const today = new Date().toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <header className="border-b border-border bg-card">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Inbox – Open items
              </h1>
              <p className="text-muted-foreground">
                Open transactions and issues across all your clients
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{today}</p>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  SK
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-3 gap-6 mb-6">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total open items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">
                {totalOpenItems}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unmatched transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">
                {unmatchedCount}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Waiting for client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">
                {waitingCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter bar */}
        <div className="flex gap-3 mb-6">
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-[220px] bg-card">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              <SelectItem value="all">All clients</SelectItem>
              {mockClients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px] bg-card">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unmatched">Unmatched</SelectItem>
              <SelectItem value="waiting">Waiting for client</SelectItem>
              <SelectItem value="suggestion">Suggestion</SelectItem>
              <SelectItem value="matched">Matched</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              <SelectItem value="this-month">This month</SelectItem>
              <SelectItem value="last-month">Last month</SelectItem>
              <SelectItem value="last-3-months">Last 3 months</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by client or description…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card"
            />
          </div>
        </div>

        {/* Main table */}
        <Card className="bg-card border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Age</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-border hover:bg-secondary/30"
                >
                  <TableCell className="font-medium">{item.clientName}</TableCell>
                  <TableCell>
                    {new Date(item.date).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="font-semibold">
                    €{item.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm">{item.description}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.daysOpen} {item.daysOpen === 1 ? "day" : "days"} open
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenMatching(item)}
                      className="text-primary hover:text-primary/90"
                    >
                      Open matching
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No items found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
