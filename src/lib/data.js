import jollofRice from '../assets/food/jollof-rice.jpg'
import assortedJollof from '../assets/food/assorted-jollof.jpg'
import assortedFriedRice from '../assets/food/assorted-fried-rice.jpg'
import checkCheckRice from '../assets/food/check-check-rice.jpg'
import waakye from '../assets/food/waakye.jpg'
import riceTilapia from '../assets/food/rice-tilapia.jpg'
import yamFish from '../assets/food/yam-fish.jpg'
import friesChicken from '../assets/food/fries-chicken.jpg'
import chickenWings from '../assets/food/chicken-wings.jpg'
import kelewele from '../assets/food/kelewele.jpg'
import beansPlantain from '../assets/food/beans-plantain.jpg'
import sobolo from '../assets/food/sobolo.jpg'
import friedTilapia from '../assets/food/fried-tilapia.jpg'
import friedChicken from '../assets/food/fried-chicken.jpg'

export const menuItems = [
  {
    id: 1,
    name: 'Signature Jollof Rice',
    category: 'Rice Dishes',
    description: 'Slow-cooked in a rich tomato base infused with scotch bonnet peppers and a secret blend of West African spices. Served with grilled chicken or fish.',
    price: 12.00,
    image: jollofRice,
    tag: "Chef's Pick",
  },
  {
    id: 13,
    name: 'Crispy Fried Tilapia',
    category: 'Fish Dishes',
    description: 'Whole Tilapia seasoned with Mrs. Hilda\'s secret spice blend and fried to a golden crisp. A masterpiece of texture and flavor.',
    price: 18.00,
    image: friedTilapia,
    tag: "Premium",
  },
  {
    id: 14,
    name: 'Spicy Grilled Chicken',
    category: 'Proteins',
    description: 'Flame-grilled drumsticks marinated for 24 hours in a signature Scotch Bonnet and ginger rub. Perfectly charred.',
    price: 14.50,
    image: friedChicken,
    tag: "Popular",
  },
  {
    id: 2,
    name: 'Assorted Jollof Rice',
    category: 'Rice Dishes',
    description: 'Signature jollof elevated — loaded with chicken, beef, and sausage slow-cooked in West African spices.',
    price: 14.00,
    image: assortedJollof,
  },
  {
    id: 3,
    name: 'Assorted Fried Rice',
    category: 'Rice Dishes',
    description: 'Wok-tossed fried rice loaded with vegetables, eggs, West African seasonings and assorted tender meats.',
    price: 13.00,
    image: assortedFriedRice,
  },
  {
    id: 4,
    name: 'Check Check Fried Rice',
    category: 'Rice Dishes',
    description: 'Deliciously seasoned fried rice served with a generous mix of chicken and egg for a satisfying feast.',
    price: 13.00,
    image: checkCheckRice,
  },
  {
    id: 5,
    name: 'Waakye Special',
    category: 'Rice Dishes',
    description: 'Rice & black-eyed beans with tomato stew, spaghetti, boiled eggs, fried plantain and your choice of protein.',
    price: 11.00,
    image: waakye,
  },
  {
    id: 6,
    name: 'Rice & Tilapia',
    category: 'Fish Dishes',
    description: 'Fluffy steamed rice paired with tender freshly grilled tilapia, seasoned with aromatic herbs and spices.',
    price: 13.00,
    image: riceTilapia,
  },
  {
    id: 7,
    name: 'Yam & Fish',
    category: 'Fish Dishes',
    description: 'Golden crispy yam served with flame-grilled tilapia marinated in our Ghanaian signature spice blend.',
    price: 13.00,
    image: yamFish,
  },
  {
    id: 8,
    name: 'Fries & Chicken',
    category: 'Proteins',
    description: 'Golden crispy fries with flame-grilled chicken marinated in ginger, garlic and West African spices.',
    price: 10.00,
    image: friesChicken,
  },
  {
    id: 9,
    name: 'Crispy Chicken Wings',
    category: 'Proteins',
    description: 'Double-fried wings marinated overnight in scotch bonnet, smoked paprika, garlic and thyme. Served with house sauce.',
    price: 9.00,
    image: chickenWings,
  },
  {
    id: 10,
    name: 'Spiced Kelewele',
    category: 'Sides',
    description: 'Crispy fried ripe plantain seasoned with ginger, scotch bonnet and aromatic spices. A street food classic.',
    price: 5.00,
    image: kelewele,
  },
  {
    id: 11,
    name: 'Beans, Plantain & Egg',
    category: 'Sides',
    description: 'Creamy seasoned red beans with sweet fried plantain and a perfectly boiled egg. A Ghanaian comfort classic.',
    price: 8.00,
    image: beansPlantain,
  },
  {
    id: 12,
    name: 'Sobolo (Hibiscus)',
    category: 'Drinks',
    description: 'Chilled organic hibiscus drink — sweet, tangy and deeply refreshing. Made fresh with Naa\'s signature blend.',
    price: 3.00,
    image: sobolo,
  },
]

export const categories = [
  { name: 'All', label: 'All Dishes' },
  { name: 'Rice Dishes', label: 'Rice Dishes' },
  { name: 'Fish Dishes', label: 'Fish Dishes' },
  { name: 'Proteins', label: 'Proteins' },
  { name: 'Sides', label: 'Sides & Extras' },
  { name: 'Drinks', label: 'Drinks' },
]

export const testimonials = [
  {
    id: 1,
    text: 'The Jollof Rice tastes exactly like back home in Ghana. Pure nostalgia in every single bite.',
    author: 'Ama K.',
    location: 'London',
  },
  {
    id: 2,
    text: 'Got a WhatsApp when my order was ready — so convenient. The quality is absolutely unmatched.',
    author: 'Kofi A.',
    location: 'South London',
  },
  {
    id: 3,
    text: 'Finally a place that takes Ghanaian food seriously — premium quality, generous portions every time.',
    author: 'Efua M.',
    location: 'London',
  },
]
