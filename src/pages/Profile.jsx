import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiMail, FiCalendar, FiClock, FiEdit2, FiCamera, 
  FiSave, FiX, FiShield, FiCheckCircle, FiGrid, FiDollarSign, 
  FiStar, FiTrendingUp, FiUploadCloud
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import useAxiosSecure from '../hooks/useAxiosSecure'; // আপনার ইন্টারসেপ্টর হুক
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { formatPrice } from '../utils/helpers';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;
const DEFAULT_AVATAR = 'https://i.ibb.co/5GzXkwq/user.png';

const Profile = () => {
  const { user, updateUserProfile, getLastSignInTime, getCreationTime } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || '',
  });
  const [errors, setErrors] = useState({});

  // ==================== 📊 FETCH USER STATS ====================
  const { data, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/stats/${user?.email}`);
      // API response structure handle
      return res.data.data || res.data; 
    },
    enabled: !!user?.email,
  });

  const stats = data || {}; // Safe access

  // ==================== 🛠️ HANDLERS ====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading('Updating profile...');

    try {
      let finalPhotoURL = formData.photoURL || user?.photoURL;

      if (selectedFile) {
        const formDataImg = new FormData();
        formDataImg.append('image', selectedFile);
        const { data: imgData } = await axios.post(IMGBB_UPLOAD_URL, formDataImg);
        finalPhotoURL = imgData.data.url;
      }

      await updateUserProfile(formData.displayName, finalPhotoURL);
      toast.success('Profile updated!', { id: toastId });
      setIsEditing(false);
      queryClient.invalidateQueries(['userStats']);
    } catch (err) {
      toast.error('Failed to update profile', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (statsLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold dark:text-white">My Profile</h1>
          <p className="text-gray-500">Manage your account and view performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Profile Overview */}
          <Card className="p-8 text-center">
            <div className="relative inline-block mb-4">
              <img
                src={user?.photoURL || DEFAULT_AVATAR}
                alt="Profile"
                className="w-32 h-32 rounded-3xl object-cover border-4 border-primary-500/20"
              />
              <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <h2 className="text-2xl font-bold dark:text-white">{user?.displayName || 'User'}</h2>
            <p className="text-gray-500 mb-6">{user?.email}</p>
            <Button variant="primary" onClick={() => setIsEditing(true)} className="w-full">Edit Profile</Button>
            
            <div className="mt-8 space-y-4 text-left border-t pt-6 border-gray-100 dark:border-dark-100">
              <InfoRow icon={<FiCalendar />} label="Joined" value={getCreationTime()} />
              <InfoRow icon={<FiClock />} label="Last Sign In" value={getLastSignInTime()} />
            </div>
          </Card>

          {/* RIGHT: Statistics & Performance */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Services" value={stats.totalServices || 0} icon={<FiGrid />} color="bg-primary-500" />
              <StatCard label="Bookings" value={stats.totalBookingsReceived || 0} icon={<FiCalendar />} color="bg-emerald-500" />
              <StatCard label="Revenue" value={formatPrice(stats.totalRevenue || 0)} icon={<FiDollarSign />} color="bg-amber-500" />
              <StatCard label="Rating" value={stats.averageRating || 0} icon={<FiStar />} color="bg-rose-500" />
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiTrendingUp className="text-primary-500" /> Performance overview
              </h3>
              <div className="space-y-6">
                <ProgressRow label="Completion Rate" current={stats.completedBookings || 0} total={stats.totalBookingsReceived || 1} color="bg-emerald-500" />
                <ProgressRow label="Rating Score" current={stats.averageRating || 0} total={5} color="bg-amber-500" />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">User Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-dark-100 rounded-xl">
                  <span className="text-gray-500">User ID</span>
                  <span className="font-mono text-xs">{user?.uid}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 dark:bg-dark-100 rounded-xl">
                  <span className="text-gray-500">Email Verified</span>
                  <span className={user?.emailVerified ? "text-emerald-500" : "text-amber-500"}>
                    {user?.emailVerified ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Edit Modal (Logic identical to your state) */}
        <AnimatePresence>
          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-dark-200 p-8 rounded-3xl w-full max-w-md relative">
                 <button onClick={() => setIsEditing(false)} className="absolute top-4 right-4 text-gray-400"><FiX size={24}/></button>
                 <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
                 <form onSubmit={handleSubmit} className="space-y-4">
                   <div className="flex justify-center mb-6">
                      <div className="relative group cursor-pointer" onClick={() => document.getElementById('photo-input').click()}>
                        <img src={previewUrl || user?.photoURL || DEFAULT_AVATAR} className="w-24 h-24 rounded-2xl object-cover border-4 border-primary-500/20" />
                        <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100"><FiCamera className="text-white" /></div>
                        <input id="photo-input" type="file" className="hidden" onChange={handleFileChange} />
                      </div>
                   </div>
                   <Input label="Display Name" value={formData.displayName} name="displayName" onChange={handleChange} />
                   <div className="flex gap-2 pt-4">
                     <Button variant="ghost" onClick={() => setIsEditing(false)} className="flex-1">Cancel</Button>
                     <Button variant="primary" type="submit" loading={isSubmitting} className="flex-1">Save</Button>
                   </div>
                 </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Helpers components ---
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-primary-500">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-sm dark:text-white">{value}</p>
    </div>
  </div>
);

const StatCard = ({ label, value, icon, color }) => (
  <Card className="p-4 text-center">
    <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-white mb-2 ${color}`}>{icon}</div>
    <p className="text-xl font-bold dark:text-white">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </Card>
);

const ProgressRow = ({ label, current, total, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-bold">{current} / {total}</span>
    </div>
    <div className="h-2 bg-gray-100 dark:bg-dark-100 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${(current/total) * 100}%` }}></div>
    </div>
  </div>
);

const Button = ({ children, variant, className, onClick, loading, type }) => {
  const styles = variant === 'primary' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-dark-100';
  return (
    <button type={type} onClick={onClick} className={`py-2 px-4 rounded-xl font-semibold disabled:opacity-50 ${styles} ${className}`}>
      {loading ? 'Processing...' : children}
    </button>
  );
};

export default Profile;