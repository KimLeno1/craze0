
import React, { useState, useEffect } from 'react';
import { User, Product } from '../types';
import { databaseService } from '../services/databaseService';

const AdminDatabaseView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'USERS' | 'PRODUCTS'>('USERS');
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setUsers(databaseService.getUsers());
    setProducts(databaseService.getProducts());
  }, []);

  const handleToggleStatus = (userId: string, currentStatus: User['status']) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    const updated = databaseService.updateUserStatus(userId, nextStatus);
    setUsers(updated);
  };

  const filteredUsers = users.filter(u => 
    u.handle.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.id.includes(search)
  );

  const downloadJSON = () => {
    const data = activeSubTab === 'USERS' ? users : products;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CC_${activeSubTab}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    let csvContent = "";
    const timestamp = new Date().toISOString().split('T')[0];

    if (activeSubTab === 'USERS') {
      const headers = ["Handle", "Email", "Archetype", "XP", "Coins", "Gems", "Status", "Last Login", "Total Spent"];
      const rows = users.map(u => [
        `"${u.handle}"`,
        `"${u.email}"`,
        `"${u.archetype}"`,
        u.xp,
        u.coins,
        u.gems,
        `"${u.status}"`,
        `"${u.lastLogin}"`,
        u.totalSpent
      ]);
      csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    } else {
      const headers = ["SKU", "Name", "Category", "Price", "Original Price", "Stock", "Velocity Score"];
      const rows = products.map(p => [
        `"${p.id}"`,
        `"${p.name}"`,
        `"${p.category}"`,
        p.price,
        p.originalPrice,
        p.stockCount,
        p.velocityScore
      ]);
      csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `CC_${activeSubTab}_LEDGER_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-serif italic text-white">Central_Database</h2>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Vault Core Integrity: 100%</p>
        </div>
        
        <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveSubTab('USERS')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'USERS' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            User Registry
          </button>
          <button 
            onClick={() => setActiveSubTab('PRODUCTS')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'PRODUCTS' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            Product Ledger
          </button>
        </div>
      </header>

      <div className="relative">
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600">🔍</span>
        <input 
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={activeSubTab === 'USERS' ? "Search by handle or email..." : "Search by product name or SKU..."}
          className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-14 py-5 text-sm font-mono text-white focus:outline-none focus:border-[#EC4899] transition-all"
        />
      </div>

      <div className="bg-zinc-950 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          {activeSubTab === 'USERS' ? (
            <>
              <thead className="bg-white/5 border-b border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                <tr>
                  <th className="px-8 py-6">Identity_Handle</th>
                  <th className="px-8 py-6">Archetype</th>
                  <th className="px-8 py-6 text-right">XP_Level</th>
                  <th className="px-8 py-6 text-right">Valuation</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[10px] font-mono">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-white font-black">@{user.handle}</span>
                        <span className="text-[8px] text-zinc-600 lowercase">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-2 py-0.5 rounded border ${
                        user.archetype === 'CYBER' ? 'text-pink-500 border-pink-500/20' :
                        user.archetype === 'VOID' ? 'text-zinc-400 border-zinc-400/20' :
                        'text-blue-400 border-blue-400/20'
                      }`}>
                        {user.archetype}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right text-zinc-300">{user.xp.toLocaleString()}</td>
                    <td className="px-8 py-6 text-right text-white font-black">GH₵{user.totalSpent.toLocaleString()}</td>
                    <td className="px-8 py-6">
                      <span className={`w-2 h-2 rounded-full inline-block mr-2 ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
                      <span className={user.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}>{user.status}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${
                          user.status === 'ACTIVE' ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'
                        }`}
                      >
                        {user.status === 'ACTIVE' ? 'Ban_User' : 'Restore_Access'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          ) : (
            <>
              <thead className="bg-white/5 border-b border-white/5 text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                <tr>
                  <th className="px-8 py-6">Silhouette_Name</th>
                  <th className="px-8 py-6">Category</th>
                  <th className="px-8 py-6 text-right">Base_Price</th>
                  <th className="px-8 py-6 text-right">Stock</th>
                  <th className="px-8 py-6 text-right">Heat_Index</th>
                  <th className="px-8 py-6 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="text-[10px] font-mono">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded bg-zinc-900 overflow-hidden">
                          <img src={product.image} className="w-full h-full object-cover grayscale" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-black">{product.name}</span>
                          <span className="text-[8px] text-zinc-600">SKU_{product.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-zinc-400">{product.category}</td>
                    <td className="px-8 py-6 text-right text-white font-black">GH₵{product.price}</td>
                    <td className="px-8 py-6 text-right">
                      <span className={product.stockCount <= 5 ? 'text-red-500 font-black' : 'text-zinc-400'}>
                        {product.stockCount}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[#EC4899] font-black">{product.velocityScore}%</span>
                        <div className="w-16 h-1 bg-zinc-900 rounded-full mt-1">
                          <div className="h-full bg-[#EC4899]" style={{ width: `${product.velocityScore}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-zinc-600 hover:text-white transition-colors">⚙️ EDIT</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
        
        {(activeSubTab === 'USERS' ? filteredUsers : filteredProducts).length === 0 && (
          <div className="py-20 text-center">
            <p className="text-zinc-600 italic">No matching records found in central archives.</p>
          </div>
        )}
      </div>

      <footer className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-950 p-8 rounded-3xl border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Database Export</p>
            <p className="text-[8px] text-zinc-700 uppercase">Last Sync: Today 12:04:22</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={downloadJSON}
              className="px-6 py-2 bg-zinc-900 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              JSON Dump
            </button>
            <button 
              onClick={downloadCSV}
              className="px-6 py-2 bg-[#EC4899] text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-white hover:text-[#EC4899] transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)]"
            >
              CSV Ledger
            </button>
          </div>
        </div>
        
        <div className="bg-red-950/10 border border-red-500/20 p-8 rounded-3xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Emergency Wipe</p>
            <p className="text-[8px] text-zinc-700 uppercase">Restricted Action</p>
          </div>
          <button className="px-6 py-2 bg-red-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            Reset Core
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AdminDatabaseView;
