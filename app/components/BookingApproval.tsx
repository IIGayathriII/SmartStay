"use client";
import { useEffect, useState } from "react";

export default function BookingApproval({ lenderEmail }: { lenderEmail: string }) {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch(`/api/bookings?lenderEmail=${lenderEmail}`);
      const data = await res.json();
      setBookings(data);
    };
    fetchBookings();
  }, [lenderEmail]);

  const handleApproval = async (studentEmail: string, hostelId: string) => {
    await fetch(`/api/bookings/${studentEmail}/${hostelId}`, {
      method: "PATCH",
      body: JSON.stringify({ approved: true })
    });
    setBookings(prev => prev.map(b => 
      b.studentEmail === studentEmail && b.hostelId === hostelId 
        ? { ...b, approved: true } 
        : b
    ));
  };

  return (
    <div className="space-y-4">
      {bookings.map(booking => (
        <div key={`${booking.studentEmail}-${booking.hostelId}`} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{booking.student.firstName} {booking.student.lastName}</h3>
              <p className="text-gray-600">{booking.hostel.name}</p>
              {booking.paymentProofImageUrl && (
                <img 
                  src={booking.paymentProofImageUrl} 
                  alt="Payment proof" 
                  className="mt-2 max-w-xs"
                />
              )}
            </div>
            
            {!booking.approved && (
              <button
                onClick={() => handleApproval(booking.studentEmail, booking.hostelId)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Approve
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}