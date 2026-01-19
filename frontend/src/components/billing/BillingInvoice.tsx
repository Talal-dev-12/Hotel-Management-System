import { Search, Download, Printer, Eye, Filter } from 'lucide-react';
import { useState } from 'react';

export default function BillingInvoice() {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const invoices = [
    { 
      id: 'INV-2001', 
      bookingId: 'BK-2001',
      guest: 'John Smith', 
      room: '305', 
      checkIn: '2026-01-15',
      checkOut: '2026-01-20',
      roomCharges: 1250,
      services: [
        { name: 'Room Service', amount: 120 },
        { name: 'Laundry', amount: 45 },
        { name: 'Mini Bar', amount: 85 }
      ],
      tax: 150,
      total: 1650,
      status: 'Paid',
      paymentMethod: 'Credit Card',
      date: '2026-01-20'
    },
    { 
      id: 'INV-2002', 
      bookingId: 'BK-2002',
      guest: 'Emma Wilson', 
      room: '412', 
      checkIn: '2026-01-18',
      checkOut: '2026-01-21',
      roomCharges: 1350,
      services: [
        { name: 'Spa Treatment', amount: 200 },
        { name: 'Airport Transfer', amount: 50 }
      ],
      tax: 160,
      total: 1760,
      status: 'Pending',
      paymentMethod: 'Pending',
      date: '2026-01-21'
    },
  ];

  const viewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const printInvoice = () => {
    window.print();
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
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg">
            Generate Invoice
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">$45,280</p>
          <p className="text-sm text-emerald-600 mt-1">+12% from last month</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Paid Invoices</p>
          <p className="text-3xl font-bold text-emerald-600">234</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Pending Payments</p>
          <p className="text-3xl font-bold text-amber-600">18</p>
          <p className="text-sm text-gray-600 mt-1">Awaiting payment</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2">Overdue</p>
          <p className="text-3xl font-bold text-red-600">3</p>
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
              placeholder="Search by invoice ID, guest name, or booking ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option>All Status</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Overdue</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            Filters
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Invoice ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Guest Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Room</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Check-Out</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Payment</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-semibold text-gray-900">{invoice.id}</td>
                  <td className="py-4 px-6 text-gray-700">{invoice.guest}</td>
                  <td className="py-4 px-6 text-gray-700">#{invoice.room}</td>
                  <td className="py-4 px-6 text-gray-700">{invoice.checkOut}</td>
                  <td className="py-4 px-6 font-semibold text-emerald-600">${invoice.total}</td>
                  <td className="py-4 px-6 text-gray-700">{invoice.paymentMethod}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                      invoice.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {invoice.status}
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
                    LuxuryStay
                  </h1>
                  <p className="text-gray-600">Hospitality Management</p>
                  <p className="text-sm text-gray-500 mt-2">123 Luxury Avenue, City, State 12345</p>
                  <p className="text-sm text-gray-500">Phone: +1 (555) 123-4567</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
                  <p className="text-gray-600">#{selectedInvoice.id}</p>
                  <p className="text-sm text-gray-500 mt-2">Date: {selectedInvoice.date}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                    selectedInvoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              {/* Guest Information */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Bill To:</h3>
                <p className="font-medium text-gray-900">{selectedInvoice.guest}</p>
                <p className="text-gray-600">Booking ID: {selectedInvoice.bookingId}</p>
                <p className="text-gray-600">Room: #{selectedInvoice.room}</p>
                <p className="text-gray-600">Stay: {selectedInvoice.checkIn} to {selectedInvoice.checkOut}</p>
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
                    {selectedInvoice.services.map((service: any, index: number) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-gray-700">{service.name}</td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">${service.amount}</td>
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
                      ${selectedInvoice.roomCharges + selectedInvoice.services.reduce((acc: number, s: any) => acc + s.amount, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (10%)</span>
                    <span className="font-medium">${selectedInvoice.tax}</span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3 mt-3 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-emerald-600">${selectedInvoice.total}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Payment Method:</span> {selectedInvoice.paymentMethod}
                </p>
                {selectedInvoice.status === 'Paid' && (
                  <p className="text-sm text-emerald-600 font-medium mt-1">✓ Payment received on {selectedInvoice.date}</p>
                )}
              </div>

              {/* Footer */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">Thank you for choosing LuxuryStay Hospitality!</p>
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
    </div>
  );
}
