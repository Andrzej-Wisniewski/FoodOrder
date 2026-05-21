import { useContext, useState, useEffect, useCallback } from 'react';

import AuthContext from '../../app/context/AuthContext';
import ViewContext from '../../app/context/ViewContext';
import ToastContext from '../../app/context/ToastContext';

import MealAdminItem from './MealAdminItem';
import View from '../../ui/View';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';

import { VIEWS, ROLES } from '../../shared/const/index';
import {
  getMealsAdmin,
  updateMealAdmin,
  deleteMealAdmin,
  uploadMealImage,
} from '../../shared/api/mealsApi.js';
import { validateMealForm } from '../../shared/utils/validateForm';

import styles from './MealAdminView.module.css';

const MealAdminView = () => {
  const authCtx = useContext(AuthContext);
  const viewCtx = useContext(ViewContext);
  const toastCtx = useContext(ToastContext);

  const isAdmin = authCtx.user?.role === ROLES.ADMIN;

  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await getMealsAdmin();
        setMeals(data);
      } catch (err) {
        toastCtx.showToast(
          'error',
          err.message || 'Nie udało się pobrać menu.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [isAdmin, toastCtx]);

  const close = useCallback(() => viewCtx.closeView(), [viewCtx]);

  const handleStartEdit = useCallback((meal) => {
    setEditingMeal({ ...meal });
    setEditingFile(null);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingMeal(null);
    setEditingFile(null);
  }, []);

  const handleUpdateEditingMeal = useCallback((updater) => {
    setEditingMeal((prev) =>
      typeof updater === 'function' ? updater(prev) : updater,
    );
  }, []);

  const handleUpdateEditingFile = useCallback((file) => {
    setEditingFile(file);
  }, []);

  const saveMeal = useCallback(async () => {
    if (!editingMeal) return;

    const id = editingMeal.id;

    const mealToValidate = {
      ...editingMeal,
      image: editingFile,
    };

    const errMsg = validateMealForm(mealToValidate, true);

    if (errMsg) {
      return toastCtx.showToast('error', errMsg);
    }

    setIsSaving(true);

    try {
      const updated = await updateMealAdmin(id, {
        name: editingMeal.name,
        price: Number(editingMeal.price),
        description: editingMeal.description,
        category: editingMeal.category,
      });

      const final = editingFile
        ? {
            ...updated,
            image: (await uploadMealImage(id, editingFile)).image,
          }
        : updated;

      setMeals((prev) => prev.map((meal) => (meal.id === id ? final : meal)));

      toastCtx.showToast('success', 'Zapisano zmiany.');
      handleCancelEdit();
    } catch (err) {
      toastCtx.showToast(
        'error',
        err.message || 'Nie udało się zapisać dania.',
      );
    } finally {
      setIsSaving(false);
    }
  }, [editingMeal, editingFile, toastCtx, handleCancelEdit]);

  const removeMeal = useCallback(
    async (id) => {
      try {
        await deleteMealAdmin(id);
        setMeals((prev) => prev.filter((meal) => meal.id !== id));

        if (editingMeal?.id === id) {
          handleCancelEdit();
        }
      } catch (err) {
        toastCtx.showToast('error', err.message || 'Błąd usuwania.');
      }
    },
    [toastCtx, handleCancelEdit, editingMeal],
  );

  return (
    <View openView onClose={close}>
      <div className={styles.header}>
        <h2>Zarządzaj menu</h2>
      </div>

      <div className={styles.body}>
        {isLoading && <Loader size="md" />}

        <ul className={styles.list}>
          {meals.map((meal) => (
            <MealAdminItem
              key={meal.id}
              meal={meal}
              editingMeal={editingMeal}
              editingFile={editingFile}
              isSaving={isSaving}
              onStartEdit={handleStartEdit}
              onCancelEdit={handleCancelEdit}
              onUpdateEditingMeal={handleUpdateEditingMeal}
              onUpdateEditingFile={handleUpdateEditingFile}
              onSave={saveMeal}
              onRemove={removeMeal}
            />
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          onClick={() => viewCtx.openView(VIEWS.MEAL_CREATE)}
        >
          Dodaj
        </Button>

        <Button textOnly onClick={viewCtx.closeView} type="button">
          Zamknij
        </Button>
      </div>
    </View>
  );
};

export default MealAdminView;
