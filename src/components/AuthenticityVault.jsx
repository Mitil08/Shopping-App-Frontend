import React, { useState } from 'react';
import { ShieldCheck, Award, QrCode, FileText, CheckCircle, ExternalLink, Sparkles, Lock, Clock } from 'lucide-react';
import { formatPrice } from '../utils/currency';

/**
 * Luxury Authenticity Vault & Digital Provenance Pass
 * Displays cryptographic authenticity certificates, artisan batch IDs, material provenance,
 * and transferable digital ownership cards with dynamic QR verification.
 */
export default function AuthenticityVault() {
  const [selectedPass, setSelectedPass] = useState(null);

  // Stored or simulated authentic luxury assets owned by the client
  const [certificates] = useState(() => {
    try {
      const saved = localStorage.getItem('elane_vault_passes');
      if (saved) return JSON.parse(saved);
    } catch {}

    return [
      {
        serialNumber: 'ELN-AU-2026-90412X',
        productName: 'Aether Pro 16 Flagship (Ceramic Titanium)',
        category: 'Quantum Technology & Mobile',
        batchNumber: 'ATELIER-BATCH-0881',
        materialProvenance: 'Grade 5 Aerospace Titanium mined in Scandinavia, Sapphire crystal optics',
        artisanGuild: 'Aether Precision Labs, Kyoto Studio',
        registrationDate: '12 January 2026',
        warrantyValidUntil: '12 January 2028 (Complimentary ÉLANE Care+)',
        status: 'AUTHENTIC & REGISTERED',
        valuation: 129990,
        blockchainHash: '0x8f29c41793a388b14e912f98cc42a690d',
      },
      {
        serialNumber: 'ELN-AU-2025-44109B',
        productName: 'Atelier Double-Breasted Virgin Wool & Cashmere Coat',
        category: 'Milanese Tailoring Archive',
        batchNumber: 'COUTURE-SEASON-04',
        materialProvenance: '90% Virgin Wool (Piedmont), 10% Grade-A Mongolian Cashmere',
        artisanGuild: 'Atelier ÉLANE Tailoring Guild, Florence',
        registrationDate: '04 November 2025',
        warrantyValidUntil: 'Lifetime Craftsmanship Guarantee',
        status: 'AUTHENTIC & REGISTERED',
        valuation: 41300,
        blockchainHash: '0x3a992bc018449cde1592398511ff08a9',
      },
      {
        serialNumber: 'ELN-AU-2026-11842Q',
        productName: 'Oud Al-Malik Extrait de Parfum (50ml Flacon)',
        category: 'Olfactory Apothecary',
        batchNumber: 'GRASSE-HARVEST-2025-A',
        materialProvenance: '15-Year Aged Cambodian Agarwood, Damascene Rose, Ambergris',
        artisanGuild: 'Maison Parfumerie, Grasse, France',
        registrationDate: '28 February 2026',
        warrantyValidUntil: 'Permanent Olfactory Cellar Seal',
        status: 'AUTHENTIC & REGISTERED',
        valuation: 28500,
        blockchainHash: '0x7b54d31006fe890a542b109ccda87192',
      }
    ];
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#181622] via-[#0E0D14] to-[#181622] border border-[#C2A676]/30 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C2A676]/15 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C2A676]/15 border border-[#C2A676]/30 text-[#C2A676] text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
            <Lock className="w-3 h-3" />
            ÉLANE Cryptographic Vault • Digital Ownership
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white uppercase tracking-tight">
            Provenance & Authenticity Passes
          </h2>
          <p className="text-xs sm:text-sm text-white/70 font-light mt-2 leading-relaxed">
            Every piece procured from ÉLANE carries an immutable digital certificate of authenticity. 
            View artisan batch lineages, materials provenance, and transferable warranty protection.
          </p>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {certificates.map((pass) => (
          <div
            key={pass.serialNumber}
            className="group relative bg-[#F8F7F4] dark:bg-[#13111C] border border-[#E8E6E1] dark:border-[#24222E] rounded-xl p-6 hover:border-[#C2A676]/60 dark:hover:border-[#C2A676]/60 transition-all duration-300 shadow-sm flex flex-col justify-between"
          >
            {/* Top Certificate Header */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C2A676] font-semibold">
                  {pass.serialNumber}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              </div>

              <h3 className="font-serif text-lg font-medium text-[#141414] dark:text-white leading-snug">
                {pass.productName}
              </h3>
              <p className="text-xs text-[#787570] dark:text-[#9A968F] mt-1 font-light">
                {pass.category}
              </p>

              {/* Specs Table */}
              <div className="mt-5 space-y-2.5 text-xs border-t border-[#E8E6E1] dark:border-[#24222E] pt-4">
                <div className="flex justify-between">
                  <span className="text-[#787570] dark:text-[#9A968F]">Atelier Guild:</span>
                  <span className="font-medium text-[#141414] dark:text-[#FAF9F5] text-right truncate max-w-[170px]">
                    {pass.artisanGuild}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#787570] dark:text-[#9A968F]">Batch ID:</span>
                  <span className="font-mono text-[#141414] dark:text-[#FAF9F5]">{pass.batchNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#787570] dark:text-[#9A968F]">Valuation:</span>
                  <span className="font-serif font-semibold text-[#141414] dark:text-[#C2A676]">
                    {formatPrice(pass.valuation)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Modal Trigger */}
            <div className="mt-6 pt-4 border-t border-[#E8E6E1] dark:border-[#24222E] flex items-center justify-between">
              <button
                onClick={() => setSelectedPass(pass)}
                className="w-full py-2.5 rounded-lg bg-[#141414] text-white dark:bg-[#C2A676] dark:text-[#0B0A0E] text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>View Full Certificate</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup for Pass Inspection */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#FAF9F5] dark:bg-[#13111C] border border-[#C2A676]/40 rounded-2xl max-w-lg w-full p-6 sm:p-8 text-[#141414] dark:text-[#FAF9F5] shadow-2xl relative">
            {/* Modal Close */}
            <button
              onClick={() => setSelectedPass(null)}
              className="absolute top-4 right-4 text-[#787570] hover:text-black dark:hover:text-white p-2"
            >
              ✕
            </button>

            {/* Certificate Header Banner */}
            <div className="text-center pb-6 border-b border-[#E8E6E1] dark:border-[#24222E]">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#C2A676]/10 border border-[#C2A676]/30 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6 text-[#C2A676]" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#C2A676]">
                ÉLANE Official Provenance
              </span>
              <h3 className="font-serif text-2xl font-light uppercase mt-1">
                Certificate of Authenticity
              </h3>
              <p className="text-[11px] font-mono text-[#787570] dark:text-[#9A968F] mt-1">
                IMMUTABLE LEDGER ID: {selectedPass.blockchainHash}
              </p>
            </div>

            {/* Details Section */}
            <div className="py-6 space-y-4 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#787570] dark:text-[#9A968F] block">
                  Product & Silhouette
                </span>
                <p className="font-serif text-lg text-[#141414] dark:text-white font-medium mt-0.5">
                  {selectedPass.productName}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#787570] dark:text-[#9A968F] block">
                  Materials Provenance
                </span>
                <p className="text-xs text-[#555] dark:text-[#BBB] mt-0.5 leading-relaxed">
                  {selectedPass.materialProvenance}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#E8E6E1] dark:border-[#24222E]">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#787570] dark:text-[#9A968F] block">
                    Registered On
                  </span>
                  <p className="font-medium text-[#141414] dark:text-white">{selectedPass.registrationDate}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#787570] dark:text-[#9A968F] block">
                    Warranty Protection
                  </span>
                  <p className="font-medium text-emerald-600 dark:text-emerald-400">{selectedPass.warrantyValidUntil}</p>
                </div>
              </div>

              {/* QR Verification Box */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#0B0A0E] border border-[#E8E6E1] dark:border-[#24222E] flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#141414] dark:text-white block">
                    Transferable Digital Token
                  </span>
                  <p className="text-[11px] text-[#787570] dark:text-[#9A968F] mt-0.5">
                    Scan via mobile to verify authenticity or transfer ownership to a new client.
                  </p>
                </div>
                <div className="p-2 rounded bg-black text-white shrink-0">
                  <QrCode className="w-10 h-10 text-[#C2A676]" />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#E8E6E1] dark:border-[#24222E] flex gap-3">
              <button
                onClick={() => {
                  alert(`Certificate ${selectedPass.serialNumber} downloaded as encrypted PDF pass.`);
                }}
                className="flex-1 py-3 rounded-lg border border-[#141414] dark:border-white/30 text-xs uppercase tracking-widest font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export PDF Pass</span>
              </button>
              <button
                onClick={() => setSelectedPass(null)}
                className="flex-1 py-3 rounded-lg bg-[#141414] text-white dark:bg-[#C2A676] dark:text-[#0B0A0E] text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
