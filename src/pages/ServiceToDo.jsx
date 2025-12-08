import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiCalendar, FiUser, FiCheckCircle, FiXCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useAuth } from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure"; // ইন্টারসেপ্টর হুকটি ব্যবহার করুন
import SectionHeader from "../components/shared/SectionHeader";
import Badge from "../components/ui/Badge";
import { formatDate, formatPrice } from "../utils/helpers";
import LoadingSpinner from "../components/shared/LoadingSpinner";

const ServiceToDo = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // 1. Fetch Provider Bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["serviceToDo", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/provider/${user.email}`);
      console.log("Check data from server:", res.data);
      
      // ডাটা স্ট্রাকচার সেফটি চেক
      const fetchedData = res.data.data || res.data; 
      return Array.isArray(fetchedData) ? fetchedData : [];
    },
  });

  // 2. Status Update Mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/bookings/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["serviceToDo"]);
      toast.success("Booking updated successfully!");
    },
  });

  const handleStatusChange = (id, newStatus) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `Mark this booking as ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        statusMutation.mutate({ id, status: newStatus });
      }
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <SectionHeader title="Service Requests" subtitle="Bookings requested by customers" />

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-light-100 dark:bg-dark-200 rounded-3xl border border-dashed dark:border-dark-100">
            <p className="text-gray-500">You haven't received any service requests yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white dark:bg-dark-200 p-6 rounded-2xl shadow-sm border dark:border-dark-100 flex flex-col md:flex-row justify-between items-center gap-4">
                
                <div className="flex items-center gap-4 w-full">
                  <img src={booking.serviceImage} className="w-20 h-20 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-lg">{booking.serviceName}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiUser /> <span>Customer: {booking.userName}</span>
                    </div>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1"><FiCalendar /> {formatDate(booking.bookingDate)}</span>
                      <span className="font-bold text-primary-500">{formatPrice(booking.price)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                  <Badge variant={booking.status === "pending" ? "warning" : booking.status === "confirmed" ? "info" : "success"}>
                    {booking.status.toUpperCase()}
                  </Badge>

                  <div className="flex gap-2">
                    {booking.status === "pending" && (
                      <button onClick={() => handleStatusChange(booking._id, "confirmed")} className="btn-sm bg-primary-500 text-white px-3 py-1 rounded-lg">Accept</button>
                    )}
                    {booking.status === "confirmed" && (
                      <button onClick={() => handleStatusChange(booking._id, "completed")} className="btn-sm bg-emerald-500 text-white px-3 py-1 rounded-lg">Complete</button>
                    )}
                    {booking.status !== "cancelled" && booking.status !== "completed" && (
                      <button onClick={() => handleStatusChange(booking._id, "cancelled")} className="btn-sm bg-red-100 text-red-500 px-3 py-1 rounded-lg">Reject</button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceToDo;