import { BiometricReading, InterventionAlert } from "../types";

export interface BiometricService {
  getCurrentReading: () => Promise<BiometricReading>;
  getAlerts: () => Promise<InterventionAlert[]>;
  dismissAlert: (id: string) => Promise<void>;
}

class MockBiometricService implements BiometricService {
  private alerts: InterventionAlert[] = [];

  async getCurrentReading(): Promise<BiometricReading> {
    const heartRate = Math.floor(Math.random() * 40) + 60; // 60-100 bpm
    const stressLevel = Math.floor(Math.random() * 100);
    
    let spendingRisk: 'low' | 'medium' | 'high' = 'low';
    if (stressLevel > 70) spendingRisk = 'high';
    else if (stressLevel > 40) spendingRisk = 'medium';

    // Generate intervention alerts based on stress
    if (stressLevel > 80 && this.alerts.length === 0) {
      this.alerts.push({
        id: "alert-" + Date.now(),
        type: "stress_spending",
        severity: "warning",
        message: "High stress detected. Consider taking a breathing break before making purchases.",
        createdAt: new Date().toISOString(),
        dismissed: false,
      });
    }

    return {
      id: "reading-" + Date.now(),
      timestamp: new Date().toISOString(),
      heartRate,
      stressLevel,
      spendingRisk,
    };
  }

  async getAlerts(): Promise<InterventionAlert[]> {
    return this.alerts.filter(a => !a.dismissed);
  }

  async dismissAlert(id: string): Promise<void> {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) alert.dismissed = true;
  }
}

export const biometricService: BiometricService = new MockBiometricService(); 