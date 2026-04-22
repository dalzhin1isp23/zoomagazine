import React, { useState } from 'react';
import Header from '../../entity/Header';
import Footer from '../../entity/Footer';
import { User, LogOut, Package, PawPrint,BookHeart,UserRoundCog  } from 'lucide-react';
import "./style/profile/profile.css";
import ordersTab from './tabs/ordersTab';
import petsTab from './tabs/petsTab';
import petDetail from './tabs/petDetailsTab';
import petForm from './tabs/component/petForm';
import favoriteTab from './tabs/favoriteTab';
import settingsTab from './tabs/settingTab';
const OrdersTab = ordersTab;
const PetsTab = petsTab;
const PetDetail = petDetail;
const PetForm = petForm;
const FavoriteTab = favoriteTab;
const SettingsTab = settingsTab;

type ProfileTab = 'orders' | 'pets' | 'wishlist' | 'settings';
type PetsView = 'list' | 'detail' | 'form';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('orders');
  const [petsView, setPetsView] = useState<PetsView>('list');
  const [selectedPet, setSelectedPet] = useState<any>(null);

  const mockUser = {
    mail: 'user@example.com',
    phone: '+7 (999) 123-45-67',
  };

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
                  <User size={40} />
                </div>
                <h3>{mockUser.mail.split('@')[0]}</h3>
                <p>{mockUser.mail}</p>
                {mockUser.phone && <p className="user-phone">{mockUser.phone}</p>}
              </div>

              <nav className="profile-nav">
                <button 
                  className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('orders')}
                >
                  <Package/>
                   Мои заказы
                </button>
                <button 
                  className={`nav-item ${activeTab === 'pets' ? 'active' : ''}`} 
                  onClick={() => { setActiveTab('pets'); setPetsView('list'); }}
                >
                  <PawPrint/>
                   Мои питомцы
                </button>
                <button 
                  className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('wishlist')}
                >
                  <BookHeart/>
                   Избранное
                </button>
                <button 
                  className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('settings')}
                >
                  <UserRoundCog/>
                   Настройки
                </button>
                <button className="nav-item logout" onClick={() => {}}>
                  <LogOut size={20} /> Выйти
                </button>
              </nav>
            </aside>

            <main className="profile-main">
           
              {activeTab === 'orders' && <OrdersTab />}
              
              {activeTab === 'pets' && petsView === 'list' && (
                <PetsTab
                  onSelectPet={(pet: any) => { setSelectedPet(pet); setPetsView('detail'); }}
                  onEditPet={(pet: any) => { setSelectedPet(pet); setPetsView('form'); }}
                  onAddClick={() => { setSelectedPet(null); setPetsView('form'); }}
                />
              )}
              
              {activeTab === 'pets' && petsView === 'detail' && selectedPet && (
                <PetDetail
                  pet={selectedPet}
                  onBack={() => setPetsView('list')}
                />
              )}
              
              {activeTab === 'pets' && petsView === 'form' && (
                <PetForm
                  initialPet={selectedPet || undefined}
                  onCancel={() => { setPetsView('list'); setSelectedPet(null); }}
                />
              )}
              
              {activeTab === 'wishlist' && <FavoriteTab />}
              {activeTab === 'settings' && <SettingsTab user={mockUser} />}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;