import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Truck, 
  Package, 
  CheckCircle, 
  Clock,
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod?: string;
  reference?: string;
  shipping?: {
    trackingNumber: string;
    provider: 'UPS' | 'FedEx' | 'USPS';
    status: 'In Transit' | 'Delivered' | 'Out for Delivery';
    estimatedDelivery?: string;
  };
}

interface EnterpriseTransactionViewProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
  className?: string;
}

const EnterpriseTransactionView: React.FC<EnterpriseTransactionViewProps> = ({
  transactions,
  onTransactionClick,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Format currency
  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
    return amount < 0 ? `-${formatted}` : `+${formatted}`;
  };

  // Get status badge styles
  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Get shipping icon
  const getShippingIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Out for Delivery':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'In Transit':
        return <Package className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // Handle sorting
  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort transactions
  const processedTransactions = useMemo(() => {
    const filtered = transactions.filter(transaction =>
      transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle special cases
      if (sortField === 'amount') {
        aValue = a.amount as unknown as string;
        bValue = b.amount as unknown as string;
      } else if (sortField === 'date') {
        aValue = new Date(a.date + ' ' + a.time).getTime() as unknown as string;
        bValue = new Date(b.date + ' ' + b.time).getTime() as unknown as string;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactions, searchQuery, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedTransactions.length / itemsPerPage);
  const paginatedTransactions = processedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle selection
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === paginatedTransactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedTransactions.map(t => t.id)));
    }
  };

  const SortableHeader = ({ 
    field, 
    children 
  }: { 
    field: keyof Transaction; 
    children: React.ReactNode;
  }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown className="w-3 h-3" />
      </div>
    </th>
  );

  return (
    <div className={cn('bg-white rounded-lg shadow-lg', className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
            <p className="text-sm text-gray-500 mt-1">
              {processedTransactions.length} transactions found
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedIds.size === paginatedTransactions.length && paginatedTransactions.length > 0}
                  onChange={selectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <SortableHeader field="merchant">Merchant</SortableHeader>
              <SortableHeader field="category">Category</SortableHeader>
              <SortableHeader field="amount">Amount</SortableHeader>
              <SortableHeader field="date">Date & Time</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shipping
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTransactions.map((transaction) => (
              <tr 
                key={transaction.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onTransactionClick?.(transaction)}
              >
                <td className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(transaction.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelection(transaction.id);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{transaction.merchant}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {transaction.category}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    'font-semibold',
                    transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                  )}>
                    {formatAmount(transaction.amount)}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>{new Date(transaction.date).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">{transaction.time}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(transaction.status)}>
                    {transaction.status}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.paymentMethod || '—'}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.shipping ? (
                    <div className="flex items-center gap-2">
                      {getShippingIcon(transaction.shipping.status)}
                      <span className="text-sm text-gray-600">
                        {transaction.shipping.status}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle actions menu
                    }}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing{' '}
          <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
          {' '}to{' '}
          <span className="font-medium">
            {Math.min(currentPage * itemsPerPage, processedTransactions.length)}
          </span>
          {' '}of{' '}
          <span className="font-medium">{processedTransactions.length}</span>
          {' '}results
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="px-3 py-1 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseTransactionView; 