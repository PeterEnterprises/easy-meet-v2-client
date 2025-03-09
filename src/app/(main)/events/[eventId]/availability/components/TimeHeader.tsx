"use client";

export default function TimeHeader() {
  // Generate time intervals (96 columns for 15-min intervals in 24 hours)
  const timeIntervals = Array.from({ length: 96 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="sticky left-0 z-10 bg-gray-50 px-3 py-2 text-left text-sm font-semibold text-gray-900">
          User
        </th>
        {timeIntervals.map((time) => (
          <th 
            key={time} 
            className="px-1 py-2 text-center text-xs font-medium text-gray-500"
            style={{ minWidth: '30px' }}
          >
            {time}
          </th>
        ))}
      </tr>
    </thead>
  );
}
