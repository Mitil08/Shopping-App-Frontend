import React, { useState } from 'react';
import { Users, Search, ShieldCheck } from 'lucide-react';

export default function AdminUsersPage() {
  const [users] = useState([
    { id: 'usr-1', name: 'Atelier Administrator', email: 'admin@elane-studio.com', role: 'admin', joined: '2025-01-10', ordersCount: 0 },
    { id: 'usr-2', name: 'Genevieve Laurent', email: 'client@elane-studio.com', role: 'customer', joined: '2026-02-14', ordersCount: 5 },
    { id: 'usr-3', name: 'Julian Thorne', email: 'julian.t@outlook.com', role: 'customer', joined: '2026-03-01', ordersCount: 2 },
    { id: 'usr-4', name: 'Helena Vance', email: 'h.vance@studio.org', role: 'customer', joined: '2026-03-12', ordersCount: 4 },
    { id: 'usr-5', name: 'Marcus Sterling', email: 'm.sterling@luxury.co', role: 'customer', joined: '2026-04-05', ordersCount: 3 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#787570] font-semibold">
          Clientele Roster
        </span>
        <h1 className="font-serif text-3xl text-[#141414] font-normal uppercase mt-0.5">
          Registered Accounts & Privileges ({users.length})
        </h1>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white border border-[#E8E6E1] p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-[#787570]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by client name or registered email..."
          className="w-full text-xs text-[#141414] focus:outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E8E6E1] shadow-2xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#E8E6E1] text-[10px] uppercase tracking-wider text-[#787570] bg-[#FAF9F5]">
            <tr>
              <th className="p-4 font-semibold">Client Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Acquisitions</th>
              <th className="p-4 font-semibold text-right">Registered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E6E1]">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-[#FAF9F5] transition-colors">
                <td className="p-4 font-medium text-[#141414]">{u.name}</td>
                <td className="p-4 text-[#787570] font-mono">{u.email}</td>
                <td className="p-4">
                  {u.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#141414] text-[#FAF9F5] text-[10px] font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3 text-[#C2A676]" />
                      <span>Executive Admin</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-[#F3F1EC] text-[#141414] text-[10px] font-semibold uppercase tracking-wider">
                      Clientele
                    </span>
                  )}
                </td>
                <td className="p-4 text-[#787570] font-semibold">{u.ordersCount} orders</td>
                <td className="p-4 text-right text-[#787570]">{u.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
