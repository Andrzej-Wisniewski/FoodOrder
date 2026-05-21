import { memo, useCallback } from 'react';

import MealForm from './MealForm.jsx';
import Card from '../../ui/Card.jsx';
import Button from '../../ui/Button.jsx';

import { formatPrice } from '../../shared/utils/currency.js';

import styles from './MealAdminItem.module.css';
const apiBase = import.meta.env.VITE_API_URL || '';

const MealAdminItem = memo(
  ({
    meal,
    editingMeal,
    editingFile,
    isSaving,
    onStartEdit,
    onCancelEdit,
    onUpdateEditingMeal,
    onUpdateEditingFile,
    onSave,
    onRemove,
  }) => {
    const isEditing = editingMeal?.id === meal.id;

    const handleStartEditClick = useCallback(() => {
      onStartEdit(meal);
    }, [onStartEdit, meal]);

    const handleRemoveClick = useCallback(() => {
      if (window.confirm(`Czy na pewno chcesz usunąć danie "${meal.name}"?`)) {
        onRemove(meal.id);
      }
    }, [onRemove, meal.id, meal.name]);

    const handleSaveClick = useCallback(() => onSave(), [onSave]);
    const handleCancelClick = useCallback(() => onCancelEdit(), [onCancelEdit]);

    const changeField = useCallback(
      (key, value) => {
        onUpdateEditingMeal((prev) => ({
          ...prev,
          [key]: value,
        }));
      },
      [onUpdateEditingMeal],
    );

    const imgBase = meal?.image;
    const srcBase = imgBase
      ? `${apiBase}/images/${imgBase.replace(/-\d+\.webp$/, '')}`
      : null;

    return (
      <Card className={`${styles.item} ${isEditing ? styles.editing : ''}`}>
        {!isEditing && (
          <>
            <div className={styles.viewBody}>
              {srcBase && (
                <img
                  src={`${srcBase}-400.webp`}
                  srcSet={`${srcBase}-400.webp 400w, ${srcBase}-600.webp 600w, ${srcBase}-800.webp 800w`}
                  sizes="(max-width: 600px) 100vw, 200px"
                  alt={`Zdjęcie ${meal.name}`}
                  loading="lazy"
                  className={styles.thumbnail}
                />
              )}

              <div className={styles.viewInfo}>
                <p>
                  <strong>{meal.name}</strong> — {formatPrice(meal.price)} (
                  {meal.category})
                </p>
                {meal.description && (
                  <p className={styles.description}>{meal.description}</p>
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <Button onClick={handleStartEditClick}>Edytuj</Button>
              <Button textOnly onClick={handleRemoveClick}>
                Usuń
              </Button>
            </div>
          </>
        )}

        {isEditing && (
          <>
            <MealForm
              meal={editingMeal}
              file={editingFile}
              onChange={changeField}
              onFileChange={onUpdateEditingFile}
              disabled={isSaving}
            />

            <div className={styles.actions}>
              <Button onClick={handleSaveClick} disabled={isSaving}>
                {isSaving ? 'Zapisywanie...' : 'Zapisz'}
              </Button>
              <Button textOnly onClick={handleCancelClick} disabled={isSaving}>
                Anuluj
              </Button>
            </div>
          </>
        )}
      </Card>
    );
  },
);

export default MealAdminItem;
