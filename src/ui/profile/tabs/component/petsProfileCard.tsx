import React from 'react';
import { Pencil, User } from 'lucide-react';
import "../../style/pets/petCard.css";

const API_BASE_URL = 'http://127.0.0.1:3000';

export interface PetCardData {
  _id: string;
  name: string;
  animal: string;
  bornDate?: string;
  photoUrl?: string;
  ageYears?: number;
  gender?: 'Мальчик' | 'Девочка';
  folderColor?: string; 
}

export interface petProfileCardProps {
  pet: PetCardData;
  onClick?: () => void;
  onEdit?: () => void;
}

const PetFolderCard: React.FC<petProfileCardProps> = ({ 
  pet, 
  onClick = () => {}, 
  onEdit 
}) => {
  const folderColor = pet.folderColor || '#234cd3';

  const getAgeText = () => {
    if (pet.ageYears !== undefined && pet.ageYears > 0) {
      return `${pet.ageYears} ${pet.ageYears === 1 ? 'год' : pet.ageYears < 5 ? 'года' : 'лет'}`;
    }
    return 'Возраст не указан';
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  return (
    <div 
      className="pet-folder" 
      onClick={onClick}
      style={{ backgroundColor: folderColor } as React.CSSProperties}
    >
      <div 
        className="folder-panel" 
      />
      <div className="folder-paper">
        <div 
          className="pet-avatar-circle"
        >
          {pet.photoUrl ? (
            <img 
              src={getImageUrl(pet.photoUrl)} 
              alt={pet.name}
              className="pet-photo"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <User size={40} className={`avatar-icon ${pet.photoUrl ? 'hidden' : ''}`} />
        </div>
        
        <h3 className="pet-name">{pet.name}</h3>
        <p className="pet-species">{pet.animal}</p>
        <p className="pet-age">
          {pet.gender && <span>{pet.gender}, </span>}
          {getAgeText()}
        </p>
        
        {onEdit && (
          <button 
            className="edit-btn-red smaller-pencil"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Редактировать"
          >
            <Pencil size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PetFolderCard;