import React, { useMemo } from 'react';
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

const getRussianPlural = (value: number, forms: [string, string, string]): string => {
  const n = Math.abs(value) % 100;
  const n1 = n % 10;
  
  if (n > 10 && n < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
};

const PetFolderCard: React.FC<petProfileCardProps> = ({ 
  pet, 
  onClick = () => {}, 
  onEdit 
}) => {
  const folderColor = pet.folderColor || '#234cd3';

  const getAgeText = useMemo(() => {
    if (!pet.bornDate) return 'Возраст не указан';
    
    const birth = new Date(pet.bornDate);
    if (isNaN(birth.getTime())) return 'Возраст не указан';
    
    const now = new Date();
    
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    
    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
      years--;
      months += 12;
    }
    
    if (years > 0) {
      return `${years} ${getRussianPlural(years, ['год', 'года', 'лет'])}`;
    }
    
    if (months > 0) {
      return `${months} ${getRussianPlural(months, ['месяц', 'месяца', 'месяцев'])}`;
    }
    
    return 'менее 1 месяца';
  }, [pet.bornDate]);

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
      <div className="folder-panel" />
      <div className="folder-paper">
        <div className="pet-avatar-circle">
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
          {getAgeText}
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