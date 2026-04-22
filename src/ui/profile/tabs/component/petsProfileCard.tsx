import React from 'react';
import { Pencil, User } from 'lucide-react';
import "../../style/pets/petCard.css"
export interface PetCardData {
  _id: string;
  name: string;
  animal: string;
  bornDate?: string;
  photoUrl?: string;
  ageYears?: number;
  gender?: 'Мальчик' | 'Девочка';
}

export interface petProfileCardProps {
  pet: PetCardData;
  onClick?: () => void;
  onEdit?: () => void;
}

const petProfileCard: React.FC<petProfileCardProps> = ({ 
  pet, 
  onClick = () => {}, 
  onEdit 
}) => {
  const getAgeText = () => {
    if (pet.ageYears !== undefined && pet.ageYears > 0) {
      return `${pet.ageYears} ${pet.ageYears === 1 ? 'год' : pet.ageYears < 5 ? 'года' : 'лет'}`;
    }
    return 'Возраст не указан';
  };

  return (
    <div className="pet-folder" onClick={onClick}>
      <div className="folder-panel"></div>
      <div className="folder-paper">
        <div className="pet-avatar-circle">
          {pet.photoUrl ? (
            <img 
              src={pet.photoUrl} 
              alt={pet.name}
              className="pet-photo"
            />
          ) : (
            <User size={40} className="avatar-icon" />
          )}
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

export default petProfileCard;