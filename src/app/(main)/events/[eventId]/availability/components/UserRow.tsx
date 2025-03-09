"use client";

import { UserEventTime } from '@/types/time';
import AvailabilityCell from './AvailabilityCell';

interface UserRowProps {
  userData: UserEventTime;
}

export default function UserRow({ userData }: UserRowProps) {
  // Create an array of 96 availability values (true/false)
  const availabilitySlots = Array.from({ length: 96 }, (_, i) => {
    // Check if this time slot is available
    // Priority: closedTime (if exists) overrides openTime
    if (userData.closedTime?.hours && userData.closedTime.hours[i] === false) {
      return false;
    }
    if (userData.openTime?.hours && userData.openTime.hours[i] === true) {
      return true;
    }
    return false; // Default to unavailable
  });

  return (
    <tr className="border-t border-gray-200">
      <td className="sticky left-0 z-10 bg-white px-3 py-2 text-sm font-medium text-gray-900">
        {userData.user.userName}
      </td>
      {availabilitySlots.map((isAvailable, index) => (
        <AvailabilityCell key={index} isAvailable={isAvailable} />
      ))}
    </tr>
  );
}
