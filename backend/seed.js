import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Restaurant from './models/Restaurant.js';
import Food from './models/Food.js';
import Order from './models/Order.js';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Food.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('Admin@123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@foodorder.com',
      password: adminPassword,
      phone: '+1234567890',
      role: 'admin',
      addresses: ['123 Admin Street, Admin City, AC 12345']
    });
    console.log('Created admin user');

    // Create restaurant owner
    const ownerPassword = await bcrypt.hash('Owner@123', 12);
    const restaurantOwner = await User.create({
      name: 'Restaurant Owner',
      email: 'owner@restaurant.com',
      password: ownerPassword,
      phone: '+1234567891',
      role: 'restaurant',
      addresses: ['456 Owner Avenue, Owner City, OC 67890']
    });
    console.log('Created restaurant owner');

    // Create customer
    const customerPassword = await bcrypt.hash('Customer@123', 12);
    const customer = await User.create({
      name: 'John Customer',
      email: 'customer@example.com',
      password: customerPassword,
      phone: '+1234567892',
      role: 'customer',
      addresses: ['789 Customer Lane, Customer City, CC 54321']
    });
    console.log('Created customer user');

    // Create restaurants
    const restaurants = [
      {
        name: 'Pizza Palace',
        owner: restaurantOwner._id,
        address: {
          street: '123 Pizza Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          coordinates: { latitude: 40.7128, longitude: -74.0060 }
        },
        cuisine: 'Italian',
        description: 'Authentic Italian pizza made with fresh ingredients',
        openingHours: {
          monday: { open: '10:00', close: '22:00', isOpen: true },
          tuesday: { open: '10:00', close: '22:00', isOpen: true },
          wednesday: { open: '10:00', close: '22:00', isOpen: true },
          thursday: { open: '10:00', close: '22:00', isOpen: true },
          friday: { open: '10:00', close: '23:00', isOpen: true },
          saturday: { open: '10:00', close: '23:00', isOpen: true },
          sunday: { open: '12:00', close: '21:00', isOpen: true }
        },
        avgRating: 4.5,
        totalReviews: 150,
        deliveryFee: 2.99,
        minimumOrder: 15.00,
        imageUrl: 'https://unsplash.com/photos/pizza-by-the-slice-neon-signage-jniSTizOp40'
      },
      {
        name: 'Burger Bistro',
        owner: restaurantOwner._id,
        address: {
          street: '456 Burger Boulevard',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
          coordinates: { latitude: 40.7589, longitude: -73.9851 }
        },
        cuisine: 'American',
        description: 'Gourmet burgers with premium ingredients',
        openingHours: {
          monday: { open: '11:00', close: '23:00', isOpen: true },
          tuesday: { open: '11:00', close: '23:00', isOpen: true },
          wednesday: { open: '11:00', close: '23:00', isOpen: true },
          thursday: { open: '11:00', close: '23:00', isOpen: true },
          friday: { open: '11:00', close: '24:00', isOpen: true },
          saturday: { open: '11:00', close: '24:00', isOpen: true },
          sunday: { open: '12:00', close: '22:00', isOpen: true }
        },
        avgRating: 4.2,
        totalReviews: 89,
        deliveryFee: 3.50,
        minimumOrder: 20.00,
        imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500'
      },
      {
        name: 'Sushi Zen',
        owner: restaurantOwner._id,
        address: {
          street: '789 Sushi Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10003',
          coordinates: { latitude: 40.7505, longitude: -73.9934 }
        },
        cuisine: 'Japanese',
        description: 'Fresh sushi and traditional Japanese cuisine',
        openingHours: {
          monday: { open: '17:00', close: '22:00', isOpen: true },
          tuesday: { open: '17:00', close: '22:00', isOpen: true },
          wednesday: { open: '17:00', close: '22:00', isOpen: true },
          thursday: { open: '17:00', close: '22:00', isOpen: true },
          friday: { open: '17:00', close: '23:00', isOpen: true },
          saturday: { open: '17:00', close: '23:00', isOpen: true },
          sunday: { open: '17:00', close: '21:00', isOpen: true }
        },
        avgRating: 4.8,
        totalReviews: 67,
        deliveryFee: 4.99,
        minimumOrder: 25.00,
        imageUrl: 'https://plus.unsplash.com/premium_photo-1664648184162-2a446ac405e2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U3VzaGklMjBaZW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500'
      },
      {
        name: 'Taco Fiesta',
        owner: restaurantOwner._id,
        address: {
          street: '321 Taco Lane',
          city: 'New York',
          state: 'NY',
          zipCode: '10004',
          coordinates: { latitude: 40.7614, longitude: -73.9776 }
        },
        cuisine: 'Mexican',
        description: 'Authentic Mexican tacos and burritos',
        openingHours: {
          monday: { open: '11:00', close: '22:00', isOpen: true },
          tuesday: { open: '11:00', close: '22:00', isOpen: true },
          wednesday: { open: '11:00', close: '22:00', isOpen: true },
          thursday: { open: '11:00', close: '22:00', isOpen: true },
          friday: { open: '11:00', close: '23:00', isOpen: true },
          saturday: { open: '11:00', close: '23:00', isOpen: true },
          sunday: { open: '12:00', close: '21:00', isOpen: true }
        },
        avgRating: 4.3,
        totalReviews: 45,
        deliveryFee: 2.50,
        minimumOrder: 12.00,
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500'
      }
    ];

    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log('Created restaurants');

    // Ensure the restaurant owner user object has references to these restaurants
    // (some owner APIs expect owner.restaurants or similar associations)
    try {
      restaurantOwner.restaurants = createdRestaurants.map(r => r._id);
      await restaurantOwner.save();
      console.log('Attached restaurants to restaurant owner user');
    } catch (err) {
      console.warn('Could not attach restaurants to owner:', err.message);
    }

    // Create food items for Pizza Palace
    const pizzaPalace = createdRestaurants[0];
    const pizzaFoods = [
      {
        name: 'Margherita Pizza',
        description: 'Classic tomato sauce, mozzarella, and fresh basil',
        price: 14.99,
        category: 'Pizza',
        restaurant: pizzaPalace._id,
        imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300',
        preparationTime: 15,
        ingredients: ['Tomato sauce', 'Mozzarella', 'Fresh basil', 'Olive oil'],
        isVegetarian: true,
        rating: 4.5,
        totalReviews: 45
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Spicy pepperoni with mozzarella and tomato sauce',
        price: 16.99,
        category: 'Pizza',
        restaurant: pizzaPalace._id,
        imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300',
        preparationTime: 15,
        ingredients: ['Tomato sauce', 'Mozzarella', 'Pepperoni'],
        rating: 4.3,
        totalReviews: 38
      },
      {
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with caesar dressing and croutons',
        price: 8.99,
        category: 'Salad',
        restaurant: pizzaPalace._id,
        imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300',
        preparationTime: 10,
        ingredients: ['Romaine lettuce', 'Caesar dressing', 'Croutons', 'Parmesan'],
        isVegetarian: true,
        rating: 4.2,
        totalReviews: 22
      },
      {
        name: 'Quattro Stagioni Pizza',
        description: 'Four seasons pizza with artichokes, mushrooms, ham, and olives',
        price: 18.99,
        category: 'Pizza',
        restaurant: pizzaPalace._id,
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300',
        preparationTime: 18,
        ingredients: ['Tomato sauce', 'Mozzarella', 'Artichokes', 'Mushrooms', 'Ham', 'Olives'],
        rating: 4.4,
        totalReviews: 31
      },
      {
        name: 'Garlic Bread',
        description: 'Crispy bread with garlic butter and herbs',
        price: 6.99,
        category: 'Appetizer',
        restaurant: pizzaPalace._id,
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
        preparationTime: 8,
        ingredients: ['Bread', 'Garlic butter', 'Herbs', 'Parmesan'],
        isVegetarian: true,
        rating: 4.1,
        totalReviews: 28
      }
    ];

    // Create food items for Burger Bistro
    const burgerBistro = createdRestaurants[1];
    const burgerFoods = [
      {
        name: 'Classic Cheeseburger',
        description: 'Beef patty with cheese, lettuce, tomato, and special sauce',
        price: 12.99,
        category: 'Burger',
        restaurant: burgerBistro._id,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
        preparationTime: 12,
        ingredients: ['Beef patty', 'Cheese', 'Lettuce', 'Tomato', 'Onion', 'Special sauce'],
        rating: 4.4,
        totalReviews: 67
      },
      {
        name: 'BBQ Bacon Burger',
        description: 'Beef patty with BBQ sauce, crispy bacon, and onion rings',
        price: 15.99,
        category: 'Burger',
        restaurant: burgerBistro._id,
        imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300',
        preparationTime: 15,
        ingredients: ['Beef patty', 'BBQ sauce', 'Bacon', 'Onion rings', 'Cheese'],
        rating: 4.6,
        totalReviews: 43
      },
      {
        name: 'Veggie Burger',
        description: 'Plant-based patty with fresh vegetables and vegan mayo',
        price: 11.99,
        category: 'Burger',
        restaurant: burgerBistro._id,
        imageUrl: 'https://plus.unsplash.com/premium_photo-1664648063548-50808d58f061?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmVnZ2llJTIwYnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500',
        preparationTime: 10,
        ingredients: ['Plant-based patty', 'Lettuce', 'Tomato', 'Onion', 'Vegan mayo'],
        isVegetarian: true,
        isVegan: true,
        rating: 4.1,
        totalReviews: 28
      },
      {
        name: 'French Fries',
        description: 'Crispy golden fries with sea salt',
        price: 4.99,
        category: 'Side',
        restaurant: burgerBistro._id,
        imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300',
        preparationTime: 8,
        ingredients: ['Potatoes', 'Sea salt', 'Vegetable oil'],
        isVegetarian: true,
        isVegan: true,
        rating: 4.0,
        totalReviews: 35
      },
      {
        name: 'Chicken Wings',
        description: 'Spicy buffalo wings with ranch dipping sauce',
        price: 9.99,
        category: 'Appetizer',
        restaurant: burgerBistro._id,
        imageUrl: 'https://plus.unsplash.com/premium_photo-1669742928112-19364a33b530?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMHdpbmdzfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500',
        preparationTime: 12,
        ingredients: ['Chicken wings', 'Buffalo sauce', 'Ranch dressing'],
        rating: 4.3,
        totalReviews: 42
      },
      {
        name: 'Onion Rings',
        description: 'Crispy beer-battered onion rings',
        price: 5.99,
        category: 'Side',
        restaurant: burgerBistro._id,
        imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=300',
        preparationTime: 10,
        ingredients: ['Onions', 'Beer batter', 'Vegetable oil'],
        isVegetarian: true,
        rating: 4.2,
        totalReviews: 26
      }
    ];

    // Create food items for Sushi Zen
    const sushiZen = createdRestaurants[2];
    const sushiFoods = [
      {
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber roll with sesame seeds',
        price: 8.99,
        category: 'Sushi',
        restaurant: sushiZen._id,
        imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300',
        preparationTime: 8,
        ingredients: ['Crab', 'Avocado', 'Cucumber', 'Sesame seeds', 'Rice'],
        rating: 4.7,
        totalReviews: 52
      },
      {
        name: 'Salmon Nigiri',
        description: 'Fresh salmon over seasoned rice',
        price: 6.99,
        category: 'Sushi',
        restaurant: sushiZen._id,
        imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=300',
        preparationTime: 5,
        ingredients: ['Fresh salmon', 'Seasoned rice', 'Wasabi'],
        rating: 4.8,
        totalReviews: 34
      },
      {
        name: 'Vegetable Tempura',
        description: 'Assorted vegetables in light tempura batter',
        price: 9.99,
        category: 'Appetizer',
        restaurant: sushiZen._id,
        imageUrl: 'https://plus.unsplash.com/premium_photo-1667807522245-ae3de2a7813a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmVnZXRhYmxlJTIwdGVtcHVyYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500',
        preparationTime: 12,
        ingredients: ['Mixed vegetables', 'Tempura batter', 'Dipping sauce'],
        isVegetarian: true,
        rating: 4.3,
        totalReviews: 19
      },
      {
        name: 'Miso Soup',
        description: 'Traditional Japanese soup with tofu and seaweed',
        price: 3.99,
        category: 'Soup',
        restaurant: sushiZen._id,
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300',
        preparationTime: 5,
        ingredients: ['Miso paste', 'Tofu', 'Seaweed', 'Green onions'],
        isVegetarian: true,
        rating: 4.2,
        totalReviews: 25
      },
      {
        name: 'Dragon Roll',
        description: 'Eel and cucumber roll topped with avocado and eel sauce',
        price: 12.99,
        category: 'Sushi',
        restaurant: sushiZen._id,
        imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=300',
        preparationTime: 10,
        ingredients: ['Eel', 'Cucumber', 'Avocado', 'Eel sauce', 'Rice'],
        rating: 4.6,
        totalReviews: 38
      },
      {
        name: 'Spicy Tuna Roll',
        description: 'Fresh tuna with spicy mayo and cucumber',
        price: 10.99,
        category: 'Sushi',
        restaurant: sushiZen._id,
        imageUrl: 'https://plus.unsplash.com/premium_photo-1712949140529-203336f93d17?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BpY3klMjB0dW5hJTIwcm9sbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500',
        preparationTime: 8,
        ingredients: ['Fresh tuna', 'Spicy mayo', 'Cucumber', 'Rice'],
        rating: 4.4,
        totalReviews: 29
      }
    ];

    // Create food items for Taco Fiesta
    const tacoFiesta = createdRestaurants[3];
    const tacoFoods = [
      {
        name: 'Beef Tacos',
        description: 'Three soft tacos with seasoned beef, lettuce, and cheese',
        price: 9.99,
        category: 'Tacos',
        restaurant: tacoFiesta._id,
        imageUrl: 'https://images.unsplash.com/photo-1687881063470-a78e6ea2590e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmVlZiUyMFRhY29zfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500',
        preparationTime: 10,
        ingredients: ['Soft tortillas', 'Seasoned beef', 'Lettuce', 'Cheese', 'Salsa'],
        rating: 4.4,
        totalReviews: 41
      },
      {
        name: 'Chicken Burrito',
        description: 'Large burrito with grilled chicken, rice, beans, and cheese',
        price: 11.99,
        category: 'Burrito',
        restaurant: tacoFiesta._id,
        imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300',
        preparationTime: 12,
        ingredients: ['Large tortilla', 'Grilled chicken', 'Rice', 'Beans', 'Cheese', 'Salsa'],
        rating: 4.5,
        totalReviews: 38
      },
      {
        name: 'Churros',
        description: 'Sweet fried dough sticks with cinnamon sugar',
        price: 5.99,
        category: 'Dessert',
        restaurant: tacoFiesta._id,
        imageUrl: 'https://images.unsplash.com/photo-1624371414348-b246eff23427?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2h1cnJvc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500',
        preparationTime: 8,
        ingredients: ['Dough', 'Cinnamon', 'Sugar', 'Oil'],
        isVegetarian: true,
        rating: 4.6,
        totalReviews: 29
      },
      {
        name: 'Fish Tacos',
        description: 'Grilled fish with cabbage slaw and chipotle mayo',
        price: 10.99,
        category: 'Tacos',
        restaurant: tacoFiesta._id,
        imageUrl: 'https://images.unsplash.com/photo-1604467715878-83e57e8bc129?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RmlzaCUyMFRhY29zfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500',
        preparationTime: 12,
        ingredients: ['Grilled fish', 'Cabbage slaw', 'Chipotle mayo', 'Soft tortillas'],
        rating: 4.5,
        totalReviews: 33
      },
      {
        name: 'Quesadilla',
        description: 'Grilled tortilla with cheese, chicken, and vegetables',
        price: 8.99,
        category: 'Mexican',
        restaurant: tacoFiesta._id,
        imageUrl: 'https://images.unsplash.com/photo-1593504049359-74330189a345?w=300',
        preparationTime: 10,
        ingredients: ['Tortilla', 'Cheese', 'Chicken', 'Bell peppers', 'Onions'],
        rating: 4.3,
        totalReviews: 24
      },
      {
        name: 'Nachos Supreme',
        description: 'Crispy tortilla chips with cheese, jalapeños, and sour cream',
        price: 7.99,
        category: 'Appetizer',
        restaurant: tacoFiesta._id,
        imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=300',
        preparationTime: 8,
        ingredients: ['Tortilla chips', 'Cheese', 'Jalapeños', 'Sour cream', 'Salsa'],
        isVegetarian: true,
        rating: 4.1,
        totalReviews: 31
      }
    ];

    const allFoods = await Food.insertMany([...pizzaFoods, ...burgerFoods, ...sushiFoods, ...tacoFoods]);
    console.log('Created food items');

    // Create sample orders
    
    const sampleOrders = [
      {
        user: customer._id,
        restaurant: pizzaPalace._id,
        items: [
          {
            food: allFoods.find(f => f.name === 'Margherita Pizza')._id,
            name: 'Margherita Pizza',
            price: 12.99,
            quantity: 1,
            specialInstructions: 'Extra cheese please'
          },
          {
            food: allFoods.find(f => f.name === 'Caesar Salad')._id,
            name: 'Caesar Salad',
            price: 8.99,
            quantity: 1,
            specialInstructions: 'Dressing on the side'
          }
        ],
        subtotal: 21.98,
        deliveryFee: 2.99,
        tax: 2.20,
        total: 27.17,
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        deliveryAddress: {
          street: '123 Customer Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          phone: '+1234567890'
        },
        notes: 'Sample completed order',
        actualDeliveryTime: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        user: customer._id,
        restaurant: burgerBistro._id,
        items: [
          {
            food: allFoods.find(f => f.name === 'Classic Cheeseburger')._id,
            name: 'Classic Cheeseburger',
            price: 9.99,
            quantity: 2,
            specialInstructions: 'No onions'
          }
        ],
        subtotal: 19.98,
        deliveryFee: 3.50,
        tax: 2.00,
        total: 25.48,
        status: 'preparing',
        paymentStatus: 'paid',
        paymentMethod: 'upi',
        deliveryAddress: {
          street: '123 Customer Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          phone: '+1234567890'
        },
        notes: 'Current order in progress',
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
      }
    ];

    await Order.insertMany(sampleOrders);
    console.log('Created sample orders');

    console.log('\n=== SEED DATA SUMMARY ===');
    console.log('Admin User:');
    console.log('  Email: admin@foodorder.com');
    console.log('  Password: Admin@123');
    console.log('\nRestaurant Owner:');
    console.log('  Email: owner@restaurant.com');
    console.log('  Password: Owner@123');
    console.log('\nCustomer:');
    console.log('  Email: customer@example.com');
    console.log('  Password: Customer@123');
    console.log('\nRestaurants created:', createdRestaurants.length);
    const totalFoodItems = pizzaFoods.length + burgerFoods.length + sushiFoods.length + tacoFoods.length;
    console.log('Food items created:', totalFoodItems);
    console.log('Sample orders created:', sampleOrders.length);
    console.log('\nDatabase seeded successfully!');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeding
connectDB().then(() => {
  seedData();
});