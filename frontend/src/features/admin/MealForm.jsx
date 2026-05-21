import { useContext, useId } from 'react';

import Input from '../../ui/Input.jsx';
import ToastContext from '../../app/context/ToastContext.jsx';

import { CATEGORIES } from '../../shared/const/index.js';
import { validateImageFile } from '../../shared/utils/validateImageFile.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import styles from './MealForm.module.css';

const MealForm = ({ meal, file, onChange, onFileChange, disabled = false }) => {
  const toastCtx = useContext(ToastContext);

  const descId = useId();
  const catId = useId();
  const fileLabelId = useId();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const error = validateImageFile(selectedFile);
    if (error) {
      toastCtx.showToast('error', error);
      e.target.value = '';
      return;
    }

    onFileChange(selectedFile);
  };

  return (
    <div className={styles.form}>
      <div className={`${styles.row} ${styles.twoCols}`}>
        <Input
          label="Nazwa"
          value={meal.name}
          maxLength={50}
          onChange={(e) => onChange('name', e.target.value)}
          required
          disabled={disabled}
        />
        <Input
          label="Cena"
          type="number"
          min="0.01"
          step="0.01"
          value={meal.price}
          onChange={(e) => onChange('price', e.target.value)}
          required
          disabled={disabled}
        />
      </div>

      <div className={styles.descriptionBlock}>
        <label htmlFor={descId} className={styles.label}>
          Opis
        </label>
        <textarea
          id={descId}
          rows={6}
          maxLength={500}
          value={meal.description}
          onChange={(e) => onChange('description', e.target.value)}
          className={styles.textarea}
          placeholder="Opis dania widoczny dla klientów..."
          required
          disabled={disabled}
        />
      </div>

      <div className={`${styles.row} ${styles.twoColsEqual}`}>
        <div className={styles.field}>
          <label htmlFor={catId} className={styles.label}>
            Kategoria
          </label>
          <select
            id={catId}
            value={meal.category}
            onChange={(e) => onChange('category', e.target.value)}
            className={styles.select}
            disabled={disabled}
          >
            <option value="">-- wybierz kategorię --</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <span className={styles.label} id={fileLabelId}>
            Zdjęcie
          </span>
          <label className={styles.fileUpload} aria-labelledby={fileLabelId}>
            <FontAwesomeIcon icon={file ? faCheckCircle : faImage} />
            <span>{file ? 'Wybrano zdjęcie' : 'Wybierz zdjęcie'}</span>
            <input
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFileChange}
              hidden
              disabled={disabled}
            />
          </label>
        </div>
      </div>

      {file && <p className={styles.fileName}>{file.name}</p>}
    </div>
  );
};

export default MealForm;
