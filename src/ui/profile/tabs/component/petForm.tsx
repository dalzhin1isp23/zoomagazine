import React from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { PetCardData } from './petsProfileCard';

const AVAILABLE_TAGS = [
  'Стерилизован', 'Вакцинирован', 'Чипирован', 'Аллергик',
  'Щенок', 'Взрослый', 'Сеньор', 'Активный', 'Спокойный', 'Дружелюбный'
];

export interface PetFormProps {
  initialPet?: PetCardData;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

const PetForm: React.FC<PetFormProps> = ({ 
  initialPet,
  onSubmit = () => {},
  onCancel = () => {},
}) => {
  return (
    <div className="tab-content">
      <button className="back-btn" onClick={onCancel}>
        <ArrowLeft size={18} /> {initialPet ? 'Отмена' : 'Назад'}
      </button>

      <h1 className="page-title">{initialPet ? 'Редактировать питомца' : 'Добавить питомца'}</h1>
      
      <form className="pet-form" onSubmit={(e) => { e.preventDefault(); onSubmit({}); }}>
        <div className="form-section">
          <h3>Основная информация</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Имя *</label>
              <input type="text" defaultValue={initialPet?.name} required />
            </div>
            
            <div className="form-group">
              <label>Вид *</label>
              <select defaultValue={initialPet?.animal} required>
                <option value="">Выберите вид</option>
                <option value="Собака">Собака</option>
                <option value="Кот">Кот</option>
                <option value="Птица">Птица</option>
                <option value="Грызун">Грызун</option>
                <option value="Пресмыкающееся">Пресмыкающееся</option>
                <option value="Рыба">Рыба</option>
                <option value="Другое">Другое</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Пол *</label>
              <select defaultValue={initialPet?.gender || 'Мальчик'} required>
                <option value="Мальчик">Мальчик</option>
                <option value="Девочка">Девочка</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Порода</label>
              <input type="text" defaultValue={initialPet?.breed} />
            </div>
          </div>

          <div className="form-group">
            <label>Дата рождения</label>
            <input type="date" defaultValue={initialPet?.bornDate?.split('T')[0]} />
          </div>
        </div>

        <div className="form-section">
          <h3>Фото питомца</h3>
          <div className="photo-upload">
            <label className="upload-label">
              <Upload size={24} />
              <span>Загрузить фото</span>
              <input type="file" accept="image/*" hidden />
            </label>
            <span className="file-name">Файл не выбран</span>
          </div>
        </div>

        <div className="form-section">
          <h3>Теги</h3>
          <div className="tags-selector">
            {AVAILABLE_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                className="tag-btn"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Отмена
          </button>
          <button type="submit" className="save-btn">
            {initialPet ? 'Сохранить изменения' : 'Добавить питомца'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PetForm;