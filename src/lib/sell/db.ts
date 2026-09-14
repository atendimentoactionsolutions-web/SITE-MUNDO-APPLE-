import fs from "fs";
import path from "path";

// Resolving absolute path to db_backup.json inside the project
const BACKUP_FILE = path.join(process.cwd(), "db_backup.json");

// Helper to load persistent database state from local JSON file
function loadDatabaseState() {
  try {
    if (fs.existsSync(BACKUP_FILE)) {
      const raw = fs.readFileSync(BACKUP_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load persistent JSON database state:", e);
  }
  return null;
}

// Helper to save state synchronously to local JSON file
export function saveDatabaseState() {
  try {
    const data = {
      brands: global.__dbBrands || [],
      deviceModels: global.__dbDeviceModels || [],
      storageOptions: global.__dbStorageOptions || [],
      deviceVariants: global.__dbDeviceVariants || [],
      priceBooks: global.__dbPriceBooks || [],
      purchasePrices: global.__dbPurchasePrices || [],
      deflators: global.__dbDeflators || [],
      priceBookDeflators: global.__dbPriceBookDeflators || [],
      sellQuotes: global.__dbSellQuotes || [],
      quoteAnswers: global.__dbQuoteAnswers || [],
      quoteDeflators: global.__dbQuoteDeflators || [],
      customers: global.__dbCustomers || [],
      inspections: global.__dbInspections || [],
      inspectionIssues: global.__dbInspectionIssues || [],
      auditLogs: global.__dbAuditLogs || [],
    };
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to persist JSON database state:", e);
  }
}

// Initialize tables from JSON backup on startup if file exists
const savedState = loadDatabaseState();
if (savedState) {
  global.__dbBrands = savedState.brands;
  global.__dbDeviceModels = savedState.deviceModels;
  global.__dbStorageOptions = savedState.storageOptions;
  global.__dbDeviceVariants = savedState.deviceVariants;
  global.__dbPriceBooks = savedState.priceBooks;
  global.__dbPurchasePrices = savedState.purchasePrices;
  global.__dbDeflators = savedState.deflators;
  global.__dbPriceBookDeflators = savedState.priceBookDeflators;
  global.__dbSellQuotes = savedState.sellQuotes;
  global.__dbQuoteAnswers = savedState.quoteAnswers;
  global.__dbQuoteDeflators = savedState.quoteDeflators;
  global.__dbCustomers = savedState.customers;
  global.__dbInspections = savedState.inspections;
  global.__dbInspectionIssues = savedState.inspectionIssues;
  global.__dbAuditLogs = savedState.auditLogs;
}

// Brand
export interface Brand {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Device Model
export interface DeviceModel {
  id: string;
  brandId: string;
  name: string;
  slug: string;
  family: string;
  generation: string;
  active: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Storage Option
export interface StorageOption {
  id: string;
  capacityGb: number;
  displayName: string;
  createdAt: string;
}

// Device Variant (Unique combination of DeviceModel and StorageOption)
export interface DeviceVariant {
  id: string;
  deviceModelId: string;
  storageOptionId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Price Book
export interface PriceBook {
  id: string;
  name: string;
  active: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

// Purchase Price (Base and Minimum purchase prices for a Device Variant)
export interface PurchasePrice {
  id: string;
  priceBookId: string;
  deviceVariantId: string;
  basePrice: number;
  minimumPrice: number;
  active: boolean;
  effectiveFrom: string;
  effectiveUntil?: string;
  createdAt: string;
  updatedAt: string;
}

// Deflator Type
export type DeflatorType = "FIXED" | "PERCENTAGE";

// Deflator definition
export interface Deflator {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  type: DeflatorType;
  value: number; // default value
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Override value of a deflator for specific models/variants
export interface PriceBookDeflator {
  id: string;
  priceBookId: string;
  deflatorId: string;
  deviceModelId?: string;
  deviceVariantId?: string;
  overrideValue?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Quote Answer
export interface QuoteAnswer {
  id: string;
  quoteId: string;
  questionCode: string;
  answer: string;
  createdAt: string;
}

// Quote Deflator Snapshot
export interface QuoteDeflator {
  id: string;
  quoteId: string;
  deflatorId: string;
  labelSnapshot: string;
  typeSnapshot: DeflatorType;
  valueSnapshot: number;
  calculatedDiscount: number;
  createdAt: string;
}

// Customer
export interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  cep?: string;
  city?: string;
  state?: string;
  consentLgpd: boolean;
  createdAt: string;
  updatedAt: string;
}

// Sell Quote Status
export type QuoteStatus =
  | "DRAFT"
  | "QUOTED"
  | "MANUAL_REVIEW"
  | "CUSTOMER_ACCEPTED"
  | "CONTACTED"
  | "SCHEDULED"
  | "DEVICE_RECEIVED"
  | "INSPECTION"
  | "REVISED_OFFER"
  | "APPROVED"
  | "PAID"
  | "CUSTOMER_REJECTED"
  | "CANCELED"
  | "EXPIRED"
  | "ICLOUD_BLOCKED"
  | "IMEI_BLOCKED"
  | "BLOCKED";

// Sell Quote
export interface SellQuote {
  id: string;
  publicCode: string;
  customerId?: string;
  deviceVariantId: string;
  priceBookId?: string;
  basePriceSnapshot: number;
  discountSnapshot: number;
  percentageDiscountTotal: number;
  fixedDiscountTotal: number;
  calculatedPrice: number;
  finalPrice: number;
  status: QuoteStatus;
  manualReview: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

// Inspection
export interface Inspection {
  id: string;
  quoteId: string;
  status: string;
  technicianId?: string;
  originalQuotedPrice: number;
  approvedPrice?: number;
  notes?: string;
  inspectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Inspection Issue
export interface InspectionIssue {
  id: string;
  inspectionId: string;
  deflatorId?: string;
  description: string;
  discount?: number;
  createdAt: string;
}

// Audit Log (for tracking edits to price lists, deflators, etc.)
export interface AuditLog {
  id: string;
  action: string;
  entityName: string;
  entityId: string;
  previousValue?: string;
  newValue?: string;
  userId?: string;
  userName?: string;
  createdAt: string;
}

// ----------------------------------------------------
// Global in-memory storage (simulating database tables)
// ----------------------------------------------------
declare global {
  var __dbBrands: Brand[] | undefined;
  var __dbDeviceModels: DeviceModel[] | undefined;
  var __dbStorageOptions: StorageOption[] | undefined;
  var __dbDeviceVariants: DeviceVariant[] | undefined;
  var __dbPriceBooks: PriceBook[] | undefined;
  var __dbPurchasePrices: PurchasePrice[] | undefined;
  var __dbDeflators: Deflator[] | undefined;
  var __dbPriceBookDeflators: PriceBookDeflator[] | undefined;
  var __dbSellQuotes: SellQuote[] | undefined;
  var __dbQuoteAnswers: QuoteAnswer[] | undefined;
  var __dbQuoteDeflators: QuoteDeflator[] | undefined;
  var __dbCustomers: Customer[] | undefined;
  var __dbInspections: Inspection[] | undefined;
  var __dbInspectionIssues: InspectionIssue[] | undefined;
  var __dbAuditLogs: AuditLog[] | undefined;
}

export const db = {
  get brands() {
    if (!global.__dbBrands) global.__dbBrands = [];
    return global.__dbBrands;
  },
  set brands(val) {
    global.__dbBrands = val;
    saveDatabaseState();
  },

  get deviceModels() {
    if (!global.__dbDeviceModels) global.__dbDeviceModels = [];
    return global.__dbDeviceModels;
  },
  set deviceModels(val) {
    global.__dbDeviceModels = val;
    saveDatabaseState();
  },

  get storageOptions() {
    if (!global.__dbStorageOptions) global.__dbStorageOptions = [];
    return global.__dbStorageOptions;
  },
  set storageOptions(val) {
    global.__dbStorageOptions = val;
    saveDatabaseState();
  },

  get deviceVariants() {
    if (!global.__dbDeviceVariants) global.__dbDeviceVariants = [];
    return global.__dbDeviceVariants;
  },
  set deviceVariants(val) {
    global.__dbDeviceVariants = val;
    saveDatabaseState();
  },

  get priceBooks() {
    if (!global.__dbPriceBooks) global.__dbPriceBooks = [];
    return global.__dbPriceBooks;
  },
  set priceBooks(val) {
    global.__dbPriceBooks = val;
    saveDatabaseState();
  },

  get purchasePrices() {
    if (!global.__dbPurchasePrices) global.__dbPurchasePrices = [];
    return global.__dbPurchasePrices;
  },
  set purchasePrices(val) {
    global.__dbPurchasePrices = val;
    saveDatabaseState();
  },

  get deflators() {
    if (!global.__dbDeflators) global.__dbDeflators = [];
    return global.__dbDeflators;
  },
  set deflators(val) {
    global.__dbDeflators = val;
    saveDatabaseState();
  },

  get priceBookDeflators() {
    if (!global.__dbPriceBookDeflators) global.__dbPriceBookDeflators = [];
    return global.__dbPriceBookDeflators;
  },
  set priceBookDeflators(val) {
    global.__dbPriceBookDeflators = val;
    saveDatabaseState();
  },

  get sellQuotes() {
    if (!global.__dbSellQuotes) global.__dbSellQuotes = [];
    return global.__dbSellQuotes;
  },
  set sellQuotes(val) {
    global.__dbSellQuotes = val;
    saveDatabaseState();
  },

  get quoteAnswers() {
    if (!global.__dbQuoteAnswers) global.__dbQuoteAnswers = [];
    return global.__dbQuoteAnswers;
  },
  set quoteAnswers(val) {
    global.__dbQuoteAnswers = val;
    saveDatabaseState();
  },

  get quoteDeflators() {
    if (!global.__dbQuoteDeflators) global.__dbQuoteDeflators = [];
    return global.__dbQuoteDeflators;
  },
  set quoteDeflators(val) {
    global.__dbQuoteDeflators = val;
    saveDatabaseState();
  },

  get customers() {
    if (!global.__dbCustomers) global.__dbCustomers = [];
    return global.__dbCustomers;
  },
  set customers(val) {
    global.__dbCustomers = val;
    saveDatabaseState();
  },

  get inspections() {
    if (!global.__dbInspections) global.__dbInspections = [];
    return global.__dbInspections;
  },
  set inspections(val) {
    global.__dbInspections = val;
    saveDatabaseState();
  },

  get inspectionIssues() {
    if (!global.__dbInspectionIssues) global.__dbInspectionIssues = [];
    return global.__dbInspectionIssues;
  },
  set inspectionIssues(val) {
    global.__dbInspectionIssues = val;
    saveDatabaseState();
  },

  get auditLogs() {
    if (!global.__dbAuditLogs) global.__dbAuditLogs = [];
    return global.__dbAuditLogs;
  },
  set auditLogs(val) {
    global.__dbAuditLogs = val;
    saveDatabaseState();
  },
};

// Auto-seed if database is empty or missing deflators / purchase prices
if (
  !global.__dbDeflators ||
  global.__dbDeflators.length === 0 ||
  !global.__dbPurchasePrices ||
  global.__dbPurchasePrices.length === 0
) {
  try {
    const { runSeed } = require("./seeds");
    runSeed();
  } catch (err) {
    console.error("Auto-seed error:", err);
  }
}
