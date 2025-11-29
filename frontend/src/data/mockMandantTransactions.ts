export interface MandantTransaction {
  id: string;
  date: string;
  recipient: string;
  description: string;
  isPartialPayment?: boolean;
  grossAmount: number;
  vatRate: number;
  vat: number;
  classification: 'Geschäftlich' | 'Privat' | 'Zahlungsdienstleister' | 'Sonstiges';
  status: 'offen' | 'eingereicht' | 'erledigt';
  month: string;
  year: number;
  isRecurring?: boolean;
  notifyAdvisor?: boolean;
  attachments?: string[];
  advisorMessage?: string;
  advisorMessageTimestamp?: string;
}

export const mandantTransactions: MandantTransaction[] = [
  {
    id: '1',
    date: '2024-02-28',
    recipient: 'Lieferant AG',
    description: 'Rechnung 2024-051 Teil 1/2',
    isPartialPayment: true,
    grossAmount: -5000.00,
    vatRate: 19.00,
    vat: -798.32,
    classification: 'Geschäftlich',
    status: 'offen',
    month: 'Februar',
    year: 2024
  },
  {
    id: '2',
    date: '2024-02-25',
    recipient: 'Hotel Adlon',
    description: 'Übernachtung Geschäftsreise Berlin',
    grossAmount: -450.00,
    vatRate: 7.00,
    vat: -29.44,
    classification: 'Geschäftlich',
    status: 'eingereicht',
    month: 'Februar',
    year: 2024
  },
  {
    id: '3',
    date: '2024-02-20',
    recipient: 'Deutsche Bahn',
    description: 'ICE Tickets Hamburg-Berlin',
    grossAmount: -180.00,
    vatRate: 19.00,
    vat: -28.74,
    classification: 'Geschäftlich',
    status: 'offen',
    month: 'Februar',
    year: 2024
  },
  {
    id: '4',
    date: '2024-02-15',
    recipient: 'Office Supplies GmbH',
    description: 'Büromaterial Februar',
    grossAmount: -320.50,
    vatRate: 19.00,
    vat: -51.16,
    classification: 'Geschäftlich',
    status: 'erledigt',
    month: 'Februar',
    year: 2024
  },
  {
    id: '5',
    date: '2024-02-10',
    recipient: 'Restaurant Zur Post',
    description: 'Geschäftsessen Kunde Meier',
    grossAmount: -125.00,
    vatRate: 19.00,
    vat: -19.96,
    classification: 'Geschäftlich',
    status: 'eingereicht',
    month: 'Februar',
    year: 2024
  },
  {
    id: '6',
    date: '2026-03-15',
    recipient: 'Software AG',
    description: 'Lizenzgebühr Q1/2026',
    grossAmount: -2400.00,
    vatRate: 19.00,
    vat: -383.19,
    classification: 'Geschäftlich',
    status: 'offen',
    month: 'März',
    year: 2026
  },
  {
    id: '7',
    date: '2026-03-10',
    recipient: 'Tankstelle Shell',
    description: 'Kraftstoff Firmenwagen',
    grossAmount: -95.50,
    vatRate: 19.00,
    vat: -15.24,
    classification: 'Geschäftlich',
    status: 'offen',
    month: 'März',
    year: 2026
  },
  {
    id: '8',
    date: '2026-03-05',
    recipient: 'Telekom',
    description: 'Rechnung Internet & Telefon',
    grossAmount: -89.90,
    vatRate: 19.00,
    vat: -14.35,
    classification: 'Geschäftlich',
    status: 'eingereicht',
    month: 'März',
    year: 2026
  },
  {
    id: '9',
    date: '2024-01-25',
    recipient: 'Handwerker Müller',
    description: 'Renovierung Büroräume',
    grossAmount: -1500.00,
    vatRate: 19.00,
    vat: -239.50,
    classification: 'Geschäftlich',
    status: 'offen',
    month: 'Januar',
    year: 2024
  },
  {
    id: '10',
    date: '2024-01-15',
    recipient: 'Amazon Business',
    description: 'IT-Equipment',
    grossAmount: -850.00,
    vatRate: 19.00,
    vat: -135.71,
    classification: 'Geschäftlich',
    status: 'erledigt',
    month: 'Januar',
    year: 2024
  }
];
