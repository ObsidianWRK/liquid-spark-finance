import React, { useState } from 'react';
import { Settings, Plus, Edit2, Trash2, Power, Shield, Clock, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useBiometricInterventionStore } from '../store';
import { InterventionPolicy } from '../types';

interface InterventionSettingsProps {
  className?: string;
}

interface PolicyFormData {
  name: string;
  stressThreshold: number;
  spendingAmount: number;
  consecutiveHighStress: number;
  cardFreeze: boolean;
  nudgeMessage: boolean;
  breathingExercise: boolean;
  delayPurchase: number;
  safeToSpendReduction: number;
}

const defaultPolicyForm: PolicyFormData = {
  name: 'High Stress Spending Block',
  stressThreshold: 75,
  spendingAmount: 50,
  consecutiveHighStress: 2,
  cardFreeze: false,
  nudgeMessage: true,
  breathingExercise: true,
  delayPurchase: 30,
  safeToSpendReduction: 50,
};

export const InterventionSettings: React.FC<InterventionSettingsProps> = ({
  className
}) => {
  const {
    activePolicies,
    preferences,
    isActive,
    loading,
    addPolicy,
    updatePolicy,
    deletePolicy,
    updatePreferences,
    initialize
  } = useBiometricInterventionStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<string | null>(null);
  const [formData, setFormData] = useState<PolicyFormData>(defaultPolicyForm);

  const handleToggleActive = async () => {
    if (!isActive) {
      await initialize();
    }
  };

  const handleSavePolicy = async () => {
    const policyData = {
      name: formData.name,
      enabled: true,
      triggers: {
        stressThreshold: formData.stressThreshold,
        spendingAmount: formData.spendingAmount,
        consecutiveHighStress: formData.consecutiveHighStress,
      },
      actions: {
        cardFreeze: formData.cardFreeze,
        nudgeMessage: formData.nudgeMessage,
        breathingExercise: formData.breathingExercise,
        delayPurchase: formData.delayPurchase,
        safeToSpendReduction: formData.safeToSpendReduction,
      },
      schedule: {
        enabled: false,
        startTime: '09:00',
        endTime: '22:00',
        daysOfWeek: [1, 2, 3, 4, 5], // Monday-Friday
      },
    };

    if (editingPolicy) {
      await updatePolicy(editingPolicy, policyData);
      setEditingPolicy(null);
    } else {
      await addPolicy(policyData);
      setShowAddForm(false);
    }
    
    setFormData(defaultPolicyForm);
  };

  const handleEditPolicy = (policy: InterventionPolicy) => {
    setFormData({
      name: policy.name,
      stressThreshold: policy.triggers.stressThreshold,
      spendingAmount: policy.triggers.spendingAmount,
      consecutiveHighStress: policy.triggers.consecutiveHighStress,
      cardFreeze: policy.actions.cardFreeze,
      nudgeMessage: policy.actions.nudgeMessage,
      breathingExercise: policy.actions.breathingExercise,
      delayPurchase: policy.actions.delayPurchase,
      safeToSpendReduction: policy.actions.safeToSpendReduction,
    });
    setEditingPolicy(policy.id);
    setShowAddForm(true);
  };

  const handleDeletePolicy = async (policyId: string) => {
    if (confirm('Are you sure you want to delete this policy?')) {
      await deletePolicy(policyId);
    }
  };

  const handleWearableToggle = async (device: keyof typeof preferences.wearableIntegrations) => {
    await updatePreferences({
      wearableIntegrations: {
        ...preferences.wearableIntegrations,
        [device]: !preferences.wearableIntegrations[device],
      },
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Toggle */}
      <Card className="bg-white/[0.02] border-white/[0.08]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-400" />
              <span>Biometric Interventions</span>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={handleToggleActive}
              className="data-[state=checked]:bg-blue-600"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white/70">
            {isActive 
              ? 'Smart interventions are active and monitoring your stress levels.'
              : 'Enable biometric interventions to help prevent stress-induced spending.'
            }
          </p>
        </CardContent>
      </Card>

      {isActive && (
        <>
          {/* Active Policies */}
          <Card className="bg-white/[0.02] border-white/[0.08]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Intervention Policies</span>
                <Button
                  onClick={() => setShowAddForm(true)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Policy
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activePolicies.length === 0 ? (
                <p className="text-sm text-white/60 text-center py-4">
                  No intervention policies configured. Add your first policy to get started.
                </p>
              ) : (
                activePolicies.map((policy) => (
                  <div
                    key={policy.id}
                    className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-white/90">{policy.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={policy.enabled ? "default" : "secondary"} className="text-xs">
                            {policy.enabled ? 'Active' : 'Disabled'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEditPolicy(policy)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeletePolicy(policy.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-orange-400" />
                        <span className="text-white/70">Stress Threshold:</span>
                        <span className="text-white/90">{policy.triggers.stressThreshold}/100</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-white/70">Spending Limit:</span>
                        <span className="text-white/90">${policy.triggers.spendingAmount}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-white/70">Delay:</span>
                        <span className="text-white/90">{policy.actions.delayPurchase}s</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Power className="w-4 h-4 text-purple-400" />
                        <span className="text-white/70">Actions:</span>
                        <span className="text-white/90">
                          {[
                            policy.actions.nudgeMessage && 'Nudge',
                            policy.actions.breathingExercise && 'Breathing',
                            policy.actions.cardFreeze && 'Freeze'
                          ].filter(Boolean).join(', ') || 'None'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Add/Edit Policy Form */}
          {showAddForm && (
            <Card className="bg-white/[0.02] border-white/[0.08]">
              <CardHeader>
                <CardTitle>
                  {editingPolicy ? 'Edit Policy' : 'Add New Policy'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="policy-name">Policy Name</Label>
                  <Input
                    id="policy-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter policy name"
                    className="bg-white/[0.02] border-white/[0.08]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Stress Threshold: {formData.stressThreshold}/100</Label>
                    <Slider
                      value={[formData.stressThreshold]}
                      onValueChange={([value]) => setFormData({ ...formData, stressThreshold: value })}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="spending-amount">Spending Trigger ($)</Label>
                    <Input
                      id="spending-amount"
                      type="number"
                      value={formData.spendingAmount}
                      onChange={(e) => setFormData({ ...formData, spendingAmount: Number(e.target.value) })}
                      className="bg-white/[0.02] border-white/[0.08]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Delay Purchase: {formData.delayPurchase}s</Label>
                    <Slider
                      value={[formData.delayPurchase]}
                      onValueChange={([value]) => setFormData({ ...formData, delayPurchase: value })}
                      max={300}
                      step={10}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Safe-to-Spend Reduction: {formData.safeToSpendReduction}%</Label>
                    <Slider
                      value={[formData.safeToSpendReduction]}
                      onValueChange={([value]) => setFormData({ ...formData, safeToSpendReduction: value })}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Actions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Show nudge message</span>
                      <Switch
                        checked={formData.nudgeMessage}
                        onCheckedChange={(checked) => setFormData({ ...formData, nudgeMessage: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Offer breathing exercise</span>
                      <Switch
                        checked={formData.breathingExercise}
                        onCheckedChange={(checked) => setFormData({ ...formData, breathingExercise: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Temporarily freeze card</span>
                      <Switch
                        checked={formData.cardFreeze}
                        onCheckedChange={(checked) => setFormData({ ...formData, cardFreeze: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingPolicy(null);
                      setFormData(defaultPolicyForm);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSavePolicy}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Saving...' : editingPolicy ? 'Update Policy' : 'Add Policy'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wearable Integrations */}
          <Card className="bg-white/[0.02] border-white/[0.08]">
            <CardHeader>
              <CardTitle>Wearable Devices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(preferences.wearableIntegrations).map(([device, enabled]) => (
                <div key={device} className="flex items-center justify-between">
                  <span className="text-sm capitalize">
                    {device.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <Switch
                    checked={enabled}
                    onCheckedChange={() => handleWearableToggle(device as keyof typeof preferences.wearableIntegrations)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}; 