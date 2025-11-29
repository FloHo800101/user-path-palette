export interface VatPeriodStatus {
  month: string;
  year: number;
  missingReceipts: number;
  completeness: number;
  status: 'im-plan' | 'kritisch';
  dueDate?: string;
}

export interface Message {
  id: string;
  from: string;
  type: 'kanzlei' | 'system';
  text: string;
  date: string;
}

export const currentVatPeriod: VatPeriodStatus = {
  month: 'März',
  year: 2026,
  missingReceipts: 4,
  completeness: 72,
  status: 'kritisch',
  dueDate: '10.04.2026'
};

export const periodsNeedingAttention: VatPeriodStatus[] = [
  {
    month: 'Februar',
    year: 2024,
    missingReceipts: 3,
    completeness: 65,
    status: 'kritisch'
  },
  {
    month: 'Januar',
    year: 2024,
    missingReceipts: 2,
    completeness: 78,
    status: 'kritisch'
  },
  {
    month: 'Dezember',
    year: 2023,
    missingReceipts: 5,
    completeness: 58,
    status: 'kritisch'
  }
];

export const messages: Message[] = [
  {
    id: '1',
    from: 'Sabine Kramer',
    type: 'kanzlei',
    text: 'Für März fehlen noch 4 Belege (Hotel, Bahn, Bewirtung).',
    date: '2026-03-28'
  },
  {
    id: '2',
    from: 'System',
    type: 'system',
    text: 'Die PSP-Abrechnung von PayPal für Februar 2024 liegt noch nicht vor.',
    date: '2026-03-27'
  },
  {
    id: '3',
    from: 'Ihre Kanzlei',
    type: 'kanzlei',
    text: 'Bitte denken Sie an die Reisekostenabrechnung für die Dienstreise nach Berlin.',
    date: '2026-03-25'
  },
  {
    id: '4',
    from: 'System',
    type: 'system',
    text: 'Erinnerung: Die UStVA-Frist für März endet am 10.04.2026.',
    date: '2026-03-24'
  },
  {
    id: '5',
    from: 'Sabine Kramer',
    type: 'kanzlei',
    text: 'Bitte laden Sie die ausstehenden Tankbelege für Februar hoch.',
    date: '2026-03-22'
  }
];
