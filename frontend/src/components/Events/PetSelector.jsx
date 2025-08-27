// “join with” none/some/all pets
import React from "react";
import styles from "../../styles/PetSelector.module.css";

const PetSelector = ({
  pets, // list of owned pets
  value: selectedPetIds,
  onChange: setSelectedPetIds,
}) => {
  const togglePet = (petId) => {
    setSelectedPetIds([...selectedPetIds, petId]);
  }; //add pet with id

  const selectNone = () => setSelectedPetIds([]); // clear all selection
  const selectAll = () => setSelectedPetIds(pets.map((pet) => pet._id)); // select all

  return (
    <div className={styles.petContainer}>
      <div className={styles.toolbar}>
        <button type="button" onClick={selectNone}>
          None
        </button>
        <button type="button" onClick={selectAll}>
          All
        </button>
      </div>

      {pets?.length ? (
        <div className={styles.petList}>
          {pets.map((pet) => (
            <label key={pet._id} className={styles.petRow}>
              <input
                type="checkbox"
                checked={selectedPetIds.includes(pet._id)}
                onChange={() => togglePet(pet._id)}
              />
              <span>
                {pet.name}{" "}
                <span className={styles.petNote}>
                  ({pet.breed || "Unknown"})
                </span>
              </span>
            </label>
          ))}
        </div>
      ) : (
        <span>You have no pets yet.</span>
      )}
    </div>
  );
};

export default PetSelector;
