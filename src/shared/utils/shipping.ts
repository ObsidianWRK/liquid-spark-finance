export const carrierUrl = (carrier: string | undefined, track: string): string => {
  if (!track) return '#';
  switch (carrier) {
    case 'UPS':
      return `https://www.ups.com/track?tracknum=${track}`;
    case 'FedEx':
      return `https://www.fedex.com/fedextrack/?trknbr=${track}`;
    case 'USPS':
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${track}`;
    case 'DHL':
      return `https://www.dhl.com/en/express/tracking.html?AWB=${track}`;
    default:
      return '#';
  }
};

export const prettyShipStatus = (status?: string): string => {
  switch (status) {
    case 'DELIVERED':
      return 'Delivered';
    case 'OUT_FOR_DELIVERY':
      return 'Out for Delivery';
    case 'IN_TRANSIT':
      return 'In Transit';
    case 'PENDING':
      return 'Pending';
    default:
      return '–';
  }
}; 