import React, { useEffect } from "react";
import { useBiometricStore } from "../store";
import { UniversalCard } from "@/components/ui/UniversalCard";
import { Activity } from "lucide-react";

export const BiometricMonitorCard: React.FC = () => {
  const { reading, loading, refresh } = useBiometricStore((s) => ({
    reading: s.reading,
    loading: s.loading,
    refresh: s.refresh,
  }));

  useEffect(() => {
    refresh();
  }, [refresh]);

  const wellnessScore = reading?.stressLevel ? 100 - reading.stressLevel : undefined;

  return (
    <UniversalCard
      variant="wellness"
      size="md"
      title="Biometric Monitor"
      icon={Activity}
      iconColor="#06b6d4"
      score={wellnessScore}
      orientation="vertical"
      data={{
        metrics: reading ? [
          {
            label: "Heart Rate",
            value: `${reading.heartRate} BPM`,
            icon: Activity,
            color: "#ef4444"
          },
          {
            label: "Stress Level",
            value: `${reading.stressLevel}%`,
            icon: Activity,
            color: reading.stressLevel > 70 ? "#ef4444" : reading.stressLevel > 40 ? "#f59e0b" : "#10b981"
          },
          {
            label: "Risk Level",
            value: reading.spendingRisk.charAt(0).toUpperCase() + reading.spendingRisk.slice(1),
            icon: Activity,
            color: reading.spendingRisk === "high" ? "#ef4444" : reading.spendingRisk === "medium" ? "#f59e0b" : "#10b981"
          }
        ] : undefined
      }}
    >
      {!reading && (
        <div className="text-center">
          <p className="text-white/60 text-sm">
            {loading ? "Reading biometrics..." : "No device connected"}
          </p>
        </div>
      )}
    </UniversalCard>
  );
}; 