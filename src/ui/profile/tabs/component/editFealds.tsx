import React from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface EditFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onEditToggle: () => void;
  onChange: (value: string) => void;
  tempValue: string;
  type?: 'text' | 'textarea';
}

const EditField: React.FC<EditFieldProps> = ({
  label,
  value,
  isEditing,
  onEditToggle,
  onChange,
  tempValue,
  type = 'text'
}) => {
  return (
    <div className="edit-field">
      <span className="label">{label}:</span>
      
      {isEditing ? (
        <div className="edit-controls">
          {type === 'textarea' ? (
            <textarea
              value={tempValue}
              onChange={(e) => onChange(e.target.value)}
              className="edit-input"
              rows={3}
            />
          ) : (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => onChange(e.target.value)}
              className="edit-input"
            />
          )}
          <button className="edit-action save" onClick={onEditToggle}>
            <Check size={14} />
          </button>
          <button className="edit-action cancel" onClick={onEditToggle}>
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="view-mode">
          <span className="value">{value}</span>
          <button 
            className="edit-btn-red inline-edit"
            onClick={onEditToggle}
            title="Изменить"
          >
            <Pencil size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EditField;