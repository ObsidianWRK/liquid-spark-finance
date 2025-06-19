import { describe, it, expect } from "vitest";
import {
  LinkedAccountSchema,
  RecurringChargeSchema,
  NegotiationCaseSchema,
  AutosavePlanSchema,
  HouseholdSchema,
  AgeMetricSchema,
  PrivacySettingSchema,
  AdvisorThreadSchema,
  SpendableCashSchema,
  HomeWidgetSchema,
} from "../schemas/gap10";

/**
 * Simple helper to make a valid ISO date string.
 */
const now = () => new Date().toISOString();

describe("Gap-10 Domain Schemas", () => {
  it("validates LinkedAccount", () => {
    const obj = {
      id: "acc1",
      provider: "mock",
      displayName: "Mock Checking",
      institutionName: "Mock Bank",
      lastFour: "1234",
      type: "checking",
      createdAt: now(),
      updatedAt: now(),
    };
    expect(LinkedAccountSchema.parse(obj)).toMatchSnapshot();
  });

  it("validates RecurringCharge", () => {
    const obj = {
      id: "rc1",
      accountId: "acc1",
      merchantName: "Netflix",
      amount: 15.99,
      frequency: "monthly",
      nextDueDate: now(),
      status: "active",
    };
    expect(RecurringChargeSchema.parse(obj)).toMatchSnapshot();
  });

  it("validates NegotiationCase", () => {
    const obj = {
      id: "case1",
      chargeId: "rc1",
      status: "queued",
      submittedAt: now(),
    };
    expect(NegotiationCaseSchema.parse(obj)).toMatchSnapshot();
  });

  it("validates AutosavePlan", () => {
    const obj = {
      id: "plan1",
      accountId: "acc1",
      targetAmount: 50,
      cadence: "weekly",
      nextTransferDate: now(),
      isActive: true,
    };
    expect(AutosavePlanSchema.parse(obj)).toMatchSnapshot();
  });

  it("validates Household", () => {
    const obj = {
      id: "house1",
      name: "Smith Family",
      members: [
        { userId: "user1", role: "owner" },
        { userId: "user2", role: "member" },
      ],
      createdAt: now(),
    };
    expect(HouseholdSchema.parse(obj)).toMatchSnapshot();
  });

  it("validates AgeMetric", () => {
    const obj = {
      averageDaysHeld: 27,
      calculatedAt: now(),
    };
    expect(AgeMetricSchema.parse(obj)).toMatchSnapshot();
  });

  it("validates PrivacySetting", () => {
    const obj = {
      hideAmounts: true,
      updatedAt: now(),
    };
    expect(PrivacySettingSchema.parse(obj)).toMatchSnapshot();
  });

  it("validates AdvisorThread", () => {
    const obj = {
      id: "thread1",
      userId: "user1",
      messages: [
        { id: "msg1", sender: "user", content: "Hi!", createdAt: now() },
      ],
      isEscalated: false,
    };
    expect(AdvisorThreadSchema.parse(obj)).toMatchSnapshot();
  });

  it("validates SpendableCash", () => {
    const obj = {
      amount: 1200,
      payday: now(),
      calculatedAt: now(),
    };
    expect(SpendableCashSchema.parse(obj)).toMatchSnapshot();
  });

  it("validates HomeWidget", () => {
    const obj = {
      id: "widget1",
      type: "balance",
      position: 1,
      config: {},
    };
    expect(HomeWidgetSchema.parse(obj)).toMatchSnapshot();
  });
}); 