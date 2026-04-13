import { db } from './index.js';
import { menuItems } from './schema.js';

async function seed() {
  await db.insert(menuItems).values([
    // Starters
    { name: 'Garlic Bread', description: 'Toasted ciabatta with garlic butter & herbs', price: 3.99, category: 'starters', image: '/menuimgs/ciabatta-garlic-bread-1.jpg'},
    { name: 'Chicken Wings', description: '6 crispy wings - Buffalo or BBQ Sauce', price: 7.99, category: 'starters', image: '/menuimgs/chicken_wings2.jpg'},
    { name: 'Tomato Soup', description: 'Velvety roasted tomato soup with a crispy roll', price: 4.99, category: 'starters', image: '/menuimgs/tomato_soup3.jpg'},
    { name: 'Onion Rings', description: 'Beer-battered golden rings with smoky dipping sauce', price: 4.49, category: 'starters', image: '/menuimgs/onion_rings4.jpg'},

    // Mains
    { name: 'Classic Burger', description: 'Beef patty, smoked cheese, lettuce, tomato and brioche bun', price: 11.99, category: 'mains', image: '/menuimgs/burger_5.jpg'},
    { name: 'Chicken Fillet Wrap', description: 'Chicken chicke, crunchy slaw and siriracha mayo', price: 10.49, category: 'mains', image: '/menuimgs/chicken_wrap6.jpg'},
    { name: 'Margherita Pizza', description: '12" stone-baked, San Marzano tomato, fresh mozzarella', price: 12.99, category: 'mains', image: '/menuimgs/margherita_pizza7.webp'},
    { name: 'BBQ Pulled Pork Sandwhich', description: 'Slow-cooked 12hr pork, homemade slaw, brioche bun', price: 13.49, category: 'mains', image: '/menuimgs/pulled_pork_sandwhch8.jpg'},
    { name: 'Veggie Curry', description: 'Spiced chickpea & spinach curry with basmati rice', price: 10.99, category: 'mains', image: '/menuimgs/veggie_curry9.jpg'},
    { name: 'Fish & Chips', description: 'Beer-battered cod, chunky chips & mushy peas', price: 13.99, category: 'mains', image: '/menuimgs/fish_and_chips10.avif'},

    // Sides
    { name: 'Chunky Chips', description: 'Hand-cut chips with sea salt & rosemary', price: 3.49, category: 'sides', image: '/menuimgs/chunky_chips11.jpg'},
    { name: 'Side Salad', description: 'Mixed leaves, cherry tomatoes & house dressing', price: 3.99, category: 'sides', image: '/menuimgs/side_salad12.jpg'},
    { name: 'Coleslaw', description: 'Creamy homemade coleslaw with a hint of mustard', price: 2.49, category: 'sides', image: '/menuimgs/coleslaw13.jpg'},
    { name: 'Sweet Potato Fries', description: 'Crispy sweet potato fries with smoked paprika', price: 3.99, category: 'sides', image: '/menuimgs/sweet_potatoe_fries14.jpg'},

    // Drinks
    { name: 'Soft Drink', description: 'Coke, Diet Coke, 7UP or Fanta', price: 1.99, category: 'drinks', image: '/menuimgs/soft_drinks15.webp'},
    { name: 'Still Water', description: '500ml chilled bottled water', price: 1.49, category: 'drinks', image: '/menuimgs/water_16.jpg'},
    { name: 'Milkshake', description: 'Thick & creamy — Chocolate, Vanilla or Strawberry', price: 4.49, category: 'drinks', image: '/menuimgs/milkshake17.jpg'},
    { name: 'Fresh Orange Juice', description: 'Freshly squeezed OJ, 300ml', price: 3.49, category: 'drinks', image: '/menuimgs/orangejuice18.jpg'},

    // Desserts
    { name: 'Chocolate Brownie', description: 'Warm fudge brownie with vanilla bean ice cream', price: 5.99, category: 'desserts', image: '/menuimgs/brownie19.webp'},
    { name: 'Cheesecake', description: 'NY Style baked cheesecake with summer berry coulis', price: 5.49, category: 'desserts', image: '/menuimgs/cheesecake20.jpg' },
    { name: 'Ice Cream', description: '2 generous scoops with your choice of flavour', price: 3.99, category: 'desserts', image: '/menuimgs/icecream21.jpg'}
  ]);

  console.log('Menu seeded successfully!');
}

seed();