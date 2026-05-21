import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductMutation } from '../../../function/admin/useAdminProducts';
import { X, Upload } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:3000';

const ProductCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createProduct, isLoading } = useProductMutation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manufacturer: '',
    price: '',
    remains: '0',
    discount: '0',
    category: '',
    type: '',
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoriesAndTypes = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const [catRes, typeRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/categories`, { headers }),
          fetch(`${API_BASE_URL}/api/types`, { headers })
        ]);

        const catData = await catRes.json();
        const typeData = await typeRes.json();

        setCategories(catData.data || []);
        setTypes(typeData.data || []);
      } catch (err) {
        console.error('Error fetching categories/types:', err);
      }
    };

    fetchCategoriesAndTypes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSubmitError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...previews]);
    }
  };

  const handleRemovePreview = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitError(null);

  if (!formData.name.trim()) {
    setSubmitError('Название обязательно');
    return;
  }
  if (!formData.price || Number(formData.price) < 0) {
    setSubmitError('Некорректная цена');
    return;
  }

  const data = new FormData();
  data.append('name', formData.name.trim());
  data.append('description', formData.description?.trim() || '');
  data.append('manufacturer', formData.manufacturer?.trim() || '');
  data.append('price', formData.price);
  data.append('remains', formData.remains || '0');
  data.append('discount', formData.discount || '0');

  if (formData.category && formData.category.length === 24) {
    data.append('category', formData.category);
  }
  if (formData.type && formData.type.length === 24) {
    data.append('type', formData.type);
  }

  imageFiles.forEach(file => data.append('images', file));

  try {
    const created = await createProduct(data);
    if (created) {
      navigate('/admin');
    }
  } catch (err: any) {
    setSubmitError(err.message || 'Ошибка создания товара');
  }
};

  return (
    <div className="product-edit-container">
      <div className="edit-header">
        <h2>Добавление товара</h2>
        <button onClick={() => navigate('/admin')} className="cancel-btn">Отмена</button>
      </div>

      {submitError && <div className="form-error">{submitError}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-section">
          <h3>Основная информация</h3>
          
          <div className="form-group">
            <label>Название *</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Производитель</label>
              <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} />
            </div>

            <div className="form-group">
              <label>Категория</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option value="">Не выбрана</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Тип</label>
              <select name="type" value={formData.type} onChange={handleInputChange}>
                <option value="">Не выбран</option>
                {types.map(type => (
                  <option key={type._id} value={type._id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Цена и наличие</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Цена (₽) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" />
            </div>
            <div className="form-group">
              <label>Скидка (%)</label>
              <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} min="0" max="100" />
            </div>
            <div className="form-group">
              <label>Остаток (шт) *</label>
              <input type="number" name="remains" value={formData.remains} onChange={handleInputChange} required min="0" />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Изображения</h3>
          <div className="upload-section">
            <label className="upload-label">
              <Upload size={24} />
              <span>Загрузить изображения</span>
              <input type="file" accept="image/*" multiple onChange={handleImageChange} hidden />
            </label>
          </div>

          {imagePreviews.length > 0 && (
            <div className="new-images-preview">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-item new">
                  <img src={preview} alt="Preview" />
                  <button type="button" className="remove-img-btn" onClick={() => handleRemovePreview(index)}>
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={isLoading}>
            {isLoading ? 'Создание...' : 'Создать товар'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;