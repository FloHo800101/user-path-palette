export interface MandantReceipt {
  id: string;
  filename: string;
  uploadedAt: string;
  amount?: number;
  status: 'neu' | 'vorgeschlagen' | 'zugeordnet' | 'verarbeitet';
  linkedTransactionId?: string;
  linkedTransactionDescription?: string;
  linkedTransactionDate?: string;
}

export const mandantReceipts: MandantReceipt[] = [
  {
    id: 'r1',
    filename: 'Rechnung_Bürobedarf_Express.pdf',
    uploadedAt: '2026-03-15T10:30:00',
    amount: 247.50,
    status: 'zugeordnet',
    linkedTransactionId: 't1',
    linkedTransactionDescription: 'Bürobedarf-Express',
    linkedTransactionDate: '2026-03-15'
  },
  {
    id: 'r2',
    filename: 'Hotel_Adlon_Berlin.pdf',
    uploadedAt: '2024-02-26T14:20:00',
    amount: 450.00,
    status: 'verarbeitet',
    linkedTransactionId: '2',
    linkedTransactionDescription: 'Hotel Adlon',
    linkedTransactionDate: '2024-02-25'
  },
  {
    id: 'r3',
    filename: 'Tankbeleg_Shell_März.jpg',
    uploadedAt: '2026-03-13T08:45:00',
    amount: 65.00,
    status: 'vorgeschlagen',
    linkedTransactionId: 't4',
    linkedTransactionDescription: 'Shell Tankstelle',
    linkedTransactionDate: '2026-03-12'
  },
  {
    id: 'r4',
    filename: 'Bewirtung_Restaurant_Meier.pdf',
    uploadedAt: '2026-03-20T16:10:00',
    amount: 125.00,
    status: 'neu'
  },
  {
    id: 'r5',
    filename: 'Telekom_Rechnung_März_2026.pdf',
    uploadedAt: '2026-03-11T09:15:00',
    amount: 89.99,
    status: 'zugeordnet',
    linkedTransactionId: 't3',
    linkedTransactionDescription: 'Deutsche Telekom',
    linkedTransactionDate: '2026-03-10'
  },
  {
    id: 'r6',
    filename: 'Handwerker_Rechnung.pdf',
    uploadedAt: '2024-01-26T11:30:00',
    amount: 1500.00,
    status: 'neu'
  },
  {
    id: 'r7',
    filename: 'Amazon_Business_Bestellung.pdf',
    uploadedAt: '2024-01-16T13:45:00',
    amount: 850.00,
    status: 'verarbeitet',
    linkedTransactionId: '10',
    linkedTransactionDescription: 'Amazon Business',
    linkedTransactionDate: '2024-01-15'
  }
];
