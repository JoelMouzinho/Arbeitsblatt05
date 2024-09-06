document.addEventListener('DOMContentLoaded', () => {
  const initModel = {
      totalCalories: 0,
      items: [] 
  };

  // Elementreferenzen
  const foodNameInput = document.getElementById('food-name');
  const calorieInput = document.getElementById('calorie-input');
  const calorieForm = document.getElementById('calorie-form');
  const calorieList = document.getElementById('calorie-list');
  const totalCaloriesElement = document.getElementById('total-calories');

  // Update-Funktion
  function update(msg, model) {
      switch (msg.type) {
          case 'ADD_ITEM':
              const newItem = { name: model.inputName, calories: parseInt(model.inputCalories || '0') };
              return {
                  ...model,
                  totalCalories: model.totalCalories + newItem.calories,
                  items: [...model.items, newItem],
                  inputName: '',
                  inputCalories: ''
              };
          case 'UPDATE_INPUT_NAME':
              return { ...model, inputName: msg.value };
          case 'UPDATE_INPUT_CALORIES':
              return { ...model, inputCalories: msg.value };
          case 'DELETE_ITEM':
              const updatedItems = model.items.filter((_, index) => index !== msg.index);
              return {
                  ...model,
                  items: updatedItems,
                  totalCalories: updatedItems.reduce((sum, item) => sum + item.calories, 0)
              };
          case 'EDIT_ITEM':
              const editedItems = model.items.map((item, index) =>
                  index === msg.index ? { ...item, name: msg.name, calories: msg.calories } : item
              );
              return {
                  ...model,
                  items: editedItems,
                  totalCalories: editedItems.reduce((sum, item) => sum + item.calories, 0)
              };
          default:
              return model;
      }
  }

  // View-Funktion
  function view(model) {
      totalCaloriesElement.textContent = `Gesamtkalorien: ${model.totalCalories}`;
      
      calorieList.innerHTML = model.items.map((item, index) =>
          `<li class="flex justify-between items-center border-b border-gray-300 p-2">
              <span>${item.name}: ${item.calories} kcal</span>
              <div class="flex gap-2">
                  <button class="edit-button bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded" data-index="${index}">Bearbeiten</button>
                  <button class="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" data-index="${index}">Löschen</button>
              </div>
          </li>`
      ).join('');
  }

  // Dispatch-Funktion
  function dispatch(msg) {
      model = update(msg, model);
      view(model);
  }

  // Event-Handler
  calorieForm.addEventListener('submit', (e) => {
      e.preventDefault();
      dispatch({ type: 'ADD_ITEM' });
  });

  foodNameInput.addEventListener('input', (e) => {
      dispatch({ type: 'UPDATE_INPUT_NAME', value: e.target.value });
  });

  calorieInput.addEventListener('input', (e) => {
      dispatch({ type: 'UPDATE_INPUT_CALORIES', value: e.target.value });
  });

  calorieList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-button')) {
          const index = e.target.getAttribute('data-index');
          dispatch({ type: 'DELETE_ITEM', index: parseInt(index, 10) });
      } else if (e.target.classList.contains('edit-button')) {
          const index = e.target.getAttribute('data-index');
          const item = model.items[index];
          const newName = prompt('Neuer Name:', item.name) || item.name;
          const newCalories = prompt('Neue Kalorien:', item.calories) || item.calories;
          dispatch({
              type: 'EDIT_ITEM',
              index: parseInt(index, 10),
              name: newName,
              calories: parseInt(newCalories, 10)
          });
      }
  });

  // Initialisieren der Ansicht
  let model = initModel;
  view(model);
});
