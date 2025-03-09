"use client";

interface AvailabilityCellProps {
  isAvailable: boolean;
}

export default function AvailabilityCell({ isAvailable }: AvailabilityCellProps) {
  return (
    <td 
      className={`px-1 py-2 text-center ${isAvailable ? 'bg-green-100' : 'bg-red-100'}`}
    >
      <div 
        className={`h-4 w-4 rounded-full mx-auto ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
        title={isAvailable ? 'Available' : 'Unavailable'}
      />
    </td>
  );
}
