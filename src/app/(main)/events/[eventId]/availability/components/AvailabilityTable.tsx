"use client";

import { UserEventTime } from '@/types/time';
import TimeHeader from './TimeHeader';
import UserRow from './UserRow';

interface AvailabilityTableProps {
  availabilityData: UserEventTime[];
}

export default function AvailabilityTable({ availabilityData }: AvailabilityTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <TimeHeader />
        <tbody>
          {availabilityData.map((userData) => (
            <UserRow key={userData.userId} userData={userData} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
