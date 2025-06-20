import React from 'react';

interface ShippingInfoProps {
  trackingNumber: string;
  shippingProvider: 'UPS' | 'FedEx' | 'USPS';
  deliveryStatus?: 'In Transit' | 'Out for Delivery' | 'Delivered';
}

const ShippingInfo = ({
  trackingNumber,
  shippingProvider,
  deliveryStatus,
}: ShippingInfoProps) => {
  const getDeliveryStatusColor = (status?: string) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-400';
      case 'Out for Delivery':
        return 'text-orange-400';
      case 'In Transit':
        return 'text-blue-400';
      default:
        return 'text-white/70';
    }
  };

  return (
    <div className="transaction-shipping">
      <span>Tracking: </span>
      <span className="text-white/90 font-mono">{trackingNumber}</span>
      <span> via {shippingProvider} </span>
      <span className={`font-medium ${getDeliveryStatusColor(deliveryStatus)}`}>
        {deliveryStatus}
      </span>
    </div>
  );
};

export default ShippingInfo;
