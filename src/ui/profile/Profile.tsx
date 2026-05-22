import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../entity/Header';
import Footer from '../../entity/Footer';
import { User, LogOut, Package, PawPrint, BookHeart, UserRoundCog, Shield } from 'lucide-react';
import "./style/profile/profile.css";
import OrdersTab from './tabs/ordersTab';
import PetsTab from './tabs/petsTab';
import PetDetail from './tabs/petDetailTab';
import PetForm from './tabs/component/petForm';
import FavoriteTab from './tabs/favoriteTab';
import SettingsTab from './tabs/settingTab';
import { useProfile } from '../../function/profile/useProfile';
import { usePets } from '../../function/profile/usePets';
import { useOrders } from '../../function/profile/useOrders';
import { useFavorites } from '../../function/profile/useFavorite';

type ProfileTab = 'orders' | 'pets' | 'wishlist' | 'settings';
type PetsView = 'list' | 'detail' | 'form';

const API_BASE_URL = 'http://127.0.0.1:3000';


interface BackendOrder {
  _id: string;
  products: Array<{
    product: {
      _id: string;
      name: string;
      price?: number;
      images?: Array<{ url: string; isMain?: boolean }>;
      remains?: number;
      isVetMedicine?: boolean;
    };
    quantity: number;
    price: number;
    name: string;
  }>;
  sum: number;
  adressPoint: string;
  city?: string;
  deliveryMethod?: 'courier' | 'pickup';
  paymentMethod?: 'card' | 'cash';
  status: { _id: string; name: string } | string;
  createdAt: string;
  hasVetMedicine?: boolean;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>('orders');
  const [petsView, setPetsView] = useState<PetsView>('list');
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [avatarLoadError, setAvatarLoadError] = useState(false);

  const { profile, fetchProfile, isLoading: profileLoading, updateProfile } = useProfile();
  const { pets, fetchPets, addPet, updatePet, uploadPetPhoto, uploadDocument } = usePets();
  const { orders, fetchOrders } = useOrders();
  const { favorites, fetchFavorites, toggleFavorite } = useFavorites();

  const isAdmin = profile?.role?.name?.toLowerCase() === 'admin' || 
                  profile?.role === 'admin' ||
                  profile?.role?._id === '2';

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) { navigate('/login'); return; }
    fetchProfile(); fetchPets(); fetchOrders(); fetchFavorites();
  }, [navigate, fetchProfile, fetchPets, fetchOrders, fetchFavorites]);

  useEffect(() => {
    setAvatarLoadError(false);
  }, [profile?.avatar]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/login');
  };

  const getAvatarUrl = () => {
    if (!profile?.avatar) return null;
    if (profile.avatar.startsWith('http')) return profile.avatar;
    return `${API_BASE_URL}${profile.avatar}`;
  };

  const handleRepeatOrder = (order: BackendOrder) => {

    const checkoutState = {
      repeatOrder: true,
      items: order.products.map(p => ({
        product: {
          _id: p.product._id,
          name: p.name,
          price: p.price,
          discount: 0,
          remains: p.product.remains ?? 0,
          isVetMedicine: p.product.isVetMedicine,
          images: p.product.images
        },
        quantity: p.quantity
      })),
      formData: {
        firstName: profile?.login?.split(' ')[0] || '',
        lastName: profile?.login?.split(' ')[1] || '',
        email: profile?.mail || '',
        phone: profile?.phone || '',
        address: order.adressPoint.replace(`${order.city}, `, ''),
        city: order.city || ''
      },
      deliveryMethod: order.deliveryMethod || 'courier',
      paymentMethod: order.paymentMethod || 'card',
      hasVetMedicine: order.hasVetMedicine || false
    };

  
    navigate('/checkout', { state: checkoutState });
  };

  if (profileLoading) {
    return (
      <>
        <Header />
        <div className="profile-page">
          <div className="container">
            <div className="loading-state">Загрузка...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const avatarUrl = !avatarLoadError ? getAvatarUrl() : null;

  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="container">
          <div className="breadcrumbs">
            <span>Главная</span> / <span>Личный кабинет</span>
          </div>

          <div className="profile-content">
            <aside className="profile-sidebar">
              <div className="profile-user-card">
                <div className="user-avatar">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={profile?.login || 'Аватар'}
                      className="user-avatar-img"
                      onError={() => setAvatarLoadError(true)}
                    />
                  ) : (
                    <User size={40} className="user-avatar-fallback" />
                  )}
                </div>
                
                <h3>{profile?.login}</h3>
                <p>{profile?.mail || ''}</p>
                {profile?.phone && <p className="user-phone">{profile.phone}</p>}
              
                {isAdmin && (
                  <span className="admin-badge">Администратор</span>
                )}
              </div>
              
              <nav className="profile-nav">
                {isAdmin && (
                  <button 
                    className="nav-item admin-panel-btn" 
                    onClick={() => navigate('/admin')}
                    title="Перейти в админ-панель"
                  >
                    <Shield size={20} /> Админ-панель
                  </button>
                )}
                
                <button 
                  className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('orders')}
                >
                  <Package /> Мои заказы
                </button>
                <button 
                  className={`nav-item ${activeTab === 'pets' ? 'active' : ''}`} 
                  onClick={() => { setActiveTab('pets'); setPetsView('list'); }}
                >
                  <PawPrint /> Мои питомцы
                </button>
                <button 
                  className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('wishlist')}
                >
                  <BookHeart /> Избранное
                </button>
                <button 
                  className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('settings')}
                >
                  <UserRoundCog /> Настройки
                </button>
                <button className="nav-item logout" onClick={handleLogout}>
                  <LogOut size={20} /> Выйти
                </button>
              </nav>
            </aside>

            <main className="profile-main">
              {activeTab === 'orders' && (
                <OrdersTab 
                  orders={orders} 
                  onRepeatOrder={handleRepeatOrder}
                  onNavigate={navigate} 
                />
              )}
              
              {activeTab === 'pets' && petsView === 'list' && (
                <PetsTab 
                  pets={pets} 
                  onSelectPet={(pet: any) => { setSelectedPet(pet); setPetsView('detail'); }} 
                  onEditPet={(pet: any) => { setSelectedPet(pet); setPetsView('form'); }} 
                  onAddClick={() => { setSelectedPet(null); setPetsView('form'); }} 
                />
              )}
              
              {activeTab === 'pets' && petsView === 'detail' && selectedPet && (
                <PetDetail
                  pet={selectedPet}
                  onBack={() => setPetsView('list')}
                  onEditField={(field) => { 
                    setSelectedPet(prev => ({ ...prev, editField: field })); 
                    setPetsView('form'); 
                  }}
                  onDelete={async () => { alert('Удаление питомца пока не реализовано'); }}
                  onPhotoChange={(file) => uploadPetPhoto(selectedPet._id, file)}
                  onAddTag={(tag) => updatePet(selectedPet._id, { tags: [...(selectedPet.tags || []), tag] })}
                  onRemoveTag={(tag) => updatePet(selectedPet._id, { 
                    tags: selectedPet.tags?.filter((t: string) => t !== tag) 
                  })}
                  onFolderColorChange={(color) => updatePet(selectedPet._id, { folderColor: color })}
                  onUploadDocument={(file, title) => uploadDocument(selectedPet._id, file, title)}
                />
              )}
              
              {activeTab === 'pets' && petsView === 'form' && (
                <PetForm 
                  initialPet={selectedPet || undefined} 
                  onCancel={() => { setPetsView('list'); setSelectedPet(null); }} 
                  onSubmit={async (data) => {
                    try {
                      const { photoFile, ...petJsonData } = data;
                      let newPetId = selectedPet?._id;

                      if (selectedPet) {
                        await updatePet(selectedPet._id, petJsonData);
                      } else {
                        const created = await addPet(petJsonData);
                        newPetId = created._id;
                      }
                      
                      if (photoFile && newPetId) {
                        await uploadPetPhoto(newPetId, photoFile);
                      }

                      await fetchPets(); 
                      setPetsView('list');
                      setSelectedPet(null);
                    } catch (err: any) {
                      console.error('Ошибка сохранения:', err);
                      alert(err.message || 'Не удалось сохранить питомца');
                    }
                  }}
                />
              )}
              
              {activeTab === 'wishlist' && (
                <FavoriteTab 
                  items={favorites} 
                  onNavigate={navigate} 
                  onToggleFavorite={toggleFavorite} 
                />
              )}
              {activeTab === 'settings' && profile && (
                <SettingsTab 
                  user={{ 
                    mail: profile.mail || '', 
                    phone: profile.phone || '',
                    avatar: profile.avatar
                  }} 
                  onSave={updateProfile} 
                />
              )}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;