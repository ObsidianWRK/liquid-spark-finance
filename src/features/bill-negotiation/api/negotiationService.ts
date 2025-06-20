import { NegotiationCase } from '../types';

export interface NegotiationService {
  submitNegotiation: (chargeId: string) => Promise<NegotiationCase>;
  getNegotiationStatus: (
    caseId: string
  ) => Promise<NegotiationCase | undefined>;
}

class MockNegotiationService implements NegotiationService {
  private cases: NegotiationCase[] = [];

  async submitNegotiation(chargeId: string): Promise<NegotiationCase> {
    const newCase: NegotiationCase = {
      id: 'case-' + Math.random().toString(36).substring(2),
      chargeId,
      status: 'queued',
      submittedAt: new Date().toISOString(),
    };
    this.cases.push(newCase);
    return newCase;
  }

  async getNegotiationStatus(
    caseId: string
  ): Promise<NegotiationCase | undefined> {
    return this.cases.find((c) => c.id === caseId);
  }
}

export const negotiationService: NegotiationService =
  new MockNegotiationService();
