import React, { useState } from "react";
import { IMaskInput } from "react-imask";
import styles from "../styles/ProrabControl.module.scss";

const TTNInput = ({ ttnList, value, setValue }) => {
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const val = e.target.value.toUpperCase();
    setValue(val);

    if (val.length > 0) {
      const filtered = ttnList.filter(ttn => ttn.startsWith(val));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (sugg) => {
    setValue(sugg);
    setSuggestions([]);
  };

  return (
    <div className={styles.ttnInput}>
      <IMaskInput
        mask="TTN-00.00.0000-000"
        placeholder="Введите номер накладной"
        value={value}
        onAccept={setValue}
        onChange={handleChange}
        className={styles.input}
      />
      {suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((s, i) => (
            <li 
              key={i} 
              onClick={() => selectSuggestion(s)}
              className={styles.suggestionItem}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TTNInput;