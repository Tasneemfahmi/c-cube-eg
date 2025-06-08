import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';

// Sample products data matching your actual structure
const sampleProducts = [
  {
    name: "Two-Tone Crochet Bag",
    category: "Crochet > Bags",
    description: "Beautiful handcrafted two-tone crochet bag made with premium cotton yarn. Perfect for everyday use or special occasions.",
    price: "200",
    colors: [
      "Black & White",
      "Black & Beige",
      "Black & Pink",
      "Plum & Lavender",
      "White & Purple",
      "White & Pink",
      "White & Baby Blue",
      "Baby Blue & Blue"
    ],
    images: [
      "https://res.cloudinary.com/do0cup3rt/image/upload/v1748794342/Two_Tone_Crochet_Bag_01_zejxez.jpg",
      "https://res.cloudinary.com/do0cup3rt/image/upload/v1748794462/Two_Tone_Crochet_Bag_02_hmixcx.jpg",
      "https://res.cloudinary.com/do0cup3rt/image/upload/v1748794145/WhatsApp_Image_2025-05-22_at_22.18.27_25ce645e_wmit7s.jpg",
      "https://res.cloudinary.com/do0cup3rt/image/upload/v1748794535/Two_Tone_Crochet_Bag_03_qrppkj.jpg"
    ],
    sizes: "Original",
    inStock: true,
    featured: true
  },
  {
    name: "Multi-Size Crochet Tote",
    category: "Crochet > Bags",
    description: "Versatile crochet tote bag available in multiple sizes. Perfect for shopping, beach trips, or everyday use.",
    colors: [
      "Natural Beige",
      "Ocean Blue",
      "Forest Green",
      "Sunset Orange"
    ],
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    ],
    sizes: ["Small", "Medium", "Large", "Extra Large"],
    price: {
      "small": 200,
      "medium": 250,
      "large": 300,
      "extra large": 350
    },
    inStock: true,
    featured: true
  },
  {
    name: "Pearl Shell Crochet Bag",
    category: "Crochet > Bags",
    description: "Elegant pearl shell crochet bag with beautiful texture and premium finish.",
    colors: [
      "Beige",
      "White"
    ],
    images: [
      "https://res.cloudinary.com/do0cup3rt/image/upload/v1748792336/Pearl_Shell_Crochet_Bag_oyrwcl.jpg"
    ],
    sizes: ["Small", "Large"],
    price: {
      "small": 200,
      "large": 400
    },
    inStock: true,
    featured: true
  },
  {
    name: "Lavender Soy Candle",
    category: "Candles > Scented",
    description: "Relaxing lavender scented soy candle with 40+ hour burn time. Hand-poured with natural ingredients.",
    price: "18.50",
    colors: ["Lavender Purple", "Natural White"],
    images: [
      "https://images.unsplash.com/photo-1602874801006-2bd9c2f3c9a4?w=400",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400"
    ],
    sizes: "Standard",
    inStock: true,
    featured: false
  },
  {
    name: "Ceramic Coffee Mug",
    category: "Clay > Mugs",
    description: "Handthrown ceramic coffee mug with unique glaze pattern. Microwave and dishwasher safe.",
    colors: ["Ocean Blue", "Forest Green", "Sunset Orange"],
    images: [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
    ],
    sizes: ["8oz", "12oz", "16oz"],
    price: {
      "8oz": 180,
      "12oz": 220,
      "16oz": 260
    },
    inStock: true,
    featured: true
  },
  {
    name: "Macrame Wall Hanging",
    category: "Crafts > Wall Art",
    description: "Bohemian style macrame wall hanging made with natural cotton cord. Adds texture to any room.",
    price: "35.00",
    colors: ["Natural Beige", "Cream White"],
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400"
    ],
    sizes: "Medium",
    inStock: true,
    featured: false
  },
  {
    name: "Concrete Plant Pot",
    category: "Concrete > Planters",
    description: "Modern concrete plant pot with drainage hole. Perfect for succulents and small plants.",
    price: "28.75",
    colors: ["Natural Gray", "Charcoal Black", "White"],
    images: [
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"
    ],
    sizes: "Small",
    inStock: true,
    featured: false
  }
];

// Function to check if products already exist
export const checkProductsExist = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.size > 0;
  } catch (error) {
    console.error("Error checking products:", error);
    return false;
  }
};

// Function to add sample products to Firestore
export const addSampleProducts = async () => {
  try {
    console.log('Adding sample products to Firestore...');
    
    // Check if products already exist
    const productsExist = await checkProductsExist();
    if (productsExist) {
      console.log('Products already exist in Firestore');
      return { success: true, message: 'Products already exist' };
    }

    // Add each sample product
    const promises = sampleProducts.map(async (product) => {
      const docRef = await addDoc(collection(db, "products"), {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Added product: ${product.name} with ID: ${docRef.id}`);
      return docRef;
    });

    await Promise.all(promises);
    
    console.log('All sample products added successfully!');
    return { 
      success: true, 
      message: `Successfully added ${sampleProducts.length} products to Firestore!` 
    };
    
  } catch (error) {
    console.error("Error adding sample products:", error);
    return { 
      success: false, 
      message: `Error adding products: ${error.message}` 
    };
  }
};

// Function to get all products (for testing)
export const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return products;
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
};
