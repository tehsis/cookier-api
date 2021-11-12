(function() {
    const addIngredient = document.querySelector('[name=add-ingredient]');

    addIngredient.addEventListener('click', function() {
        const newIngredientEl = AddIngredientTemplate();
        const ingredientsEl = document.querySelector('.ingredients');
        ingredientsEl.appendChild(newIngredientEl);
    });

    function AddIngredientTemplate() {
        const ingredientsNumber = document.querySelectorAll('.new-ingredient').length;
        const ingredientsSelect = document.querySelector('[name="ingredient[0].id"]');

        const newIngredientsSelect = ingredientsSelect.cloneNode(true);
        newIngredientsSelect.name = `ingredient[${ingredientsNumber}].id`;

        const container = document.createElement('div');
        container.className = "new-ingredient"

        const html = `
            <div class="form-group">
            <label for="ingredient[${ingredientsNumber}].quantity">Quantity</label>
            <input type="text" name="ingredient[${ingredientsNumber}].quantity">
            <label for="ingredient[${ingredientsNumber}].unit">Unit</label>
            <input type="text" name="ingredient[${ingredientsNumber}].unit">
            </div>
        `

        const doc = new DOMParser().parseFromString(html, 'text/html');
        const newEl = doc.body.firstChild;
        
        container.appendChild(newIngredientsSelect);
        container.appendChild(newEl);

        return container;
    }
})();