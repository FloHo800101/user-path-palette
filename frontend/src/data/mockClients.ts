import { ClientData } from "@/components/ClientCard";

export interface VatPeriod {
  month: string;
  completeness: number;
  dueDate: string;
  status: "on-track" | "at-risk";
}

export const mockClients: ClientData[] = [
  {
    id: "1",
    name: "Müller GmbH",
    vatType: "Monatlicher USt-Melder",
    bankTransactions: 125,
    unmatchedBankTransactions: 18,
    unmatchedReceipts: 9,
    receiptCompleteness: 86,
    status: "at-risk",
    currentVatPeriod: {
      month: "März 2026",
      completeness: 78,
      dueDate: "10.04.",
      status: "at-risk",
    },
    nextVatPeriod: {
      month: "April 2026",
      completeness: 15,
      dueDate: "10.05.",
      status: "on-track",
    },
  },
  {
    id: "2",
    name: "Schmidt Consulting",
    vatType: "Vierteljährlicher USt-Melder",
    bankTransactions: 87,
    unmatchedBankTransactions: 5,
    unmatchedReceipts: 2,
    receiptCompleteness: 95,
    status: "on-track",
    currentVatPeriod: {
      month: "Q1 2026",
      completeness: 92,
      dueDate: "10.04.",
      status: "on-track",
    },
    nextVatPeriod: {
      month: "Q2 2026",
      completeness: 8,
      dueDate: "10.07.",
      status: "on-track",
    },
  },
  {
    id: "3",
    name: "Bauer & Co. KG",
    vatType: "Monatlicher USt-Melder",
    bankTransactions: 203,
    unmatchedBankTransactions: 24,
    unmatchedReceipts: 15,
    receiptCompleteness: 78,
    status: "at-risk",
    currentVatPeriod: {
      month: "März 2026",
      completeness: 65,
      dueDate: "10.04.",
      status: "at-risk",
    },
    nextVatPeriod: {
      month: "April 2026",
      completeness: 22,
      dueDate: "10.05.",
      status: "on-track",
    },
  },
  {
    id: "4",
    name: "Alpha Design Studio",
    vatType: "Vierteljährlicher USt-Melder",
    bankTransactions: 64,
    unmatchedBankTransactions: 3,
    unmatchedReceipts: 1,
    receiptCompleteness: 98,
    status: "on-track",
    currentVatPeriod: {
      month: "Q1 2026",
      completeness: 96,
      dueDate: "10.04.",
      status: "on-track",
    },
    nextVatPeriod: {
      month: "Q2 2026",
      completeness: 5,
      dueDate: "10.07.",
      status: "on-track",
    },
  },
  {
    id: "5",
    name: "GreenTech Solutions",
    vatType: "Monatlicher USt-Melder",
    bankTransactions: 156,
    unmatchedBankTransactions: 8,
    unmatchedReceipts: 4,
    receiptCompleteness: 92,
    status: "on-track",
    currentVatPeriod: {
      month: "März 2026",
      completeness: 88,
      dueDate: "10.04.",
      status: "on-track",
    },
    nextVatPeriod: {
      month: "April 2026",
      completeness: 12,
      dueDate: "10.05.",
      status: "on-track",
    },
  },
  {
    id: "6",
    name: "Fischer Handels GmbH",
    vatType: "Monatlicher USt-Melder",
    bankTransactions: 178,
    unmatchedBankTransactions: 21,
    unmatchedReceipts: 12,
    receiptCompleteness: 82,
    status: "at-risk",
    currentVatPeriod: {
      month: "März 2026",
      completeness: 70,
      dueDate: "10.04.",
      status: "at-risk",
    },
    nextVatPeriod: {
      month: "April 2026",
      completeness: 18,
      dueDate: "10.05.",
      status: "on-track",
    },
  },
];
