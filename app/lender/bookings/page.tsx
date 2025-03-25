"use client";
import { useEffect, useState } from "react";

export default function LenderBookings() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch("/api/bookings?pendingApproval=true");
      const data = await res.json();
      setBookings(data);
    };
    fetchBookings();
  }, []);

  const handleApproval = async (studentEmail: string, hostelId: string) => {
    await fetch(`/api/bookings`, {
      method: "PUT",
      body: JSON.stringify({
        studentEmail,
        hostelId,
        approved: true
      })
    });
    setBookings(bookings.filter(b => 
      !(b.studentEmail === studentEmail && b.hostelId === hostelId)
    ));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
      {bookings.map(booking => (
        <div key={`${booking.studentEmail}-${booking.hostelId}`} className="border p-4 mb-4">
          <p>Student: {booking.student.firstName} {booking.student.lastName}</p>
          <p>Email: {booking.studentEmail}</p>
          <p>Hostel: {booking.hostel.name}</p>
          <button
            onClick={() => handleApproval(booking.studentEmail, booking.hostelId)}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          >
            Approve Booking
          </button>
        </div>
      ))}
    </div>
  );
}