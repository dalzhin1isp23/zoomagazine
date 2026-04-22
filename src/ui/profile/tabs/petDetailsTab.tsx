import React, { useState } from 'react';
import { ArrowLeft, Pencil, Trash2, Heart, X, Plus } from 'lucide-react';
import { PetCardData } from './component/petsProfileCard';
import "../style/pets/petDetail.css";

const FOLDER_COLORS = ['#1e40af', '#059669', '#7c3aed', '#dc2626', '#d97706', '#0891b2', '#6366f1', '#9333ea'];

export interface PetDetailTabProps {
  pet: PetCardData & {
    folderColor?: string;
    breed?: string;
    tags?: string[];
    documents?: Array<{ title: string; qrCode?: { code: string } }>;
    personalWishlist?: Array<{ name: string; price: number }>;
  };
  onBack?: () => void;
  onEditField?: (field: string) => void;
  onDelete?: () => void;
  onPhotoChange?: (file: File) => void;
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tag: string) => void;
  onFolderColorChange?: (color: string) => void;
}

const petDetailTab: React.FC<PetDetailTabProps> = ({ 
  pet,
  onBack = () => {},
  onEditField = () => {},
  onDelete = () => {},
  onPhotoChange = () => {},
  onAddTag = () => {},
  onRemoveTag = () => {},
  onFolderColorChange = () => {},
}) => {
  const [newTag, setNewTag] = useState('');
  const folderColor = pet.folderColor || '#1e40af';

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  const getAgeText = () => {
    if (!pet.bornDate) return 'Не указан';
    const years = pet.ageYears ?? 0;
    return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}`;
  };

  return (
    <div className="tab-content pet-detail">
      <button className="back-btn" onClick={onBack}>
        <ArrowLeft size={18} /> Назад к списку
      </button>

      <div className="pet-detail-folder" style={{ '--folder-color': folderColor } as React.CSSProperties}>
        <div className="folder-panel-detail" style={{ backgroundColor: folderColor }} />
        <div className="folder-paper-large">
          
          <div className="pet-detail-header">
            <div className="pet-detail-avatar">
              {pet.photoUrl ? (
                <img src={pet.photoUrl} alt={pet.name} />
              ) : (
                <div className="avatar-placeholder">?</div>
              )}
              <label className="change-photo-btn" title="Изменить фото">
                <Pencil size={16} />
                <input 
                  type="file" 
                  accept="image/*" 
                  hidden 
                  onChange={(e) => e.target.files?.[0] && onPhotoChange(e.target.files[0])}
                />
              </label>
            </div>
            
            <div className="pet-detail-actions">
              <button className="action-btn wishlist" title="Избранное питомца">
                <Heart size={18} />
              </button>
              <button 
                className="action-btn delete" 
                title="Удалить питомца"
                onClick={onDelete}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div className="section-divider" />

          <div className="folder-color-picker">
            <span className="label">Цвет папки:</span>
            <div className="color-circles">
              {FOLDER_COLORS.map(color => (
                <button
                  key={color}
                  className={`color-circle ${folderColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => onFolderColorChange(color)}
                />
              ))}
            </div>
          </div>

          <div className="section-divider" />

          <div className="pet-detail-info">
            <div className="edit-field">
              <span className="label">Имя:</span>
              <div className="view-mode">
                <span className="value">{pet.name}</span>
                <button className="edit-btn-red inline-edit" onClick={() => onEditField('name')} title="Изменить">
                  <Pencil size={14} />
                </button>
              </div>
            </div>
            
            <div className="info-row">
              <span className="label">Вид:</span>
              <span className="value">{pet.animal}</span>
            </div>
            
            <div className="info-row">
              <span className="label">Пол:</span>
              <span className="value">{pet.gender || '—'}</span>
            </div>
            
            <div className="edit-field">
              <span className="label">Порода:</span>
              <div className="view-mode">
                <span className="value">{pet.breed || 'Не указана'}</span>
                <button className="edit-btn-red inline-edit" onClick={() => onEditField('breed')} title="Изменить">
                  <Pencil size={14} />
                </button>
              </div>
            </div>
            
            <div className="info-row">
              <span className="label">Возраст:</span>
              <span className="value">{getAgeText()}</span>
            </div>
          </div>

          <div className="section-divider" />

          <div className="tags-section">
            <h4 className="section-title">Теги</h4>
            <div className="tags-list">
              {pet.tags?.map(tag => (
                <span key={tag} className="tag-item">
                  {tag}
                  <button className="tag-remove" onClick={() => onRemoveTag(tag)} title="Убрать тег">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="tag-input-group">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Введите новый тег..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <button className="tag-add-btn" onClick={handleAddTag} title="Добавить тег">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="section-divider" />

          <div className="wishlist-section">
            <h4 className="section-title">Избранное питомца</h4>
            <div className="wishlist-list">
              {pet.personalWishlist?.length ? (
                pet.personalWishlist.map((item, idx) => (
                  <div key={idx} className="wishlist-item">
                    <span className="wishlist-name">{item.name}</span>
                    <span className="wishlist-price">{item.price.toLocaleString('ru-RU')} ₽</span>
                  </div>
                ))
              ) : (
                <p className="empty-text">Список избранного пуст</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default petDetailTab;