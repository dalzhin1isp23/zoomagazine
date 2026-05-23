import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../entity/Header';
import Footer from '../../entity/Footer';
import ProductCard from '../../entity/ProductCards';
import { Heart, ShoppingCart, Share2, Star, ArrowLeft, Plus, Package, Check, ThumbsUp, Edit, Trash2, FileText, AlertCircle } from 'lucide-react';
import { useProductDetails } from '../../function/products/useProductDetails';
import { useProducts } from '../../function/products/useProducts';
import { useFavorites } from '../../function/profile/useFavorite';
import { useCart } from '../../function/profile/useCart';
import { useProfile } from '../../function/profile/useProfile';
import { api } from '../../api/api';
import "./style/style.css";

const API_BASE_URL = 'http://127.0.0.1:3000';


interface ReviewUser { _id: string; login: string; avatar?: string; }
interface ReviewImage { url: string; filename: string; }
interface Review {
  _id: string; product: string; user: ReviewUser; rating: number; title?: string; comment: string;
  images?: ReviewImage[]; isVerified: boolean; isApproved: boolean; adminNote?: string; helpfulCount: number; createdAt: string; updatedAt: string;
}
interface ReviewStats { averageRating: number; totalReviews: number; distribution: { [key: number]: number }; }
interface ReviewsResponse { reviews: Review[]; pagination: { total: number; page: number; limit: number; totalPages: number }; stats: ReviewStats; }
interface ApiSuccessResponse<T> { status: string; message?: string; data: T; }

const ProductReviewsSection: React.FC<{ productId: string; isAdmin: boolean; currentUserId?: string }> = ({ productId, isAdmin, currentUserId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({ rating: 5, title: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'helpful'>('newest');

  const fetchReviews = useCallback(async (page: number = 1) => {
    setIsLoading(true); setError(null);
    try {
      const token = localStorage.getItem('auth_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
     const params = new URLSearchParams({ sortBy });
      
      console.log(' Fetch reviews:', `/products/${productId}/reviews?${params.toString()}`);
      
      const { data } = await api.get<ApiSuccessResponse<ReviewsResponse>>(`/products/${productId}/reviews?${params.toString()}`, { headers });
      
      console.log(' Reviews response:', data);
      
      if (data?.status === 'success' && data.data) {
        setReviews(data.data.reviews); 
        setStats(data.data.stats);
        setPagination({ page: data.data.pagination.page, totalPages: data.data.pagination.totalPages });
      } else {
        console.warn(' Invalid response format:', data);
        setError('Неверный формат ответа сервера');
      }
    } catch (err: any) { 
      console.error(' Fetch reviews error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки отзывов'); 
    } finally { 
      setIsLoading(false); 
    }
  }, [productId, sortBy]);

  useEffect(() => { 
    if (productId) fetchReviews(1); 
  }, [fetchReviews, productId]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) { alert('Пожалуйста, войдите в систему'); return; }
    if (!formData.comment.trim() || formData.comment.length < 10) { alert('Минимум 10 символов'); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Нет токена');
      if (editingReview) {
        await api.patch(`/reviews/${editingReview._id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
        setEditingReview(null);
      } else {
        await api.post('/reviews', { productId, ...formData }, { headers: { Authorization: `Bearer ${token}` } });
      }
      setShowForm(false); 
      setFormData({ rating: 5, title: '', comment: '' }); 
      fetchReviews(pagination.page);
    } catch (err: any) { 
      const msg = err.response?.data?.message || err.message || 'Ошибка';
      const status = err.response?.status;
      
      if (status === 409) {
        alert('У вас уже есть отзыв на этот товар. Хотите отредактировать его?');
      } else {
        alert(msg);
      }
    } finally { 
      setSubmitting(false); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить?')) return;
    try { 
      await api.delete(`/reviews/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } }); 
      fetchReviews(pagination.page); 
    } catch { 
      alert('Ошибка удаления'); 
    }
  };

  const handleModerate = async (id: string, isApproved: boolean) => {
    const note = prompt('Примечание:') || undefined;
    try { 
      await api.patch(`/admin/reviews/${id}/moderate`, { isApproved, adminNote: note }, { headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` } }); 
      fetchReviews(pagination.page); 
    } catch { 
      alert('Ошибка модерации'); 
    }
  };

  const renderStars = (r: number, interactive = false, onChange?: (v: number) => void) => (
    <div className="stars-input">
      {[1,2,3,4,5].map(s => (
        <button 
          key={s} 
          type="button" 
          className={`star-btn ${interactive ? 'interactive' : ''} ${s <= r ? 'filled' : ''}`} 
          onClick={() => interactive && onChange?.(s)} 
          disabled={!interactive}
        >
          <Star size={16} fill={s <= r ? '#fbbf24' : 'none'} color={s <= r ? '#fbbf24' : '#cbd5e1'}/>
        </button>
      ))}
    </div>
  );

  const getAvatar = (u: ReviewUser) => u.avatar?.startsWith('http') ? u.avatar : `${API_BASE_URL}${u.avatar || '/uploads/avatars/placeholder.jpg'}`;
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day:'2-digit', month:'long', year:'numeric' });

  if (isLoading && !reviews.length) return <div className="reviews-loading">Загрузка отзывов...</div>;

  return (
    <div className="product-reviews-inline">
      {stats && (
        <div className="reviews-summary-mini">
          <div className="rating-overview-mini">
            <div className="rating-large-mini">{stats.averageRating}</div>
            <div className="rating-stars-mini">{renderStars(Math.round(stats.averageRating))}</div>
            <div className="rating-count-mini">{stats.totalReviews} отзывов</div>
          </div>
          <div className="rating-distribution-mini">
            {[5,4,3,2,1].map(s => { 
              const c = stats.distribution[s] || 0; 
              const p = stats.totalReviews > 0 ? (c / stats.totalReviews) * 100 : 0; 
              return (
                <div key={s} className="rating-bar-mini">
                  <span className="star-label-mini">{s}★</span>
                  <div className="bar-bg-mini">
                    <div className="bar-fill-mini" style={{ width: `${p}%` }}/>
                  </div>
                  <span className="bar-count-mini">{c}</span>
                </div>
              ); 
            })}
          </div>
        </div>
      )}

      {(showForm || editingReview) && (
        <form onSubmit={handleFormSubmit} className="review-form-mini">
          <h4>{editingReview ? 'Редактировать' : 'Ваш отзыв'}</h4>
          <div className="form-group-mini">
            <label>Оценка *</label>
            {renderStars(formData.rating, true, r => setFormData(p => ({...p, rating: r})))}
          </div>
          <div className="form-group-mini">
            <label>Заголовок</label>
            <input 
              value={formData.title} 
              onChange={e => setFormData(p => ({...p, title: e.target.value}))} 
              maxLength={100}
            />
          </div>
          <div className="form-group-mini">
            <label>Комментарий *</label>
            <textarea 
              value={formData.comment} 
              onChange={e => setFormData(p => ({...p, comment: e.target.value}))} 
              rows={3} 
              minLength={10} 
              maxLength={2000} 
              required
            />
            <small>{formData.comment.length}/2000</small>
          </div>
          <div className="form-actions-mini">
            <button type="button" className="btn-secondary-mini" onClick={() => { setShowForm(false); setEditingReview(null); }}>Отмена</button>
            <button type="submit" className="btn-primary-mini" disabled={submitting}>
              {submitting ? 'Отправка...' : 'Отправить'}
            </button>
          </div>
        </form>
      )}

      {error && <div className="error-banner-mini"><AlertCircle size={16}/> {error}</div>}
      
      <div className="reviews-list-mini">
        {reviews.map(r => (
          <div key={r._id} className={`review-item-mini ${!r.isApproved && !isAdmin ? 'pending' : ''} ${!r.isApproved && isAdmin ? 'needs-moderation' : ''}`}>
            <div className="review-header-mini">
              <div className="reviewer-info-mini">
                <img src={getAvatar(r.user)} className="reviewer-avatar-mini" alt={r.user.login}/>
                <div>
                  <strong>{r.user.login}</strong>
                  <small>{fmtDate(r.createdAt)}</small>
                </div>
              </div>
              <div className="review-rating-mini">
                {renderStars(r.rating)}
                {r.isVerified && <span className="verified-badge-mini">✓</span>}
              </div>
            </div>
            {r.title && <h5>{r.title}</h5>}
            <p className="review-comment-mini">{r.comment}</p>
            {r.images?.length > 0 && (
              <div className="review-images-mini">
                {r.images.map((i, k) => (
                  <img key={k} src={`${API_BASE_URL}${i.url}`} className="review-image-thumb-mini" alt="" />
                ))}
              </div>
            )}
            {isAdmin && !r.isApproved && (
              <div className="moderation-controls-mini">
                <span>⏳ На модерации</span>
                <button className="btn-sm-mini approve" onClick={() => handleModerate(r._id, true)}>
                  <Check size={12}/>
                </button>
                <button className="btn-sm-mini reject" onClick={() => handleModerate(r._id, false)}>
                  <Trash2 size={12}/>
                </button>
                {r.adminNote && <small>{r.adminNote}</small>}
              </div>
            )}
            {r.user._id === currentUserId && !isAdmin && (
              <div className="review-actions-mini">
                <button className="action-btn-mini" onClick={() => {
                  setEditingReview(r);
                  setFormData({ rating: r.rating, title: r.title || '', comment: r.comment });
                  setShowForm(true);
                }}>
                  <Edit size={12}/>
                </button>
                <button className="action-btn-mini delete" onClick={() => handleDelete(r._id)}>
                  <Trash2 size={12}/>
                </button>
              </div>
            )}
            <button 
              className="helpful-btn-mini" 
              onClick={() => api.post(`/reviews/${r._id}/helpful`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
              })
              .then(d => d.data?.status === 'success' && setReviews(p => p.map(x => 
                x._id === r._id ? { ...x, helpfulCount: d.data.data.helpfulCount } : x
              )))
              .catch(() => {})}
            >
              <ThumbsUp size={12}/> {r.helpfulCount}
            </button>
          </div>
        ))}
        {reviews.length === 0 && !isLoading && <div className="no-reviews-mini">Пока нет отзывов.</div>}
      </div>

      <div className="reviews-controls-mini">
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="sort-select-mini">
          <option value="newest">Новые</option>
          <option value="oldest">Старые</option>
          <option value="rating">Рейтинг</option>
          <option value="helpful">Полезные</option>
        </select>
        {!showForm && !editingReview && (
          <button 
            className="btn-primary-mini write-review-btn-mini" 
            onClick={() => {
              if (!currentUserId) { alert('Войдите в аккаунт'); return; }
              setShowForm(true);
              setEditingReview(null);
            }} 
            disabled={!currentUserId} 
            title={!currentUserId ? 'Необходима авторизация' : ''}
          >
            {currentUserId ? 'Написать отзыв' : 'Войдите, чтобы написать отзыв'}
          </button>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="reviews-pagination-mini">
          <button onClick={() => fetchReviews(pagination.page - 1)} disabled={pagination.page === 1}>←</button>
          <span>{pagination.page}/{pagination.totalPages}</span>
          <button onClick={() => fetchReviews(pagination.page + 1)} disabled={pagination.page === pagination.totalPages}>→</button>
        </div>
      )}
    </div>
  );
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);

  const { profile, isLoading: profileLoading } = useProfile();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart, getQuantity } = useCart();
  const { product, isLoading, error, refetch } = useProductDetails(id);
  const { products: relatedProducts } = useProducts({ initialLimit: 4, autoFetch: false });

  useEffect(() => {
    console.log('👤 Profile:', profile);
    console.log('⏳ Profile Loading:', profileLoading);
    console.log('🆔 Extracted ID:', profile?._id || profile?.id || JSON.parse(localStorage.getItem('auth_user') || '{}')?._id);
  }, [profile, profileLoading]);

  const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
  const currentUserId = profile?._id || profile?.id || authUser?._id || authUser?.id;
  const isAdmin = profile?.role?.name?.toLowerCase() === 'admin' || profile?.role === 'admin';
  const isAuthReady = !profileLoading && !!currentUserId;

  const handleAddToCart = async (qty = quantity) => {
    if (!product?._id || isAdding) return;
    setIsAdding(true);
    const ok = await addToCart(product._id, qty, product);
    if (ok) { 
      setShowAddedToast(true); 
      setTimeout(() => setShowAddedToast(false), 2000); 
    }
    setIsAdding(false);
  };

  const getImageUrl = (url?: string) => url?.startsWith('http') ? url : `${API_BASE_URL}${url || '/uploads/products/placeholder.jpg'}`;
  const discount = product?.discount && product.discount > 0 ? Math.round(product.price * (1 - product.discount / 100)) : null;
  const price = discount || product?.price || 0;
  const stock = product?.remains ?? 0;
  const inCart = product?._id ? getQuantity(product._id) : 0;
  const inWish = product?._id ? isFavorite(product._id) : false;

  if (isLoading) return (
    <>
      <Header />
      <div className="product-detail-page">
        <div className="container">
          <div className="loading-placeholder">Загрузка товара...</div>
        </div>
      </div>
      <Footer />
    </>
  );

  if (error || !product) return (
    <>
      <Header />
      <div className="product-detail-page">
        <div className="container">
          <button onClick={() => navigate(-1)} className="back-btn">
            <ArrowLeft size={16}/> Назад
          </button>
          <div className="error-banner">
            {error || 'Товар не найден'}
            <button onClick={() => id && refetch()} className="retry-btn">Повторить</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <div className="product-detail-page">
        <div className="container">
          <div className="breadcrumbs">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Главная</span> <span>/</span>
            <span onClick={() => navigate('/catalog')} className="breadcrumb-link">Каталог</span> <span>/</span>
            <span>{product.name}</span>
          </div>

          {showAddedToast && (
            <div className="toast-success">
              <Check size={18}/> Добавлено в корзину
            </div>
          )}

          <div className="product-detail-content">
            <div className="product-gallery">
              <div className="main-image">
                <img 
                  src={getImageUrl(product.images?.[0]?.url)} 
                  alt={product.name} 
                  style={{ maxWidth: '100%', height: 'auto' }} 
                  onError={e => (e.target as HTMLImageElement).src = getImageUrl()}
                />
              </div>
              <div className="thumbnail-images">
                {product.images?.map((img, i) => (
                  <div key={img._id || i} className={`thumbnail ${i === 0 ? 'active' : ''}`}>
                    <img 
                      src={getImageUrl(img.url)} 
                      alt="" 
                      style={{ width: 40, height: 40, objectFit: 'cover' }} 
                      onError={e => (e.target as HTMLImageElement).src = getImageUrl()}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="product-info-section">
              <div className="product-header">
                <h1>{product.name}</h1>
                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={18} 
                        fill={i < Math.floor(product.rating || 0) ? '#fbbf24' : 'none'} 
                        color={i < Math.floor(product.rating || 0) ? '#fbbf24' : '#cbd5e1'}
                      />
                    ))}
                  </div>
                  <span className="rating-text">{product.rating} ({product.reviewCount || 0})</span>
                </div>
              </div>
              <div className="product-price-section">
                <span className="current-price">{price} ₽</span>
                {discount && <span className="old-price">{product.price} ₽</span>}
                {product.discount && <span className="discount-badge">-{product.discount}%</span>}
              </div>

              <div className="product-actions">
                <div className="quantity-selector">
                  <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={inCart + quantity - 1 > stock}>−</button>
                  <span className="qty-value">{quantity}</span>
                  <button className="qty-btn" onClick={() => setQuantity(quantity + 1)} disabled={inCart + quantity + 1 > stock}>+</button>
                </div>
                <div className="bulk-actions">
                  <button className="bulk-btn" onClick={() => handleAddToCart(10)} disabled={inCart + 10 > stock || stock < 10}>
                    <Package size={16}/><span>+10</span>
                  </button>
                  <button className="bulk-btn bulk-large" onClick={() => handleAddToCart(50)} disabled={inCart + 50 > stock || stock < 50}>
                    <Plus size={16}/><span>+50</span>
                  </button>
                </div>
                <div className='wish'>
                    <button 
                  className="add-to-cart-btn-large" 
                  onClick={() => handleAddToCart(quantity)} 
                  disabled={stock <= 0 || inCart + quantity > stock}
                >
                  {isAdding ? (
                    <><span className="spinner"/> Добавление...</>
                  ) : inCart > 0 ? (
                    <><ShoppingCart size={20}/> В корзине: {inCart} шт</>
                  ) : stock > 0 ? (
                    <><ShoppingCart size={20}/> Добавить в корзину</>
                  ) : (
                    <><ShoppingCart size={20}/> Нет в наличии</>
                  )}
                </button>
                
                {inCart > 0 && (
                  <button className="go-to-cart-btn" onClick={() => navigate('/cart')}>
                    Перейти в корзину
                  </button>
                )}
                <button 
                  className={`wishlist-btn-large ${inWish ? 'active' : ''}`} 
                  onClick={() => toggleFavorite(product._id)}
                >
                  <Heart size={20} fill={inWish ? '#ef4444' : 'none'} color={inWish ? '#ef4444' : 'white'}/>
                </button>
                </div>
                
              </div>

              <div className="product-meta">
                <div className="meta-item">
                  <span className="meta-label">Категория:</span>
                  <span>{product.category?.name || '—'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Остаток:</span>
                  <span className={stock <= 5 ? 'low-stock' : ''}>
                    {stock} шт {stock <= 5 && stock > 0 ? '(мало)' : ''}{stock === 0 ? '(нет)' : ''}
                  </span>
                </div>
                {inCart > 0 && (
                  <div className="meta-item">
                    <span className="meta-label">В корзине:</span>
                    <span className="in-cart">{inCart} шт</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="product-tabs-mini-container" style={{ marginTop: '3rem' }}>
            <div className="product-tabs-mini">
              <button 
                className={`tab-btn-mini ${activeTab === 'description' ? 'active' : ''}`} 
                onClick={() => setActiveTab('description')}
              >
                <FileText size={14}/> Описание
              </button>
              <button 
                className={`tab-btn-mini ${activeTab === 'reviews' ? 'active' : ''}`} 
                onClick={() => setActiveTab('reviews')}
              >
                <Star size={14}/> Отзывы ({product.reviewCount || 0})
              </button>
            </div>

            <div className="tab-content-mini">
              <div className="tab-pane-mini" style={{ display: activeTab === 'description' ? 'block' : 'none' }}>
                <p className="product-description" style={{ whiteSpace: 'pre-wrap' }}>{product.description}</p>
                {product.features?.length > 0 && (
                  <div className="product-features">
                    <h4>Особенности:</h4>
                    {product.features.map((f: string, i: number) => (
                      <div key={i} className="feature-item">✓ {f}</div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="tab-pane-mini" style={{ display: activeTab === 'reviews' ? 'block' : 'none' }}>
             
                {!isAuthReady && profileLoading ? (
                  <div className="reviews-loading">Загрузка профиля...</div>
                ) : product?._id ? (
                  <ProductReviewsSection 
                    productId={product._id} 
                    isAdmin={isAdmin} 
                    currentUserId={currentUserId} 
                  />
                ) : (
                  <div className="reviews-loading">Загрузка товара...</div>
                )}
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="related-products">
              <h2 className="section-title">Похожие товары</h2>
              <div className="products-grid grid">
                {relatedProducts.map(p => (
                  <ProductCard 
                    key={p._id} 
                    product={p} 
                    viewMode="grid" 
                    onToggleFavorite={toggleFavorite} 
                    isFavorite={isFavorite(p._id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;