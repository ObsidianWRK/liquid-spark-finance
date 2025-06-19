import { z } from "zod";

export const LinkedAccountSchema = z.object({
  id: z.string(),
  provider: z.string(),
  displayName: z.string(),
  institutionName: z.string(),
  lastFour: z.string().length(4),
  type: z.enum(["checking", "savings", "credit", "loan", "investment"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const RecurringChargeSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  merchantName: z.string(),
  amount: z.number(),
  frequency: z.enum(["weekly", "biweekly", "monthly", "quarterly", "yearly"]),
  nextDueDate: z.string(),
  status: z.enum(["active", "canceled", "pending_cancel"]),
});

export const NegotiationCaseSchema = z.object({
  id: z.string(),
  chargeId: z.string(),
  status: z.enum(["queued", "in_progress", "completed", "failed"]),
  savingsAmount: z.number().optional(),
  submittedAt: z.string(),
  completedAt: z.string().optional(),
});

export const AutosavePlanSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  targetAmount: z.number(),
  cadence: z.enum(["daily", "weekly", "monthly"]),
  nextTransferDate: z.string(),
  isActive: z.boolean(),
});

export const HouseholdMemberSchema = z.object({
  userId: z.string(),
  role: z.enum(["owner", "admin", "member"]),
});

export const HouseholdSchema = z.object({
  id: z.string(),
  name: z.string(),
  members: z.array(HouseholdMemberSchema),
  createdAt: z.string(),
});

export const AgeMetricSchema = z.object({
  averageDaysHeld: z.number(),
  calculatedAt: z.string(),
});

export const PrivacySettingSchema = z.object({
  hideAmounts: z.boolean(),
  updatedAt: z.string(),
});

export const AdvisorMessageSchema = z.object({
  id: z.string(),
  sender: z.enum(["user", "advisor", "system"]),
  content: z.string(),
  createdAt: z.string(),
});

export const AdvisorThreadSchema = z.object({
  id: z.string(),
  userId: z.string(),
  messages: z.array(AdvisorMessageSchema),
  isEscalated: z.boolean(),
});

export const SpendableCashSchema = z.object({
  amount: z.number(),
  payday: z.string(),
  calculatedAt: z.string(),
});

export const HomeWidgetSchema = z.object({
  id: z.string(),
  type: z.enum(["balance", "safe_to_spend"]),
  position: z.number(),
  config: z.record(z.unknown()),
}); 