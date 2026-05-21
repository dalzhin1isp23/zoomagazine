import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminProduct, useProductMutation } from '../../../function/admin/useAdminProducts';
import { X, Upload } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:3000';

interface Category {
  _id: string;
  name: string;
}

interface Type {
  _id: string;
  name: string;
}

const ProductEdit: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const extractProductId = (pathname: string): string | null => {
    const match = pathname.match(/\/admin\/products\/([0-9a-fA-F]{24})\/edit/);
    return match ? match[1] : null;
  };
  
  const id = extractProductId(location.pathname);
  
  useEffect(() => {
    console.log('[ProductEdit] Location pathname:', location.pathname);
    console.log('[ProductEdit] Extracted id:', id);
    console.log('[ProductEdit] ID valid format:', /^[0-9a-fA-F]{24}$/.test(id || ''));
  }, [location.pathname, id]);
  
  const { product, isLoading, error } = useAdminProduct(id || null);
  const { updateProduct, uploadImages, removeImage, setMainImage, isLoading: isMutating } = useProductMutation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manufacturer: '',
    price: '',
    remains: '',
    discount: '',
    category: '',
    type: '',
    isVetMedicine: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      console.log('[ProductEdit] Product loaded:', product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        manufacturer: product.manufacturer || '',
        price: product.price?.toString() || '',
        remains: product.remains?.toString() || '0',
        discount: product.discount?.toString() || '0',
        category: typeof product.category === 'object' ? product.category?._id || '' : product.category || '',
        type: typeof product.type === 'object' ? product.type?._id || '' : product.type || '',
        isVetMedicine: product.isVetMedicine === true || product.isVetMedicine === 'true',
      });
    }
  }, [product]);

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
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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

  const handleRemoveExistingImage = async (imageUrl: string) => {
    if (id && window.confirm('Удалить это изображение?')) {
      await removeImage(id, imageUrl);
      window.location.reload();
    }
  };

  const handleSetMainImage = async (imageUrl: string) => {
    if (id) {
      await setMainImage(id, imageUrl);
      window.location.reload();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setSubmitError('ID товара не указан');
      return;
    }

    setSubmitError(null);

    const updateData: any = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      manufacturer: formData.manufacturer.trim(),
      price: Number(formData.price),
      remains: Number(formData.remains),
      discount: Number(formData.discount),

      isVetMedicine: formData.isVetMedicine === true,
    };

    if (formData.category && /^[0-9a-fA-F]{24}$/.test(formData.category)) {
      updateData.category = formData.category;
    }
    if (formData.type && /^[0-9a-fA-F]{24}$/.test(formData.type)) {
      updateData.type = formData.type;
    }

    try {
      console.log('[ProductEdit] Submitting update:', { id, updateData });
      const updated = await updateProduct(id, updateData);
      
      if (updated && imageFiles.length > 0) {
        await uploadImages(id, imageFiles);
      }

      if (updated) {
        navigate('/admin');
      }
    } catch (err: any) {
      console.error('[ProductEdit] Submit error:', err);
      setSubmitError(err.message || 'Ошибка сохранения');
    }
  };

  const getImageUrl = (url?: string) => {
    if (!url) return `${API_BASE_URL}/uploads/products/placeholder.jpg`;
    if (url.startsWith('http') && !url.includes('127.0.0.1') && !url.includes('localhost')) {
      return `${API_BASE_URL}/uploads/products/placeholder.jpg`;
    }
    if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
    return url;
  };

  if (isLoading) {
    return <div className="loading-placeholder">Загрузка товара...</div>;
  }

  if (error || !product) {
    return (
      <div className="error-banner">
        <strong>Ошибка:</strong> {error || 'Товар не найден'}
        <br /><br />
        <small>ID: {id || 'не извлечён'}</small>
        <br />
        <button onClick={() => navigate('/admin')} className="retry-btn">Назад к списку</button>
      </div>
    );
  }

  return (
    <div className="product-edit-container">
      <div className="edit-header">
        <h2>Редактирование: {product.name}</h2>
        <button onClick={() => navigate('/admin')} className="cancel-btn">Отмена</button>
      </div>

      {submitError && <div className="form-error">{submitError}</div>}

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-section">
          <h3>Основная информация</h3>
          
          <div className="form-group">
            <label>Название *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Производитель</label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Категория</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Не выбрана</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Тип</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="">Не выбран</option>
                {types.map(type => (
                  <option key={type._id} value={type._id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                name="isVetMedicine"
                checked={formData.isVetMedicine}
                onChange={handleInputChange}
              />
              <span>Ветеринарный препарат</span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Цена и наличие</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Цена (₽) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Скидка (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label>Остаток (шт) *</label>
              <input
                type="number"
                name="remains"
                value={formData.remains}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Изображения</h3>
          
          <div className="existing-images">
            {product.images?.map((img, index) => (
              <div key={index} className={`image-item ${img.isMain ? 'main' : ''}`}>
                <img src={getImageUrl(img.url)} alt={img.altText || ''} />
                <div className="image-actions">
                  {!img.isMain && (
                    <button type="button" className="set-main-btn" onClick={() => handleSetMainImage(img.url)}>
                      Сделать главным
                    </button>
                  )}
                  <button type="button" className="remove-img-btn" onClick={() => handleRemoveExistingImage(img.url)}>
                    <X size={16} />
                  </button>
                </div>
                {img.isMain && <span className="main-badge">Главное</span>}
              </div>
            ))}
          </div>

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
          <button type="submit" className="save-btn" disabled={isMutating}>
            {isMutating ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;