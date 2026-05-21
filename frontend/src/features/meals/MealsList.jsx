import { useEffect, useState, useContext, useMemo } from 'react';

import ToastContext from '../../app/context/ToastContext.jsx';
import MealItem from './MealItem.jsx';
import Loader from '../../ui/Loader.jsx';
import { CATEGORIES } from '../../shared/const/index.js';

import styles from './MealsList.module.css';
import { fetchMeals } from '../../shared/api/mealsApi.js';
function normalizeId(entity) {
  return {
    ...entity,
    id: entity.id || entity._id,
  };
}

function groupMealsByCategory(meals) {
  return meals.reduce((acc, meal) => {
    const category = meal.category || 'Inne';

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(meal);
    return acc;
  }, {});
}

function getCategoriesToRender(categories, mealsByCategory) {
  return categories.filter((category) => mealsByCategory[category]?.length > 0);
}

const MealsList = () => {
  const toastCtx = useContext(ToastContext);

  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      try {
        const data = await fetchMeals();
        setMeals(data.map(normalizeId));
      } catch (err) {
        toastCtx.showToast('error', err.message || 'Błąd pobierania dań.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [toastCtx]);

  const mealsByCategory = useMemo(() => groupMealsByCategory(meals), [meals]);
  const categoriesToRender = useMemo(
    () => getCategoriesToRender(CATEGORIES, mealsByCategory),
    [mealsByCategory],
  );

  if (isLoading) return <Loader size="md" />;

  return (
    <>
      {categoriesToRender.map((category) => (
        <section key={category} className={styles.section}>
          <h2 className={styles.categoryTitle}>{category}</h2>

          <ul className={styles.grid}>
            {mealsByCategory[category].map((meal) => (
              <MealItem key={meal.id} meal={meal} />
            ))}
          </ul>
        </section>
      ))}
    </>
  );
};

export default MealsList;
