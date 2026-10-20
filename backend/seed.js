require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("./db");

const DEMO_EMAIL = "demo@mealy.app";
const DEMO_PASSWORD = "password123";

const RECIPES = [
    {
        title: "Spaghetti Carbonara",
        description: "Classic Italian pasta with eggs and pancetta.",
        category: "Dinner",
        ingredients: "200g spaghetti\n2 eggs\n100g pancetta\n50g parmesan\nBlack pepper",
        instructions:
            "Boil the pasta. Fry the pancetta until crisp. Mix eggs and parmesan. Toss everything together off the heat and add pepper.",
    },
    {
        title: "Blueberry Pancakes",
        description: "Fluffy pancakes for a slow weekend morning.",
        category: "Breakfast",
        ingredients: "2 dl flour\n2 dl milk\n1 egg\n1 tbsp sugar\nBlueberries\nButter",
        instructions:
            "Whisk flour, milk, egg and sugar into a batter. Fry small pancakes in butter and top with blueberries.",
    },
    {
        title: "Chickpea Curry",
        description: "A quick vegetarian curry.",
        category: "Lunch",
        ingredients:
            "1 can chickpeas\n1 can coconut milk\n1 onion\n2 tbsp curry paste\nRice",
        instructions:
            "Fry the onion and curry paste. Add chickpeas and coconut milk and simmer for 15 minutes. Serve with rice.",
    },
    {
        title: "Chocolate Mug Cake",
        description: "Dessert in two minutes.",
        category: "Dessert",
        ingredients: "4 tbsp flour\n2 tbsp cocoa\n3 tbsp sugar\n3 tbsp milk\n1 tbsp oil",
        instructions: "Mix everything in a mug and microwave for about 90 seconds.",
    },
];

async function seed() {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
        DEMO_EMAIL,
    ]);
    if (existing.rows.length > 0) {
        console.log("Demo data already exists. Nothing to do.");
        return;
    }

    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
    const user = await pool.query(
        "INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id",
        [DEMO_EMAIL, "demo", passwordHash]
    );
    const userId = user.rows[0].id;

    for (const r of RECIPES) {
        await pool.query(
            `INSERT INTO recipes (user_id, title, description, ingredients, instructions, category)
       VALUES ($1, $2, $3, $4, $5, $6)`,
            [userId, r.title, r.description, r.ingredients, r.instructions, r.category]
        );
    }

    console.log(`Created demo user (${DEMO_EMAIL} / ${DEMO_PASSWORD}) and ${RECIPES.length} recipes.`);
}

seed()
    .catch((err) => console.error("Seeding failed:", err.message))
    .finally(() => pool.end());