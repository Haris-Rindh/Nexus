import React, { useState, useRef } from 'react';
import { User, Lock, Bell, Globe, Palette, CreditCard, Camera, Loader2, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/useAuth';
import api from '../../utils/api';
import toast from 'react-hot-toast';

type Tab = 'profile' | 'security' | 'notifications' | 'language' | 'appearance' | 'billing';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, updateLocalUser } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // --- Profile State ---
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: (user as any)?.location || 'San Francisco, CA',
    bio: user?.bio || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // --- Security State ---
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // --- Theme/Language State ---
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');

  if (!user) return null;

  const handleSaveProfile = async () => {
    if (!user.id) return;
    try {
      setIsSaving(true);
      await updateProfile(user.id, {
        bio: formData.bio,
        location: formData.location
      } as any);
    } catch (error) {
      // Error handled in context
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingAvatar(true);
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await api.put('/profiles/me/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Use local update to avoid overwriting other info with pure API payload!
      updateLocalUser({ avatarUrl: res.data.user?.avatarUrl });
      toast.success('Avatar updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    try {
      setIsSavingPassword(true);
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const navClass = (tabName: Tab) => 
    `flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      activeTab === tabName 
        ? 'text-primary-700 bg-primary-50' 
        : 'text-gray-700 hover:bg-gray-50'
    }`;

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Card className="border border-gray-200 shadow-sm animate-fade-in">
            <CardHeader><h2 className="text-lg font-medium text-gray-900">Profile Settings</h2></CardHeader>
            <CardBody className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar src={user.avatarUrl} alt={user.name} size="xl" />
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-white/70 rounded-full flex items-center justify-center">
                      <Loader2 className="animate-spin text-primary-600" size={20} />
                    </div>
                  )}
                </div>
                <div>
                  <input title="Upload Avatar" type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  <Button variant="outline" size="sm" leftIcon={<Camera size={16} />} onClick={() => avatarInputRef.current?.click()} disabled={isUploadingAvatar}>
                    {isUploadingAvatar ? 'Uploading...' : 'Change Photo'}
                  </Button>
                  <p className="mt-2 text-sm text-gray-500">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name" name="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled />
                <Input label="Email" type="email" name="email" value={formData.email} disabled />
                <Input label="Role" value={user.role} disabled />
                <Input label="Location" name="location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea title="Enter Bio" name="bio" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full rounded-xl border border-gray-300 p-3 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition outline-none" rows={4} />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button onClick={handleSaveProfile} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
              </div>
            </CardBody>
          </Card>
        );

      case 'security':
        return (
          <Card className="border border-gray-200 shadow-sm animate-fade-in">
            <CardHeader><h2 className="text-lg font-medium text-gray-900">Security Settings</h2></CardHeader>
            <CardBody className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    <Badge variant="error" className="mt-1">Not Enabled</Badge>
                  </div>
                  <Button variant="outline" onClick={() => toast.success('2FA Setup email sent.')}>Enable</Button>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4 max-w-lg">
                  <Input label="Current Password" type="password" value={passwordData.currentPassword} onChange={e => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))} />
                  <Input label="New Password" type="password" value={passwordData.newPassword} onChange={e => setPasswordData(p => ({ ...p, newPassword: e.target.value }))} />
                  <Input label="Confirm New Password" type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))} />
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleChangePassword} disabled={isSavingPassword} leftIcon={isSavingPassword ? <Loader2 size={16} className="animate-spin" /> : undefined}>
                      {isSavingPassword ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        );

      case 'notifications':
        return (
          <Card className="border border-gray-200 shadow-sm animate-fade-in">
            <CardHeader><h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2></CardHeader>
            <CardBody className="space-y-6">
               <div className="flex items-center justify-between">
                 <div>
                   <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                   <p className="text-sm text-gray-500">Receive emails about your account activity and updates</p>
                 </div>
                 <input title="Email Notifications" type="checkbox" className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" defaultChecked />
               </div>
               <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                 <div>
                   <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                   <p className="text-sm text-gray-500">Receive real-time push alerts on your device</p>
                 </div>
                 <input title="Push Notifications" type="checkbox" className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
               </div>
               <div className="flex justify-end pt-4"><Button onClick={() => toast.success('Notification preferences saved')}>Save Preferences</Button></div>
            </CardBody>
          </Card>
        );

      case 'language':
        return (
          <Card className="border border-gray-200 shadow-sm animate-fade-in">
            <CardHeader><h2 className="text-lg font-medium text-gray-900">Language Settings</h2></CardHeader>
            <CardBody className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Language</label>
                  <select 
                    title="Select a language"
                    className="w-full max-w-md p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 bg-white" 
                    value={language} 
                    onChange={e => setLanguage(e.target.value)}
                  >
                    <option value="English">English (US)</option>
                    <option value="Spanish">Spanish (ES)</option>
                    <option value="French">French (FR)</option>
                    <option value="German">German (DE)</option>
                  </select>
               </div>
               <div className="flex justify-start pt-4"><Button onClick={() => toast.success(`Language updated to ${language}`)}>Apply Language</Button></div>
            </CardBody>
          </Card>
        );

      case 'appearance':
        return (
          <Card className="border border-gray-200 shadow-sm animate-fade-in">
            <CardHeader><h2 className="text-lg font-medium text-gray-900">Appearance</h2></CardHeader>
            <CardBody className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button onClick={() => setTheme('light')} className={`border-2 p-4 rounded-xl flex flex-col items-center transition-all ${theme === 'light' ? 'border-primary-500 bg-primary-50 scale-105' : 'border-gray-200 hover:border-gray-300'}`}>
                   <div className="w-16 h-12 bg-white border shadow-sm rounded-md mb-3"></div>
                   <span className="font-medium text-gray-900">Light Theme</span>
                 </button>
                 <button onClick={() => setTheme('dark')} className={`border-2 p-4 rounded-xl flex flex-col items-center transition-all ${theme === 'dark' ? 'border-primary-500 bg-primary-50 scale-105' : 'border-gray-200 hover:border-gray-300'}`}>
                   <div className="w-16 h-12 bg-gray-900 border shadow-sm rounded-md mb-3"></div>
                   <span className="font-medium text-gray-900">Dark Theme</span>
                 </button>
                 <button onClick={() => setTheme('system')} className={`border-2 p-4 rounded-xl flex flex-col items-center transition-all ${theme === 'system' ? 'border-primary-500 bg-primary-50 scale-105' : 'border-gray-200 hover:border-gray-300'}`}>
                   <div className="w-16 h-12 bg-gradient-to-r from-gray-100 to-gray-800 border shadow-sm rounded-md mb-3"></div>
                   <span className="font-medium text-gray-900">System Auto</span>
                 </button>
               </div>
               <div className="flex justify-end pt-4"><Button onClick={() => toast.success('Theme preference saved')}>Save Appearance</Button></div>
            </CardBody>
          </Card>
        );

      case 'billing':
        return (
          <div className="space-y-6 animate-fade-in">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader><h2 className="text-lg font-medium text-gray-900">Available Packages</h2></CardHeader>
              <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Basic Package */}
                 <div className="border border-gray-200 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                   <h3 className="text-xl font-bold text-gray-900 mb-2">Basic Tier</h3>
                   <p className="text-gray-500 text-sm mb-4">Core platform features</p>
                   <div className="text-3xl font-bold text-gray-900 mb-6">$0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                   <ul className="text-sm text-gray-600 space-y-3 mb-6 text-left">
                     <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Basic Profile</li>
                     <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Up to 5 Connections</li>
                   </ul>
                   <Button variant="outline" className="w-full">Current Plan</Button>
                 </div>
                 
                 {/* Pro Package */}
                 <div className="border-2 border-primary-500 bg-primary-50/20 rounded-xl p-6 text-center relative shadow-sm">
                   <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">Pro Tier</h3>
                   <p className="text-gray-500 text-sm mb-4">Unlimited networking</p>
                   <div className="text-3xl font-bold text-gray-900 mb-6">$49<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                   <ul className="text-sm text-gray-600 space-y-3 mb-6 text-left">
                     <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary-500 mr-2" /> Featured Profile</li>
                     <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary-500 mr-2" /> Unlimited Connections</li>
                     <li className="flex items-center"><CheckCircle className="w-4 h-4 text-primary-500 mr-2" /> Advanced Analytics</li>
                   </ul>
                   <Button className="w-full" onClick={() => toast.success('Pro plan selected. Head to payments dashboard to deposit funds.')}>Upgrade to Pro</Button>
                 </div>
              </CardBody>
            </Card>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings navigation */}
        <Card className="lg:col-span-1 border border-gray-200 self-start">
          <CardBody className="p-2">
            <nav className="space-y-1">
              <button className={navClass('profile')} onClick={() => setActiveTab('profile')}><User size={18} className="mr-3" /> Profile</button>
              <button className={navClass('security')} onClick={() => setActiveTab('security')}><Lock size={18} className="mr-3" /> Security</button>
              <button className={navClass('notifications')} onClick={() => setActiveTab('notifications')}><Bell size={18} className="mr-3" /> Notifications</button>
              <button className={navClass('language')} onClick={() => setActiveTab('language')}><Globe size={18} className="mr-3" /> Language</button>
              <button className={navClass('appearance')} onClick={() => setActiveTab('appearance')}><Palette size={18} className="mr-3" /> Appearance</button>
              <button className={navClass('billing')} onClick={() => setActiveTab('billing')}><CreditCard size={18} className="mr-3" /> Billing</button>
            </nav>
          </CardBody>
        </Card>

        {/* Main settings content */}
        <div className="lg:col-span-3 space-y-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};