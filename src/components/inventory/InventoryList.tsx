import React, { useState } from 'react';
import {
  Boxes, Plus, Search, Filter, Download, ArrowUpRight, ArrowDownRight,
  AlertTriangle, ShieldCheck, CheckCircle2, Package
} from 'lucide-react';
import { InventoryItem } from '../../types';
import { useHostel } from '../../context/HostelContext';
import { formatCurrency, formatDate, getStatusBadgeClass, exportToCSV } from '../../utils/formatters';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

export const InventoryList: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryStock } = useHostel();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Stock in/out modal
  const [selectedItemForStock, setSelectedItemForStock] = useState<InventoryItem | null>(null);
  const [stockDelta, setStockDelta] = useState(5);
  const [stockAction, setStockAction] = useState<'in' | 'out' | 'damage'>('in');

  // New Item State
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Furniture' as InventoryItem['category'],
    totalQuantity: 20,
    availableQuantity: 20,
    damagedQuantity: 0,
    location: 'Central Hostel Warehouse',
    purchaseDate: new Date().toISOString().split('T')[0],
    cost: 1500,
    minThreshold: 5,
    status: 'In Stock' as InventoryItem['status']
  });

  const filteredInventory = inventory.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || item.name.toLowerCase().includes(q) || item.itemCode.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
    const matchesCat = !categoryFilter || item.category === categoryFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const lowStockCount = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length;
  const totalAssetsVal = inventory.reduce((sum, i) => sum + i.totalQuantity * i.cost, 0);

  const handleStockUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForStock) return;
    updateInventoryStock(selectedItemForStock.id, Number(stockDelta), stockAction);
    showToast(`Inventory updated for ${selectedItemForStock.name}!`, 'success');
    setSelectedItemForStock(null);
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) {
      showToast('Item name is required.', 'danger');
      return;
    }
    const created = addInventoryItem(newItem);
    showToast(`Added ${created.name} (${created.itemCode}) to warehouse!`, 'success');
    setIsAddModalOpen(false);
    setNewItem({
      name: '',
      category: 'Furniture',
      totalQuantity: 20,
      availableQuantity: 20,
      damagedQuantity: 0,
      location: 'Central Hostel Warehouse',
      purchaseDate: new Date().toISOString().split('T')[0],
      cost: 1500,
      minThreshold: 5,
      status: 'In Stock'
    });
  };

  const handleExport = () => {
    const data = filteredInventory.map(i => ({
      'Item Code': i.itemCode,
      'Item Name': i.name,
      'Category': i.category,
      'Total Qty': i.totalQuantity,
      'Available': i.availableQuantity,
      'Damaged': i.damagedQuantity,
      'Unit Cost': i.cost,
      'Total Value': i.totalQuantity * i.cost,
      'Location': i.location,
      'Status': i.status
    }));
    exportToCSV(`HostelHub_Inventory_${new Date().toISOString().split('T')[0]}`, data);
    showToast('Inventory report exported to CSV!', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Hostel Assets & Inventory Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track beds, mattresses, study tables, fans, appliances, stock movements, and breakage audits
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Asset Item</span>
          </button>
        </div>
      </div>

      {/* 4 Asset Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Total Item Types</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{inventory.length} Assets</p>
          <span className="text-[10px] text-slate-400">Tracked in registry</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Estimated Asset Value</span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {formatCurrency(totalAssetsVal)}
          </p>
          <span className="text-[10px] text-slate-400">Total equipment valuation</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Low Stock Alerts</span>
          <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{lowStockCount}</p>
          <span className="text-[10px] text-amber-600 font-bold">Needs procurement order</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-400 font-medium">Total Damaged Assets</span>
          <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
            {inventory.reduce((sum, i) => sum + i.damagedQuantity, 0)} Units
          </p>
          <span className="text-[10px] text-rose-500 font-medium">Under repair/write-off</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search asset name, code, storage room..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="Furniture">Furniture</option>
            <option value="Bedding">Bedding</option>
            <option value="Electrical">Electrical</option>
            <option value="Electronics">Electronics</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Kitchen">Kitchen</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="">All Stock Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase font-bold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Item Code</th>
                <th className="py-3.5 px-3">Item Name</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3 text-center">Total Stock</th>
                <th className="py-3.5 px-3 text-center">Available</th>
                <th className="py-3.5 px-3 text-center">Damaged</th>
                <th className="py-3.5 px-3">Warehouse Location</th>
                <th className="py-3.5 px-3 text-right">Unit Cost</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInventory.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                    {item.itemCode}
                  </td>

                  <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {item.name}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {item.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                    {item.totalQuantity}
                  </td>

                  <td className="py-3.5 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400">
                    {item.availableQuantity}
                  </td>

                  <td className="py-3.5 px-3 text-center font-bold text-rose-600">
                    {item.damagedQuantity}
                  </td>

                  <td className="py-3.5 px-3 text-slate-500">
                    {item.location}
                  </td>

                  <td className="py-3.5 px-3 text-right font-medium text-slate-800 dark:text-slate-200">
                    {formatCurrency(item.cost)}
                  </td>

                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadgeClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedItemForStock(item);
                        setStockDelta(5);
                        setStockAction('in');
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                    >
                      Stock In / Out
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock In / Out Modal */}
      {selectedItemForStock && (
        <Modal
          isOpen={!!selectedItemForStock}
          onClose={() => setSelectedItemForStock(null)}
          title={`Stock Movement: ${selectedItemForStock.name}`}
          subtitle={`Current Available: ${selectedItemForStock.availableQuantity} | Total: ${selectedItemForStock.totalQuantity}`}
          maxWidth="md"
        >
          <form onSubmit={handleStockUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Operation Type *
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStockAction('in')}
                  className={`p-2.5 rounded-xl font-bold border text-center transition-all ${
                    stockAction === 'in'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  Stock In (+)
                </button>

                <button
                  type="button"
                  onClick={() => setStockAction('out')}
                  className={`p-2.5 rounded-xl font-bold border text-center transition-all ${
                    stockAction === 'out'
                      ? 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  Deploy / Out (-)
                </button>

                <button
                  type="button"
                  onClick={() => setStockAction('damage')}
                  className={`p-2.5 rounded-xl font-bold border text-center transition-all ${
                    stockAction === 'damage'
                      ? 'border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600'
                  }`}
                >
                  Mark Damaged
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Quantity Units *
              </label>
              <input
                type="number"
                min={1}
                required
                value={stockDelta}
                onChange={e => setStockDelta(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setSelectedItemForStock(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/20"
              >
                Confirm Movement
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add New Item Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Warehouse Asset"
          subtitle="Register inventory equipment and assign initial threshold"
          maxWidth="md"
        >
          <form onSubmit={handleAddNewItem} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Item Name *</label>
              <input
                type="text"
                required
                value={newItem.name}
                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g. Ergonomic Study Desk"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={newItem.category}
                  onChange={e => setNewItem({ ...newItem, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="Furniture">Furniture</option>
                  <option value="Bedding">Bedding</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Kitchen">Kitchen</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Total Quantity</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={newItem.totalQuantity}
                  onChange={e => {
                    const q = Number(e.target.value);
                    setNewItem({ ...newItem, totalQuantity: q, availableQuantity: q });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Unit Cost (INR)</label>
                <input
                  type="number"
                  required
                  value={newItem.cost}
                  onChange={e => setNewItem({ ...newItem, cost: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Low-Stock Alert Level</label>
                <input
                  type="number"
                  value={newItem.minThreshold}
                  onChange={e => setNewItem({ ...newItem, minThreshold: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Storage Location</label>
              <input
                type="text"
                value={newItem.location}
                onChange={e => setNewItem({ ...newItem, location: e.target.value })}
                placeholder="e.g. Block A Store Room"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/20"
              >
                Save Asset
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
