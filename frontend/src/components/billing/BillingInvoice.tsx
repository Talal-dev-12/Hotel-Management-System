import { Search, Download, Printer, Eye, Filter, Plus, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useInvoice } from '../../hooks/useInvoice';
import type { Invoice } from '../../types/invoice.types';

export default function BillingInvoice() {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const {
    invoices,
    currentInvoice,
    loading,
    error,
    fetchInvoices,
    generateInvoice,
    updatePayment
  } = useInvoice();

  // Fetch invoices on mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Filter invoices based on search and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof invoice.guestId === 'object' ? 
        invoice.guestId.name.toLowerCase().includes(searchTerm.toLowerCase()) : 
        false);
    
    const matchesStatus = statusFilter === 'All Status' || invoice.paymentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const viewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const printInvoice = () => {
    window.print();
  };

  // Calculate summary stats
  const stats = {
    totalRevenue: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    paidCount: invoices.filter(inv => inv.paymentStatus === 'Paid').length,
    pendingCount: invoices.filter(inv => inv.paymentStatus === 'Unpaid' || inv.paymentStatus === 'Partially Paid').length,
    overdueCount: invoices.filter(inv => inv.paymentStatus === 'Unpaid').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-100 text-emerald-700';
      case 'Pending':
      case 'Partially Paid':
        return 'bg-amber-100 text-amber-700';
      case 'Unpaid':
        return 'bg-red-100 text-red-700';
      case 'Refunded':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getGuestName = (guestId: any) => {
    if (typeof guestId === 'object') {
      return guestId.name;
    }
    return 'Guest';
  };

  const getRoomInfo = (reservationId: any) => {
    if (typeof reservationId === 'object' && reservationId.roomId) {
      return typeof reservationId.roomId === 'object' 
        ? reservationId.roomId.roomNumber 
        : reservationId.roomId;
    }
    return 'N/A';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Invoices</h1>
          <p className="text-gray-600 mt-1">Manage guest bills and generate invoices</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={20} />
            Export
          </button>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg"
          >
            <Plus size={20} />
            Generate Invoice
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-emerald-600 mt-1">All invoices</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Paid Invoices</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.paidCount}</p>
          <p className="text-sm text-gray-600 mt-1">Completed payments</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Pending Payments</p>
          <p className="text-3xl font-bold text-amber-600">{stats.pendingCount}</p>
          <p className="text-sm text-gray-600 mt-1">Awaiting payment</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Unpaid</p>
          <p className="text-3xl font-bold text-red-600">{stats.overdueCount}</p>
          <p className="text-sm text-gray-600 mt-1">Requires attention</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by invoice ID or guest name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option>All Status</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Partially Paid</option>
            <option>Unpaid</option>
            <option>Refunded</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            More Filters
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-emerald-600" size={48} />
            <p className="ml-4 text-gray-600">Loading invoices...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No invoices found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Invoice ID</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Guest Name</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Room</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Paid</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Balance</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-semibold text-gray-900">{invoice.invoiceNumber}</td>
                    <td className="py-4 px-6 text-gray-700">{getGuestName(invoice.guestId)}</td>
                    <td className="py-4 px-6 text-gray-700">#{getRoomInfo(invoice.reservationId)}</td>
                    <td className="py-4 px-6 font-semibold text-emerald-600">${invoice.totalAmount}</td>
                    <td className="py-4 px-6 text-gray-700">${invoice.amountPaid}</td>
                    <td className="py-4 px-6 text-gray-700">${invoice.balanceAmount}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.paymentStatus)}`}>
                        {invoice.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => viewInvoice(invoice)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Invoice"
                        >
                          <Eye size={18} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                          <Download size={18} className="text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Print">
                          <Printer size={18} className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Invoice Header */}
              <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-200">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    LuxuryStay Hotel
                  </h1>
                  <p className="text-gray-600">Hospitality Management System</p>
                  <p className="text-sm text-gray-500 mt-2">123 Luxury Avenue, City, State 12345</p>
                  <p className="text-sm text-gray-500">Phone: +1 (555) 123-4567</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
                  <p className="text-gray-600">#{selectedInvoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-500 mt-2">Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(selectedInvoice.paymentStatus)}`}>
                    {selectedInvoice.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Guest Information */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Bill To:</h3>
                <p className="font-medium text-gray-900">
                  {typeof selectedInvoice.guestId === 'object' ? selectedInvoice.guestId.name : 'Guest'}
                </p>
                <p className="text-gray-600">
                  Email: {typeof selectedInvoice.guestId === 'object' ? selectedInvoice.guestId.email : 'N/A'}
                </p>
                <p className="text-gray-600">
                  Phone: {typeof selectedInvoice.guestId === 'object' ? (selectedInvoice.guestId.phone || 'N/A') : 'N/A'}
                </p>
              </div>

              {/* Invoice Items */}
              <div className="mb-8">
                <table className="w-full">
                  <thead className="bg-gray-50 border-y border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Description</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-700">Room Charges</td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">${selectedInvoice.roomCharges}</td>
                    </tr>
                    {selectedInvoice.serviceCharges.map((service, index: number) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-700">
                          {service.serviceName} (x{service.quantity})
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          ${(service.amount * service.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      ${(selectedInvoice.roomCharges + 
                        selectedInvoice.serviceCharges.reduce((sum, s) => sum + (s.amount * s.quantity), 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>GST ({selectedInvoice.taxes.gst}%)</span>
                    <span className="font-medium">${selectedInvoice.taxes.gst}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Service Tax ({selectedInvoice.taxes.serviceTax}%)</span>
                    <span className="font-medium">${selectedInvoice.taxes.serviceTax}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Discount</span>
                      <span className="font-medium">-${selectedInvoice.discount}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-300 pt-3 mt-3 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-emerald-600">${selectedInvoice.totalAmount}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3 mt-3 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Amount Paid</span>
                    <span className="text-2xl font-bold text-blue-600">${selectedInvoice.amountPaid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Balance Due</span>
                    <span className={`text-2xl font-bold ${selectedInvoice.balanceAmount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      ${selectedInvoice.balanceAmount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Payment Method:</span> {selectedInvoice.paymentMethod || 'Not specified'}
                </p>
                {selectedInvoice.paymentStatus === 'Paid' && selectedInvoice.createdAt && (
                  <p className="text-sm text-emerald-600 font-medium mt-1">
                    ✓ Payment received on {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">Thank you for choosing LuxuryStay Hotel!</p>
                <p className="text-xs text-gray-500 mt-2">This is a computer-generated invoice.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end bg-gray-50">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={printInvoice}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
              >
                <Printer size={18} />
                Print
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg">
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Invoice Modal - Placeholder */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Generate New Invoice</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Reservation *</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>-- Choose a reservation --</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Services</label>
                <p className="text-sm text-gray-600">Add service charges if applicable</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg">
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}