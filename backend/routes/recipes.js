const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { authenticate } = require('../middleware/auth');

const recipesPath = path.join(__dirname, '../data/recipes.json');

function readRecipes() {
  return JSON.parse(fs.readFileSync(recipesPath, 'utf-8'));
}
function writeRecipes(recipes) {
  fs.writeFileSync(recipesPath, JSON.stringify(recipes, null, 2));
}

// GET all recipes (supports ?category=&time=&search=)
router.get('/', (req, res) => {
  let recipes = readRecipes();
  const { category, time, search } = req.query;

  if (category && category !== 'All') {
    recipes = recipes.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }
  if (time) {
    const maxTime = parseInt(time, 10);
    if (!isNaN(maxTime)) {
      recipes = recipes.filter(r => r.time <= maxTime);
    }
  }
  if (search) {
    const s = search.toLowerCase();
    recipes = recipes.filter(r =>
      r.title.toLowerCase().includes(s) ||
      r.ingredients.join(',').toLowerCase().includes(s)
    );
  }

  res.json(recipes);
});

// GET single recipe by id
router.get('/:id', (req, res) => {
  const recipes = readRecipes();
  const recipe = recipes.find(r => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  res.json(recipe);
});

// POST new recipe (requires login)
router.post('/', authenticate, (req, res) => {
  const { title, ingredients, instructions, category, time, image, description, difficulty } = req.body;

  if (!title || !ingredients || !instructions || !category || !time) {
    return res.status(400).json({ message: 'title, ingredients, instructions, category and time are required' });
  }

  const recipes = readRecipes();
  const newRecipe = {
    id: Date.now().toString(),
    title,
    image: image && image.trim() !== '' ? image : 'https://placehold.co/500x320?text=Recipe',
    description: description || '',
    rating: 0,
    category,
    difficulty: difficulty || 'Easy',
    time: parseInt(time, 10),
    ingredients: Array.isArray(ingredients) ? ingredients : String(ingredients).split('\n').map(s => s.trim()).filter(Boolean),
    instructions: Array.isArray(instructions) ? instructions : String(instructions).split('\n').map(s => s.trim()).filter(Boolean),
    author: req.user.username
  };

  recipes.push(newRecipe);
  writeRecipes(recipes);
  res.status(201).json(newRecipe);
});

// DELETE recipe (requires login)
router.delete('/:id', authenticate, (req, res) => {
  let recipes = readRecipes();
  const exists = recipes.find(r => r.id === req.params.id);
  if (!exists) return res.status(404).json({ message: 'Recipe not found' });

  recipes = recipes.filter(r => r.id !== req.params.id);
  writeRecipes(recipes);
  res.json({ message: 'Recipe deleted' });
});

module.exports = router;
