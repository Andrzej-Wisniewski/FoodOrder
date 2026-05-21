import { useState, useContext, useCallback, useEffect } from 'react';

import ViewContext from '../../app/context/ViewContext.jsx';
import ToastContext from '../../app/context/ToastContext.jsx';

import View from '../../ui/View.jsx';
import Card from '../../ui/Card.jsx';
import Button from '../../ui/Button.jsx';
import Loader from '../../ui/Loader.jsx';
import MealForm from './MealForm.jsx';

import { uploadMealImage, createMealAdmin } from '../../shared/api/mealsApi.js';
import { validateMealForm } from '../../shared/utils/validateForm.js';
import { VIEWS } from '../../shared/const/index.js';

import styles from './MealCreateView.module.css';

const MealCreateView = () => {
  const viewCtx = useContext(ViewContext);
  const toastCtx = useContext(ToastContext);

  const [meal, setMeal] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const close = useCallback(() => {
    viewCtx.openView(VIEWS.MEALS_ADMIN);
  }, [viewCtx]);

  const handleChange = useCallback((field, value) => {
    setMeal((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleFileChange = useCallback((selectedFile) => {
    setFile(selectedFile);

    setImagePreview((prevPreview) => {
      if (prevPreview) URL.revokeObjectURL(prevPreview);
      return URL.createObjectURL(selectedFile);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const save = async () => {
    const errMsg = validateMealForm({ ...meal, image: file });
    if (errMsg) {
      toastCtx.showToast('error', errMsg);
      return;
    }

    setIsSending(true);

    try {
      const created = await createMealAdmin({
        name: meal.name,
        price: Number(meal.price),
        description: meal.description,
        category: meal.category,
      });

      await uploadMealImage(created.id, file);

      toastCtx.showToast('success', 'Dodano danie.');
      viewCtx.openView(VIEWS.MEALS_ADMIN);
    } catch (err) {
      toastCtx.showToast(
        'error',
        err.message || 'Nie udało się utworzyć dania.',
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View openView onClose={close}>
      <div className={styles.header}>
        <h2>Dodaj danie</h2>
      </div>

      <Card className={styles.card}>
        <MealForm
          meal={meal}
          file={file}
          onChange={handleChange}
          onFileChange={handleFileChange}
          disabled={isSending}
        />

        {imagePreview && (
          <div className={styles.imagePreview}>
            <img src={imagePreview} alt="Podgląd dania" />
          </div>
        )}

        <div className={styles.actions}>
          <Button onClick={save} disabled={isSending}>
            {isSending ? <Loader size="sm" /> : 'Dodaj'}
          </Button>
          <Button textOnly onClick={viewCtx.closeView} disabled={isSending}>
            Anuluj
          </Button>
        </div>
      </Card>
    </View>
  );
};

export default MealCreateView;
