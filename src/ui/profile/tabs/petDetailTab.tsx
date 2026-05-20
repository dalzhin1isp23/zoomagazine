import React, { useState } from 'react';
import { ArrowLeft, Pencil, Trash2, Heart, X, Plus, Upload } from 'lucide-react';
import { PetCardData } from './component/petsProfileCard';
import "../style/pets/petDetail.css";

const FOLDER_COLORS = ['#234cd3', '#059669', '#7c3aed', '#dc2626', '#d97706', '#cacc3b', '#f163d9', '#15a0a5'];
const API_BASE_URL = 'http://127.0.0.1:3000';

export interface PetDetailTabProps {
  pet: PetCardData & {
    folderColor?: string;
    breed?: string;
    tags?: string[];
    documents?: Array<{ title: string; qrCode?: { code: string }; fileUrl?: string }>;
    personalWishlist?: Array<{ name: string; price: number }>;
  };
  onBack?: () => void;
  onEditField?: (field: string) => void;
  onDelete?: () => void;
  onPhotoChange?: (file: File) => void;
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tag: string) => void;
  onFolderColorChange?: (color: string) => void;
  onUploadDocument?: (file: File, title: string) => void;
}

const PetDetailTab: React.FC<PetDetailTabProps> = ({ 
  pet, onBack, onEditField, onDelete, onPhotoChange,
  onAddTag, onRemoveTag, onFolderColorChange, onUploadDocument
}) => {
  const [newTag, setNewTag] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const folderColor = pet.folderColor || '#234cd3';

  const handleAddTag = () => {
    if (newTag.trim()) { onAddTag?.(newTag.trim()); setNewTag(''); }
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && docTitle.trim() && onUploadDocument) {
      onUploadDocument(file, docTitle.trim());
      setDocTitle('');
      e.target.value = '';
    }
  };

  const getAgeText = () => {
    if (!pet.bornDate) return 'Не указан';
    const years = pet.ageYears ?? 0;
    return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}`;
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  return (
    <div className="tab-content pet-detail">
      <button className="back-btn" onClick={onBack}><ArrowLeft size={18} /> Назад к списку</button>

      <div 
        className="pet-detail-folder" 
        style={{ '--folder-color': folderColor } as React.CSSProperties}
      >
        <div 
          className="folder-panel-detail" 
          style={{ backgroundColor: folderColor }} 
        />
        <div className="folder-paper-large">
          
          <div className="pet-detail-header">
            <div className="pet-detail-avatar">
              {pet.photoUrl ? (
                <img 
                  src={getImageUrl(pet.photoUrl)} 
                  alt={pet.name}
                  onError={(e) => {
                    console.error('Ошибка загрузки изображения:', pet.photoUrl);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="avatar-placeholder">?</div>
              )}
              <label className="change-photo-btn" title="Изменить фото">
                <Pencil size={16} />
                <input 
                  type="file" 
                  accept="image/*" 
                  hidden 
                  onChange={(e) => e.target.files?.[0] && onPhotoChange?.(e.target.files[0])} 
                />
              </label>
            </div>
            <div className="pet-detail-actions">
              <button className="action-btn wishlist" title="Избранное питомца"><Heart size={18} /></button>
              <button className="action-btn delete" title="Удалить питомца" onClick={onDelete}><Trash2 size={18} /></button>
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
                  style={{ 
                    backgroundColor: color,
                    border: folderColor === color ? '3px solid #000' : '3px solid transparent',
                    boxShadow: folderColor === color ? '0 0 0 2px #fff, 0 0 0 4px #000' : 'none'
                  }}
                  onClick={() => onFolderColorChange?.(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
          <div className="section-divider" />

          <div className="pet-detail-info">
            <div className="edit-field"><span className="label">Имя:</span><div className="view-mode"><span className="value">{pet.name}</span><button className="edit-btn-red inline-edit" onClick={() => onEditField?.('name')}><Pencil size={14} /></button></div></div>
            <div className="info-row"><span className="label">Вид:</span><span className="value">{pet.animal}</span></div>
            <div className="info-row"><span className="label">Пол:</span><span className="value">{pet.gender || '—'}</span></div>
            <div className="edit-field"><span className="label">Порода:</span><div className="view-mode"><span className="value">{pet.breed || 'Не указана'}</span><button className="edit-btn-red inline-edit" onClick={() => onEditField?.('breed')}><Pencil size={14} /></button></div></div>
            <div className="info-row"><span className="label">Возраст:</span><span className="value">{getAgeText()}</span></div>
          </div>

          <div className="section-divider" />

          <div className="tags-section">
            <h4 className="section-title">Теги</h4>
            <div className="tags-list">
              {pet.tags?.map(tag => (
                <span key={tag} className="tag-item">{tag}<button className="tag-remove" onClick={() => onRemoveTag?.(tag)}><X size={12} /></button></span>
              ))}
            </div>
            <div className="tag-input-group">
              <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Введите новый тег..." onKeyDown={(e) => e.key === 'Enter' && handleAddTag()} />
              <button className="tag-add-btn" onClick={handleAddTag}><Plus size={16} /></button>
            </div>
          </div>

          <div className="section-divider" />

          <div className="documents-section">
            <h4 className="section-title">Документы</h4>
            <div className="doc-upload-group">
              <input type="text" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder="Название документа" />
              <label className="doc-upload-btn">
                <Upload size={16} />
                <input type="file" accept=".pdf,.jpg,.png,.docx" hidden onChange={handleDocUpload} />
              </label>
            </div>
            <div className="doc-list">
              {pet.documents?.map((doc, i) => (
                <div key={i} className="doc-item">
                  <span>{doc.title}</span>
                  {doc.fileUrl && <a href={`${API_BASE_URL}${doc.fileUrl}`} target="_blank" rel="noreferrer" className="doc-link">Скачать</a>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailTab;