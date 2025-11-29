export type TransactionStatus = "matched" | "unmatched" | "suggestion";

export interface Receipt {
  id: string;
  supplier: string;
  date: string;
  amount: number;
  vat: number;
  description: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: TransactionStatus;
  suggestedReceipt?: Receipt;
  availableReceipts?: Receipt[];
}

export const mockReceipts: Receipt[] = [
  {
    id: "r1",
    supplier: "Office Depot GmbH",
    date: "2026-03-05",
    amount: 247.50,
    vat: 39.60,
    description: "Office supplies - paper, pens, folders",
  },
  {
    id: "r2",
    supplier: "Deutsche Telekom",
    date: "2026-03-10",
    amount: 89.99,
    vat: 14.39,
    description: "Monthly phone and internet service",
  },
  {
    id: "r3",
    supplier: "Shell Station",
    date: "2026-03-12",
    amount: 65.00,
    vat: 10.40,
    description: "Fuel",
  },
  {
    id: "r4",
    supplier: "Amazon Business",
    date: "2026-03-15",
    amount: 156.80,
    vat: 25.09,
    description: "Computer accessories",
  },
  {
    id: "r5",
    supplier: "Café Central",
    date: "2026-03-18",
    amount: 42.50,
    vat: 6.80,
    description: "Business lunch",
  },
  {
    id: "r6",
    supplier: "Tech Solutions AG",
    date: "2026-03-20",
    amount: 1250.00,
    vat: 200.00,
    description: "Software license annual renewal",
  },
  {
    id: "r7",
    supplier: "Mobility Car Rental",
    date: "2026-03-22",
    amount: 189.00,
    vat: 30.24,
    description: "Car rental for business trip",
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "t1",
    date: "2026-03-05",
    amount: 247.50,
    description: "OFFICE DEPOT GMBH",
    status: "matched",
    suggestedReceipt: mockReceipts[0],
    availableReceipts: [mockReceipts[3]],
  },
  {
    id: "t2",
    date: "2026-03-08",
    amount: 1500.00,
    description: "CLIENT PAYMENT - INV 2024-045",
    status: "unmatched",
    availableReceipts: [],
  },
  {
    id: "t3",
    date: "2026-03-10",
    amount: 89.99,
    description: "DEUTSCHE TELEKOM",
    status: "suggestion",
    suggestedReceipt: mockReceipts[1],
    availableReceipts: [],
  },
  {
    id: "t4",
    date: "2026-03-12",
    amount: 65.00,
    description: "SHELL TANKSTELLE",
    status: "suggestion",
    suggestedReceipt: mockReceipts[2],
    availableReceipts: [mockReceipts[4]],
  },
  {
    id: "t5",
    date: "2026-03-14",
    amount: 320.00,
    description: "RENT - OFFICE SPACE",
    status: "unmatched",
    availableReceipts: [],
  },
  {
    id: "t6",
    date: "2026-03-15",
    amount: 156.80,
    description: "AMAZON BUSINESS EU",
    status: "matched",
    suggestedReceipt: mockReceipts[3],
    availableReceipts: [mockReceipts[0]],
  },
  {
    id: "t7",
    date: "2026-03-17",
    amount: 75.00,
    description: "CASH WITHDRAWAL",
    status: "unmatched",
    availableReceipts: [mockReceipts[4]],
  },
  {
    id: "t8",
    date: "2026-03-18",
    amount: 42.50,
    description: "CAFE CENTRAL",
    status: "suggestion",
    suggestedReceipt: mockReceipts[4],
    availableReceipts: [],
  },
  {
    id: "t9",
    date: "2026-03-20",
    amount: 1250.00,
    description: "TECH SOLUTIONS AG",
    status: "matched",
    suggestedReceipt: mockReceipts[5],
    availableReceipts: [],
  },
  {
    id: "t10",
    date: "2026-03-22",
    amount: 189.00,
    description: "MOBILITY CAR RENTAL",
    status: "suggestion",
    suggestedReceipt: mockReceipts[6],
    availableReceipts: [],
  },
  {
    id: "t11",
    date: "2026-03-24",
    amount: 45.00,
    description: "PARKING GARAGE",
    status: "unmatched",
    availableReceipts: [],
  },
  {
    id: "t12",
    date: "2026-03-25",
    amount: 2500.00,
    description: "CLIENT PAYMENT - INV 2024-048",
    status: "unmatched",
    availableReceipts: [],
  },
  {
    id: "t13",
    date: "2026-03-26",
    amount: 98.50,
    description: "STATIONERY SHOP",
    status: "suggestion",
    suggestedReceipt: mockReceipts[0],
    availableReceipts: [mockReceipts[3]],
  },
  {
    id: "t14",
    date: "2026-03-28",
    amount: 145.00,
    description: "COURIER SERVICE DHL",
    status: "unmatched",
    availableReceipts: [],
  },
  {
    id: "t15",
    date: "2026-03-30",
    amount: 67.80,
    description: "OFFICE CLEANING SERVICE",
    status: "matched",
    suggestedReceipt: mockReceipts[0],
    availableReceipts: [],
  },
];
