import React from "react";
import { useBooking } from "../contexts/BookingContext";

function SeatMap({ bookedSeats = [] }) {
  const { selectedSeats, toggleSeat, getSeatPrice } = useBooking();

  const rows = [
    { name: "A", tier: "Platinum" },
    { name: "B", tier: "Platinum" },
    { name: "C", tier: "Gold" },
    { name: "D", tier: "Gold" },
    { name: "E", tier: "Gold" },
    { name: "F", tier: "Silver" },
    { name: "G", tier: "Silver" },
    { name: "H", tier: "Silver" }
  ];

  const cols = Array.from({ length: 12 }, (_, i) => i + 1);

  // Group rows by tier
  const tiers = {
    Platinum: rows.filter(r => r.tier === "Platinum"),
    Gold: rows.filter(r => r.tier === "Gold"),
    Silver: rows.filter(r => r.tier === "Silver")
  };

  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return "booked";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  return (
    <div className="w-full flex flex-col items-center select-none py-6">
      
      {/* Screen Indicator */}
      <div className="w-full max-w-lg mb-12 flex flex-col items-center">
        <div className="w-full h-2.5 bg-slate-350 dark:bg-slate-700 rounded-b-2xl shadow-[0_8px_20px_rgba(248,68,100,0.15)] border-b-2 border-primary/20"></div>
        <span className="text-[10px] text-slate-400 font-bold tracking-widest mt-2">
          SCREEN THIS WAY
        </span>
      </div>

      {/* Seat Layout by Tiers */}
      <div className="space-y-8 w-full max-w-3xl overflow-x-auto pb-4 no-scrollbar">
        {Object.entries(tiers).map(([tierName, tierRows]) => {
          const tierPrice = getSeatPrice(`${tierRows[0].name}-1`);
          return (
            <div key={tierName} className="space-y-2 border-b border-dashed border-slate-200/50 dark:border-slate-800/40 pb-6 last:border-0 last:pb-0">
              <div className="flex justify-between items-center px-4">
                <span className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                  {tierName} Tier
                </span>
                <span className="text-xs font-bold text-primary">
                  ₹{tierPrice}
                </span>
              </div>

              <div className="space-y-1.5 min-w-[500px]">
                {tierRows.map((row) => (
                  <div key={row.name} className="flex items-center justify-center gap-2">
                    
                    {/* Row Label (Left) */}
                    <span className="w-6 text-xs font-bold text-slate-400 text-center">
                      {row.name}
                    </span>

                    {/* Seats Grid */}
                    <div className="flex gap-2">
                      {cols.map((col) => {
                        const seatId = `${row.name}-${col}`;
                        const status = getSeatStatus(seatId);
                        
                        let seatClass = "w-7 h-7 text-[10px] font-bold rounded flex items-center justify-center border transition-all duration-150 ";
                        
                        if (status === "booked") {
                          seatClass += "bg-slate-250 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-400 cursor-not-allowed opacity-50";
                        } else if (status === "selected") {
                          seatClass += "bg-primary border-primary text-white shadow-md shadow-primary/25 transform scale-95";
                        } else {
                          seatClass += "bg-white dark:bg-dark-card border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-primary hover:border-primary hover:text-white cursor-pointer";
                        }

                        // Add a small gap in the middle (aisle)
                        const isMiddleGap = col === 6;

                        return (
                          <React.Fragment key={seatId}>
                            <button
                              disabled={status === "booked"}
                              onClick={() => toggleSeat(seatId)}
                              className={seatClass}
                              title={`${seatId} (₹${getSeatPrice(seatId)})`}
                            >
                              {col}
                            </button>
                            {isMiddleGap && <div className="w-6" />}
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Row Label (Right) */}
                    <span className="w-6 text-xs font-bold text-slate-400 text-center">
                      {row.name}
                    </span>

                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend Indicator */}
      <div className="flex justify-center items-center gap-6 mt-10 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-750 bg-white dark:bg-dark-card" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-800 opacity-50" />
          <span>Booked</span>
        </div>
      </div>

    </div>
  );
}

export default SeatMap;
