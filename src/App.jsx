import React, { useState } from "react";
import "./App.css";

export default function App() {
  // Initialize state with some dummy data to make testing easier out of the box
  const [countries, setCountries] = useState([
    {
      id: 1,
      name: "India",
      states: [
        {
          id: 101,
          name: "Karnataka",
          cities: [
            { id: 1001, name: "Bangalore" },
            { id: 1002, name: "Mysore" }
          ]
        }
      ]
    }
  ]);

  // --- COUNTRY CRUD OPERATIONS ---
  const handleAddCountry = () => {
    const name = prompt("Enter Country Name:");
    if (!name || !name.trim()) return;

    const newCountry = {
      id: Date.now(),
      name: name.trim(),
      states: []
    };
    setCountries([...countries, newCountry]);
  };

  const handleEditCountry = (countryId, currentName) => {
    const newName = prompt("Edit Country Name:", currentName);
    if (!newName || !newName.trim() || newName.trim() === currentName) return;

    if (confirm(`Are you sure you want to rename "${currentName}" to "${newName.trim()}"?`)) {
      setCountries(
        countries.map((c) => (c.id === countryId ? { ...c, name: newName.trim() } : c))
      );
    }
  };

  const handleDeleteCountry = (countryId, countryName) => {
    if (confirm(`Are you sure you want to delete "${countryName}"? This will cascadingly delete all its states and cities.`)) {
      setCountries(countries.filter((c) => c.id !== countryId));
    }
  };

  // --- STATE CRUD OPERATIONS ---
  const handleAddState = (countryId) => {
    const name = prompt("Enter State Name:");
    if (!name || !name.trim()) return;

    const newState = {
      id: Date.now(),
      name: name.trim(),
      cities: []
    };

    setCountries(
      countries.map((c) => {
        if (c.id === countryId) {
          return { ...c, states: [...c.states, newState] };
        }
        return c;
      })
    );
  };

  const handleEditState = (countryId, stateId, currentName) => {
    const newName = prompt("Edit State Name:", currentName);
    if (!newName || !newName.trim() || newName.trim() === currentName) return;

    if (confirm(`Are you sure you want to rename "${currentName}" to "${newName.trim()}"?`)) {
      setCountries(
        countries.map((c) => {
          if (c.id === countryId) {
            return {
              ...c,
              states: c.states.map((s) => (s.id === stateId ? { ...s, name: newName.trim() } : s))
            };
          }
          return c;
        })
      );
    }
  };

  const handleDeleteState = (countryId, stateId, stateName) => {
    if (confirm(`Are you sure you want to delete "${stateName}"? This will delete all its cities.`)) {
      setCountries(
        countries.map((c) => {
          if (c.id === countryId) {
            return {
              ...c,
              states: c.states.filter((s) => s.id !== stateId)
            };
          }
          return c;
        })
      );
    }
  };

  // --- CITY CRUD OPERATIONS ---
  const handleAddCity = (countryId, stateId) => {
    const name = prompt("Enter City Name:");
    if (!name || !name.trim()) return;

    const newCity = {
      id: Date.now(),
      name: name.trim()
    };

    setCountries(
      countries.map((c) => {
        if (c.id === countryId) {
          return {
            ...c,
            states: c.states.map((s) => {
              if (s.id === stateId) {
                return { ...s, cities: [...s.cities, newCity] };
              }
              return s;
            })
          };
        }
        return c;
      })
    );
  };

  const handleDeleteCity = (countryId, stateId, cityId, cityName) => {
    if (confirm(`Are you sure you want to delete the city "${cityName}"?`)) {
      setCountries(
        countries.map((c) => {
          if (c.id === countryId) {
            return {
              ...c,
              states: c.states.map((s) => {
                if (s.id === stateId) {
                  return {
                    ...s,
                    cities: s.cities.filter((city) => city.id !== cityId)
                  };
                }
                return s;
              })
            };
          }
          return c;
        })
      );
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Location Management System</h1>
        <p>Manage global organizational locations hierarchically</p>
        <button className="btn btn-primary add-country-btn" onClick={handleAddCountry}>
          Add New Country
        </button>
      </header>

      <main className="dashboard">
        {countries.length === 0 ? (
          <div className="empty-state">
            <p>No countries available. Click the button above to add one!</p>
          </div>
        ) : (
          <CountryList
            countries={countries}
            onEditCountry={handleEditCountry}
            onDeleteCountry={handleDeleteCountry}
            onAddState={handleAddState}
            onEditState={handleEditState}
            onDeleteState={handleDeleteState}
            onAddCity={handleAddCity}
            onDeleteCity={handleDeleteCity}
          />
        )}
      </main>
    </div>
  );
}

// --- SUBCONPONENTS ---

function CountryList({
  countries,
  onEditCountry,
  onDeleteCountry,
  onAddState,
  onEditState,
  onDeleteState,
  onAddCity,
  onDeleteCity
}) {
  return (
    <div className="country-list">
      {countries.map((country) => (
        <div key={country.id} className="card country-card">
          <div className="card-header country-header">
            <h2>{country.name}</h2>
            <div className="action-buttons">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onEditCountry(country.id, country.name)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDeleteCountry(country.id, country.name)}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="section-title-wrapper">
              <h3>States Management</h3>
              <button className="btn btn-success btn-xs" onClick={() => onAddState(country.id)}>
                Add State
              </button>
            </div>
            <StateList
              countryId={country.id}
              states={country.states}
              onEditState={onEditState}
              onDeleteState={onDeleteState}
              onAddCity={onAddCity}
              onDeleteCity={onDeleteCity}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function StateList({
  countryId,
  states,
  onEditState,
  onDeleteState,
  onAddCity,
  onDeleteCity
}) {
  if (states.length === 0) {
    return <p className="text-muted">No states added yet under this country.</p>;
  }

  return (
    <div className="state-list">
      {states.map((state) => (
        <div key={state.id} className="state-item">
          <div className="state-header">
            <h4>{state.name}</h4>
            <div className="action-buttons">
              <button
                className="btn btn-secondary btn-xs"
                onClick={() => onEditState(countryId, state.id, state.name)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-xs"
                onClick={() => onDeleteState(countryId, state.id, state.name)}
              >
                Delete
              </button>
              <button className="btn btn-primary btn-xs" onClick={() => onAddCity(countryId, state.id)}>
                Add City
              </button>
            </div>
          </div>
          <CityList
            countryId={countryId}
            stateId={state.id}
            cities={state.cities}
            onDeleteCity={onDeleteCity}
          />
        </div>
      ))}
    </div>
  );
}

function CityList({ countryId, stateId, cities, onDeleteCity }) {
  if (cities.length === 0) {
    return <p className="text-muted small-text">No cities added yet under this state.</p>;
  }

  return (
    <div className="city-tags-container">
      {cities.map((city) => (
        <span key={city.id} className="city-tag">
          {city.name}
          <button
            className="delete-tag-btn"
            title={`Delete ${city.name}`}
            onClick={() => onDeleteCity(countryId, stateId, city.id, city.name)}
          >
            &times;
          </button>
        </span>
      ))}
    </div>
  );
}
