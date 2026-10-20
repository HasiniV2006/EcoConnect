import React, { useState, useEffect } from 'react';
import {
  Truck,
  Search,
  ChevronDown,
  Navigation,
  MapPin,
  Clock,
  CheckCircle2,
  Package,
  Calendar,
  User,
  Shield,
  ArrowRight,
  ExternalLink,
  X,
  Compass,
} from 'lucide-react';
import { api } from '../api/client';

export default function IndustryOrdersDeliveries() {
  const [shipments, setShipments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [gpsModal, setGpsModal] = useState(null);

  useEffect(() => {
    api.industry
      .getOrders()
      .then((res) => {
        if (res?.shipments) {
          const mapped = res.shipments.map((s) => ({
            id: s.id,
            batchId: `BATCH-${s.polymer?.substring(0, 3).toUpperCase() || 'PLAS'}`,
            plasticType: s.polymer?.split(' ')[0] || 'PET',
            quantity: s.quantity || `${s.quantityKg} kg`,
            requestId: s.id,
            status: s.status || 'In Transit',
            eta: s.eta || 'Today, 04:30 PM',
            dispatchDate: 'Today • 11:15 AM',
            from: 'Municipal MRF Hub Sector 14',
            to: s.destination || 'Unit 4, Industrial Area Phase 2',
            driver: s.driverName || 'Suresh Kumar',
            driverPhone: s.driverPhone || '+91 98765 43210',
            truckNumber: s.vehicleNo || 'DL-01-AB-4921',
            truckModel: 'Tata Ultra 1014 Heavy Logistics',
            progress: s.status === 'Delivered' ? 100 : 45,
            stage: s.status === 'Delivered' ? 'Delivered' : 'Shipping',
            shippingStatusText: s.currentLocation || 'In Transit via Logistics Corridor',
            deliveryStatusText: 'Awaiting arrival and security gate entry',
          }));
          setShipments(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = shipments.filter((s) => {
    if (statusFilter && s.status !== statusFilter) return false;
    if (
      searchTerm &&
      !s.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !s.plasticType.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !s.truckNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-200">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            In Transit
          </span>
        );
      case 'Reaching Destination':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
            <Clock className="h-3.5 w-3.5 text-amber-600 animate-spin" />
            Reaching Destination
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-300/80">
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-700" />
            Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Truck className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-black text-slate-800">Orders & Deliveries</h2>
          </div>
          <p className="text-sm text-slate-500">
            Track real-time shipment status and delivery progress of procured plastic.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-lg bg-white border border-slate-200 pl-3 pr-8 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-sm cursor-pointer"
            >
              <option value="">All Shipments</option>
              <option value="In Transit">In Transit</option>
              <option value="Reaching Destination">Reaching Destination</option>
              <option value="Delivered">Delivered</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tracking ID…"
              className="w-full rounded-xl bg-white border border-slate-200 pl-9 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Shipment Cards */}
      <div className="space-y-6">
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-200/80 p-12 text-center text-slate-400">
            <Truck className="h-10 w-10 mx-auto text-slate-300 mb-3" />
            <p className="font-semibold text-slate-600">No active shipments found</p>
            <p className="text-xs text-slate-400 mt-1">Orders approved and dispatched by the municipality will show live GPS tracking here.</p>
          </div>
        ) : (
          filtered.map((shipment) => {
          // Shipping progress: 0% to 50% normalized to 0-100% of section 1
          const shippingPct = Math.min(100, Math.round((Math.min(shipment.progress, 50) / 50) * 100));
          // Delivery progress: 50% to 100% normalized to 0-100% of section 2
          const deliveryPct = Math.max(0, Math.min(100, Math.round(((Math.max(shipment.progress, 50) - 50) / 50) * 100)));

          const isShippingComplete = shipment.progress >= 50;
          const isDelivered = shipment.progress === 100;

          return (
            <div
              key={shipment.id}
              className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Card Top: Tracking ID, Meta, Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-800 ring-1 ring-amber-200/80 shrink-0">
                    <Truck className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-extrabold text-slate-900">
                        {shipment.id}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 ring-1 ring-amber-300/80">
                        {shipment.plasticType} • {shipment.quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span>Linked Request: <strong className="text-slate-600 font-mono">{shipment.requestId}</strong></span>
                      <span>•</span>
                      <span>Dispatched: <strong className="text-slate-600">{shipment.dispatchDate}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGpsModal(shipment)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 px-3.5 py-2 text-xs font-bold transition-colors active:scale-[0.98]"
                  >
                    <Navigation className="h-3.5 w-3.5 text-amber-700" />
                    Live GPS
                  </button>
                  {getStatusBadge(shipment.status)}
                </div>
              </div>

              {/* Delivery Progress: Two Equal Sections (50% Shipping + 50% Delivery = 100%) */}
              <div className="my-6 rounded-2xl bg-slate-50 border border-slate-200/80 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Compass className="h-4 w-4 text-amber-700" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Shipment Journey Progress
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Overall:</span>
                    <span className="text-sm font-black text-amber-900 tabular-nums">
                      {shipment.progress}%
                    </span>
                  </div>
                </div>

                {/* Dual Section Progress Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* SECTION 1 — SHIPPING (50% of Total) */}
                  <div className={`rounded-xl border p-4 transition-all ${
                    isShippingComplete
                      ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/60'
                      : 'bg-white border-yellow-300 ring-1 ring-yellow-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-900 text-[10px] font-black">
                          1
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          SECTION 1 — SHIPPING (0% – 50%)
                        </span>
                      </div>
                      <span className="text-xs font-bold tabular-nums text-amber-900">
                        {shippingPct}%
                      </span>
                    </div>

                    {/* Progress Bar for Section 1 */}
                    <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-amber-300 to-yellow-400 transition-all duration-500 rounded-full"
                        style={{ width: `${shippingPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Depot Departure</span>
                      <span>Transit to Factory</span>
                    </div>

                    <p className="mt-2 text-xs text-slate-600 font-medium">
                      {shipment.shippingStatusText}
                    </p>
                  </div>

                  {/* SECTION 2 — DELIVERY (50% of Total) */}
                  <div className={`rounded-xl border p-4 transition-all ${
                    isDelivered
                      ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/60'
                      : shipment.progress > 50
                      ? 'bg-white border-amber-300 ring-1 ring-amber-200'
                      : 'bg-slate-100/60 border-slate-200 opacity-80'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                          isDelivered
                            ? 'bg-amber-400 text-slate-900'
                            : shipment.progress > 50
                            ? 'bg-amber-400 text-slate-900'
                            : 'bg-slate-400 text-white'
                        }`}>
                          2
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          SECTION 2 — DELIVERY (50% – 100%)
                        </span>
                      </div>
                      <span className="text-xs font-bold tabular-nums text-slate-700">
                        {deliveryPct}%
                      </span>
                    </div>

                    {/* Progress Bar for Section 2 */}
                    <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-400 transition-all duration-500 rounded-full"
                        style={{ width: `${deliveryPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Gate Inspection</span>
                      <span>Material Unloaded</span>
                    </div>

                    <p className="mt-2 text-xs text-slate-600 font-medium">
                      {shipment.deliveryStatusText}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipment Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2">
                {/* Starting Location */}
                <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3.5">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                    <MapPin className="h-3.5 w-3.5 text-amber-600" />
                    <span>Starting Location</span>
                  </div>
                  <p className="font-semibold text-slate-800 leading-snug">
                    {shipment.from}
                  </p>
                </div>

                {/* Destination Factory */}
                <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3.5">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                    <MapPin className="h-3.5 w-3.5 text-amber-700" />
                    <span>Destination Factory</span>
                  </div>
                  <p className="font-semibold text-slate-800 leading-snug">
                    {shipment.to}
                  </p>
                </div>

                {/* Driver & Contact */}
                <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3.5">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                    <User className="h-3.5 w-3.5 text-slate-600" />
                    <span>Driver & Contact</span>
                  </div>
                  <p className="font-semibold text-slate-800">
                    {shipment.driver}
                  </p>
                  <p className="text-[11px] text-slate-500">{shipment.driverPhone}</p>
                </div>

                {/* Truck & ETA */}
                <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3.5">
                  <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-1">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    <span>Truck & ETA</span>
                  </div>
                  <p className="font-mono font-bold text-slate-800">
                    {shipment.truckNumber}
                  </p>
                  <p className="text-[11px] text-amber-900 font-semibold">{shipment.eta}</p>
                </div>
              </div>
            </div>
          );
        }))}
      </div>

      {/* Live GPS Modal */}
      {gpsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setGpsModal(null)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200/80 animate-scale-in overflow-hidden">
            <div className="relative bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 border-b border-amber-300/70 px-6 py-5 text-slate-900">
              <button
                onClick={() => setGpsModal(null)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-200/70 hover:bg-amber-300 text-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1">
                <Navigation className="h-4 w-4 animate-bounce text-amber-700" />
                Live Vehicle GPS Ping
              </div>
              <h3 className="text-lg font-black text-slate-900">{gpsModal.id} • {gpsModal.truckNumber}</h3>
              <p className="text-xs text-slate-700">{gpsModal.truckModel}</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Simulated Map Container */}
              <div className="relative h-48 w-full rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 overflow-hidden flex flex-col justify-between text-white border border-slate-700">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-1 text-[10px] font-bold text-amber-300 ring-1 ring-amber-400/40">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                    GPS Signal Active (Lock: 9 Satellites)
                  </span>
                  <span className="text-xs font-mono text-slate-300">Speed: 42 km/h</span>
                </div>

                <div className="relative z-10 text-center py-4">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 mb-2">
                    <Truck className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-bold text-amber-200">
                    En Route on NH-44 Expressway
                  </p>
                  <p className="text-[11px] text-slate-400">14.2 km to Green Polymer Plant #2</p>
                </div>

                <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-700/80 pt-2">
                  <span>Lat: 13.0382° N, Lon: 77.5126° E</span>
                  <span>Last update: 5 seconds ago</span>
                </div>
              </div>

              {/* Driver Contact & Dispatch Info */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Assigned Driver:</span>
                  <span className="font-bold text-slate-800">{gpsModal.driver} ({gpsModal.driverPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Cargo:</span>
                  <span className="font-bold text-slate-800">{gpsModal.plasticType} ({gpsModal.quantity})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Estimated Arrival:</span>
                  <span className="font-bold text-amber-900">{gpsModal.eta}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-slate-100 px-6 py-4 bg-slate-50/60">
              <button
                onClick={() => setGpsModal(null)}
                className="rounded-xl bg-slate-800 text-white px-5 py-2 text-xs font-bold hover:bg-slate-900 transition-colors"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
