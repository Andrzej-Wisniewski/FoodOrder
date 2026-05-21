import { CATEGORIES } from '../const/index';

export const validateMealForm = (meal, isEditMode = false) => {
  if (!meal.name?.trim()) return 'Nazwa jest wymagana.';
  if (meal.name.length > 50) return 'Nazwa może mieć maksymalnie 50 znaków.';

  if (!meal.description?.trim()) return 'Opis jest wymagany.';
  if (meal.description.length > 500) {
    return 'Opis może mieć maksymalnie 500 znaków.';
  }
  if (!CATEGORIES.includes(meal.category)) {
    return 'Wybierz prawidłową kategorię.';
  }
  const priceNum = Number(meal.price);
  if (!meal.price || Number.isNaN(priceNum) || priceNum <= 0) {
    return 'Podaj poprawną cenę (większą od 0).';
  }

  if (!isEditMode && !meal.image) {
    return 'Zdjęcie dania jest wymagane.';
  }

  if (meal.image) {
    if (!meal.image.type?.startsWith('image/')) {
      return 'Wybrany plik musi być zdjęciem (np. JPG, PNG).';
    }
  }

  return null;
};
