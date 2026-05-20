import React, { useState } from 'react';
import { ArrowLeft, Upload, X, Check } from 'lucide-react';
import { PetCardData } from './petsProfileCard';

const AVAILABLE_TAGS = [
  'Стерилизован', 'Вакцинирован', 'Чипирован', 'Аллергик',
  'Щенок', 'Взрослый', 'Сеньор', 'Активный', 'Спокойный', 'Дружелюбный'
];

const FOLDER_COLORS = ['#234cd3', '#059669', '#7c3aed', '#dc2626', '#d97706', '#cacc3b', '#f163d9', '#15a0a5'];

export interface PetFormProps {
  initialPet?: PetCardData & { tags?: string[]; folderColor?: string };
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

const PetForm: React.FC<PetFormProps> = ({ 
  initialPet,
  onSubmit = () => {},
  onCancel = () => {},
}) => {
  const [name, setName] = useState(initialPet?.name || '');
  const [animal, setAnimal] = useState(initialPet?.animal || '');
  const [gender, setGender] = useState(initialPet?.gender || 'Мальчик');
  const [breed, setBreed] = useState(initialPet?.breed || '');
  const [bornDate, setBornDate] = useState(initialPet?.bornDate?.split('T')[0] || '');
  const [tags, setTags] = useState<string[]>(initialPet?.tags || []);
  const [folderColor, setFolderColor] = useState(initialPet?.folderColor || '#234cd3');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(initialPet?.photoUrl || '');

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      name: name.trim(),
      animal,
      gender,
      breed: breed.trim() || undefined,
      bornDate: bornDate || undefined,
      tags,
      folderColor,
      photoFile
    });
  };

  return (
    <div className="tab-content">
      <button className="back-btn" onClick={onCancel}>
        <ArrowLeft size={18} /> {initialPet ? 'Отмена' : 'Назад'}
      </button>

      <h1 className="page-title">{initialPet ? 'Редактировать питомца' : 'Добавить питомца'}</h1>
      
      <form className="pet-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Основная информация</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Имя *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            
            <div className="form-group">
              <label>Вид *</label>
              <select value={animal} onChange={e => setAnimal(e.target.value)} required>
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
              <select value={gender} onChange={e => setGender(e.target.value)} required>
                <option value="Мальчик">Мальчик</option>
                <option value="Девочка">Девочка</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Порода</label>
              <input type="text" value={breed} onChange={e => setBreed(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>Дата рождения</label>
            <input type="date" value={bornDate} onChange={e => setBornDate(e.target.value)} />
          </div>
        </div>

        <div className="form-section">
          <h3>Фото питомца</h3>
          <div className="photo-upload">
            {photoPreview && (
              <div className="photo-preview">
                <img src={photoPreview} alt="Preview" />
                <button type="button" className="remove-photo-btn" onClick={() => { setPhotoFile(null); setPhotoPreview(''); }}>
                  <X size={16} />
                </button>
              </div>
            )}
            <label className="upload-label">
              <Upload size={24} />
              <span>{photoFile ? photoFile.name : 'Выбрать фото'}</span>
              <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Цвет папки</h3>
          <div className="color-selector">
            {FOLDER_COLORS.map(color => (
              <button
                key={color}
                type="button"
                className={`color-circle ${folderColor === color ? 'active' : ''}`}
                style={{ 
                  backgroundColor: color,
                  border: folderColor === color ? '3px solid #000' : '3px solid transparent',
                  boxShadow: folderColor === color ? '0 0 0 2px #fff, 0 0 0 4px #000' : 'none',
                  position: 'relative'
                }}
                onClick={() => setFolderColor(color)}
                title={color}
              >
                {folderColor === color && (
                  <Check size={14} style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    color: '#fff',
                    textShadow: '0 0 2px #000'
                  }} />
                )}
              </button>
            ))}
          </div>
          <p className="selected-color-text">Выбран цвет: <span style={{ color: folderColor, fontWeight: 'bold' }}>{folderColor}</span></p>
        </div>

        <div className="form-section">
          <h3>Теги</h3>
          <div className="tags-selector">
            {AVAILABLE_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                className={`tag-btn ${tags.includes(tag) ? 'selected' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
                {tags.includes(tag) && <X size={12} />}
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>Отмена</button>
          <button type="submit" className="save-btn">
            {initialPet ? 'Сохранить изменения' : 'Добавить питомца'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PetForm;