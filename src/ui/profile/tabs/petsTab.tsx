import React from 'react';
import { Plus, PawPrint } from 'lucide-react';
import PetFolderCard, { PetCardData } from './component/petsProfileCard';
import "../style/pets/pet.css";
import "../style/pets/petCard.css";
const MOCK_PETS: PetCardData[] = [
  {
    _id: '1',
    name: 'Барсик',
    animal: 'Кот',
    gender: 'Мальчик',
    ageYears: 3,
    photoUrl: '',
  },
  {
    _id: '1',
    name: 'Барсик',
    animal: 'Кот',
    gender: 'Мальчик',
    ageYears: 3,
    photoUrl: '',
  },
  {
    _id: '1',
    name: 'Барсик',
    animal: 'Кот',
    gender: 'Мальчик',
    ageYears: 3,
    photoUrl: '',
  },
  {
    _id: '1',
    name: 'Барсик',
    animal: 'Кот',
    gender: 'Мальчик',
    ageYears: 3,
    photoUrl: '',
  }
];


export interface petsTabProps {
  pets?: PetCardData[];
  onAddClick?: () => void;
  onSelectPet?: (pet: PetCardData) => void;
  onEditPet?: (pet: PetCardData) => void;
}

const petsTab: React.FC<petsTabProps> = ({ 
  pets = MOCK_PETS,
  onAddClick = () => {},
  onSelectPet = () => {},
  onEditPet = () => {},
}) => {
  return (
    <div className="tab-content">
      <div className="pets-header">
        <h1 className="page-title">Мои питомцы</h1>
        <button className="add-pet-btn" onClick={onAddClick}>
          <Plus size={18} /> Добавить питомца
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="empty-state">
          <PawPrint size={48} />
          <p>У вас пока нет питомцев</p>
          <button onClick={onAddClick}>
            Добавить первого питомца
          </button>
        </div>
      ) : (
        <div className="pets-grid">
          {pets.map(pet => (
            <PetFolderCard
              key={pet._id}
              pet={pet}
              onClick={() => onSelectPet(pet)}
              onEdit={() => onEditPet(pet)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default petsTab;