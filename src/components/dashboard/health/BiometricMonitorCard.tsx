import React from "react";
import { BiometricMonitor } from "@/features/biometric-intervention";

interface BiometricMonitorCardProps {
  compact?: boolean;
}

export const BiometricMonitorCard: React.FC<BiometricMonitorCardProps> = ({ compact = false }) => {
  return <BiometricMonitor compact={compact} />;
}; 