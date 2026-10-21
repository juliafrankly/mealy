require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("./db");

const DEMO_EMAIL = "demo@mealy.app";
const DEMO_PASSWORD = "password123";
const DEMO_USERNAME = "Mealy Team";

const RECIPES = [
    // Breakfast
    {
        title: "Blueberry Pancakes",
        description: "Fluffy pancakes for a slow weekend morning.",
        category: "Breakfast",
        image_url: "https://www.allrecipes.com/thmb/ecb0XKvcrE7OyxBLX3OVEd30TbE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/686460-todds-famous-blueberry-pancakes-Dianne-1x1-1-9bd040b975634bce884847ce2090de16.jpg",
        ingredients: "2 dl flour\n2 dl milk\n1 egg\n1 tbsp sugar\nBlueberries\nButter",
        instructions:
            "Whisk flour, milk, egg and sugar into a batter. Fry small pancakes in butter and top with blueberries.",
    },
    {
        title: "Overnight Oats",
        description: "Prepare it in the evening, eat it in the morning.",
        category: "Breakfast",
        image_url: "https://images.arla.com/recordid/A7293C5F-AD4A-407C-B955CAB92253567A/overnight-oats.jpg",
        ingredients: "1 dl rolled oats\n1.5 dl milk\n1 tbsp chia seeds\n1 tsp honey\nBerries",
        instructions:
            "Stir oats, milk, chia seeds and honey in a jar. Cover and leave in the fridge overnight. Top with berries before eating.",
    },
    {
        title: "Shakshuka",
        description: "Eggs poached in a spicy tomato sauce.",
        category: "Breakfast",
        image_url: "https://www.eatingbirdfood.com/wp-content/uploads/2024/08/shakshuka-hero-new.jpg",
        ingredients:
            "1 onion\n1 red pepper\n2 garlic cloves\n1 can chopped tomatoes\n1 tsp cumin\n1 tsp paprika\n4 eggs",
        instructions:
            "Fry onion, pepper and garlic. Add tomatoes and spices and simmer for 10 minutes. Make four wells, crack in the eggs and cook with a lid on until set.",
    },
    {
        title: "Avocado Toast with Egg",
        description: "A quick breakfast with creamy avocado.",
        category: "Breakfast",
        image_url: "https://gratefulgrazer.com/wp-content/uploads/2025/01/avocado-toast-square.jpg",
        ingredients:
            "2 slices sourdough bread\n1 ripe avocado\n2 eggs\n1 tsp lemon juice\nChili flakes\nSalt",
        instructions:
            "Toast the bread. Mash the avocado with lemon juice and salt and spread it on the toast. Top with fried or poached eggs and chili flakes.",
    },
    {
        title: "French Toast",
        description: "Golden slices with cinnamon and maple syrup.",
        category: "Breakfast",
        image_url: "https://www.seriouseats.com/thmb/_nSWyhg_GmvdjUwMMvX7KG6lYNQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/perfect-quick-easy-french-toast-hero-03-2a9485bbb12b4cf5abcfef53aa9accd9.jpg",
        ingredients:
            "4 slices thick bread\n2 eggs\n1.5 dl milk\n1 tsp cinnamon\nButter\nMaple syrup",
        instructions:
            "Whisk eggs, milk and cinnamon. Soak the bread slices briefly on both sides. Fry in butter until golden and serve with maple syrup.",
    },

    // Lunch
    {
        title: "Greek Salad",
        description: "Crisp and fresh, ready in ten minutes.",
        category: "Lunch",
        image_url: "https://www.cookingclassy.com/wp-content/uploads/2018/02/greek-salad-4.jpg",
        ingredients:
            "4 tomatoes\n1 cucumber\n1 red onion\n150g feta\nOlives\n3 tbsp olive oil\nOregano",
        instructions:
            "Chop the vegetables into chunks and place in a bowl. Top with feta and olives, drizzle with olive oil and sprinkle with oregano.",
    },
    {
        title: "Chicken Caesar Wrap",
        description: "A handheld lunch with grilled chicken.",
        category: "Lunch",
        image_url: "https://www.closetcooking.com/wp-content/uploads/2025/01/Crispy-Baked-Caesar-Chicken-Wraps-1200-5437.jpg",
        ingredients:
            "2 chicken breasts\n4 tortillas\nRomaine lettuce\nParmesan\n4 tbsp Caesar dressing",
        instructions:
            "Grill the chicken until cooked through and slice it. Fill the tortillas with lettuce, chicken, parmesan and dressing, then roll them up.",
    },
    {
        title: "Tomato Soup",
        description: "Smooth, simple and comforting.",
        category: "Lunch",
        image_url: "https://cdn.loveandlemons.com/wp-content/uploads/2023/01/tomato-soup-recipe.jpg",
        ingredients:
            "1 onion\n2 garlic cloves\n1 can chopped tomatoes\n5 dl vegetable stock\n1 dl cream\nBasil",
        instructions:
            "Soften the onion and garlic. Add tomatoes and stock and simmer for 15 minutes. Blend until smooth, stir in the cream and serve with basil.",
    },
    {
        title: "Chicken Quesadilla",
        description: "Crispy outside, cheesy inside.",
        category: "Lunch",
        image_url: "https://emilybites.com/wp-content/uploads/2025/04/Barbecue-Chicken-Quesadillas-5b.jpg",
        ingredients:
            "2 tortillas\n1 cooked chicken breast\n150g grated cheese\n1 red pepper\n1 tbsp oil\nSalsa",
        instructions:
            "Spread chicken, pepper and cheese over one tortilla and cover with the other. Fry in oil for 3 minutes on each side until golden. Cut into wedges and serve with salsa.",
    },
    {
        title: "Pasta Salad",
        description: "A lunch box favorite that keeps well.",
        category: "Lunch",
        image_url: "https://www.eazypeazymealz.com/wp-content/uploads/2016/06/Caprese-Pasta-Salad-7-683x1024.jpg",
        ingredients:
            "250g pasta\n1 cucumber\n200g cherry tomatoes\n100g mozzarella\n3 tbsp olive oil\n1 tbsp vinegar\nBasil",
        instructions:
            "Boil the pasta and let it cool. Mix with chopped cucumber, halved tomatoes and mozzarella. Dress with olive oil, vinegar and basil.",
    },

    // Dinner
    {
        title: "Spaghetti Carbonara",
        description: "Classic Italian pasta with eggs and pancetta.",
        category: "Dinner",
        image_url: "https://foodbydrygast.com/assets/images/recipes/pasta_carbonara4x3a1280w960h.webp",
        ingredients: "200g spaghetti\n2 eggs\n100g pancetta\n50g parmesan\nBlack pepper",
        instructions:
            "Boil the pasta. Fry the pancetta until crisp. Mix eggs and parmesan. Toss everything together off the heat and add pepper.",
    },
    {
        title: "Baked Salmon with Potatoes",
        description: "Everything cooks in the oven on one tray.",
        category: "Dinner",
        image_url: "https://www.oliveandmango.com/images/uploads/2020_08_06_sheetpan_salmon_and_potatoes_with_veggies_1.jpg",
        ingredients:
            "4 salmon fillets\n600g potatoes\n2 tbsp olive oil\n1 lemon\nDill\nSalt and pepper",
        instructions:
            "Roast the sliced potatoes with oil at 200°C for 20 minutes. Add the salmon and lemon slices and bake for 12 more minutes. Finish with dill.",
    },
    {
        title: "Beef Tacos",
        description: "Weeknight tacos with all the toppings.",
        category: "Dinner",
        image_url: "https://carlsbadcravings.com/wp-content/uploads/2022/02/Shredded-Beef-Tacos-featured.jpg",
        ingredients:
            "400g minced beef\n1 packet taco spice\n8 taco shells\nLettuce\nTomato\nGrated cheese\nSour cream",
        instructions:
            "Brown the beef and stir in the spice mix with a little water. Fill the shells with beef and toppings.",
    },
    {
        title: "Chicken Stir Fry",
        description: "A fast dinner with plenty of vegetables.",
        category: "Dinner",
        image_url: "https://www.halfbakedharvest.com/wp-content/uploads/2021/08/25-Minute-Black-Pepper-Jalapen%CC%83o-Basil-Chicken-Stir-Fry-1.jpg",
        ingredients:
            "400g chicken breast\n1 broccoli\n2 carrots\n1 red pepper\n3 tbsp soy sauce\n1 tbsp sesame oil\nRice",
        instructions:
            "Slice the chicken and vegetables. Stir fry the chicken in sesame oil until cooked, add the vegetables and cook for 5 minutes. Add soy sauce and serve with rice.",
    },
    {
        title: "Swedish Meatballs",
        description: "Served with creamy sauce and lingonberries.",
        category: "Dinner",
        image_url: "https://www.all-thats-jas.com/wp-content/uploads/2022/06/svenska-k%D3%A7ttbullar-1200x1800.jpg",
        ingredients:
            "500g minced beef and pork\n1 onion\n1 dl breadcrumbs\n1 dl milk\n1 egg\n2 dl cream\n1 tbsp soy sauce\nLingonberry jam",
        instructions:
            "Mix the mince with soaked breadcrumbs, grated onion and egg. Shape into balls and fry in butter. Simmer cream and soy sauce in the pan for a sauce. Serve with jam.",
    },

    // Sides
    {
        title: "Crispy Roasted Potatoes",
        description: "Golden and crunchy on the outside, soft inside.",
        category: "Sides",
        image_url: "https://www.sipandfeast.com/wp-content/uploads/2024/03/crispy-roasted-potatoes-snippet.jpg",
        ingredients: "800g potatoes\n3 tbsp olive oil\n1 tsp salt\n1 tsp paprika\nRosemary",
        instructions:
            "Cut the potatoes into wedges and toss with oil, salt, paprika and rosemary. Roast at 220°C for 35 minutes, turning once.",
    },
    {
        title: "Garlic Green Beans",
        description: "Quick, bright and full of flavor.",
        category: "Sides",
        image_url: "https://www.recipetineats.com/tachyon/2021/10/Garlic-Sauteed-Green-Beans_08-SQ.jpg",
        ingredients: "400g green beans\n3 garlic cloves\n1 tbsp butter\n1 tbsp olive oil\nSalt and pepper",
        instructions:
            "Boil the beans for 3 minutes and drain. Fry the sliced garlic in butter and oil, add the beans and toss for 2 minutes.",
    },
    {
        title: "Creamy Coleslaw",
        description: "A cool, crunchy side for burgers and grilled food.",
        category: "Sides",
        image_url: "https://www.kitchensanctuary.com/wp-content/uploads/2020/05/Coleslaw-square-FS-32-500x500.jpg",
        ingredients:
            "0.5 white cabbage\n2 carrots\n1.5 dl mayonnaise\n1 tbsp vinegar\n1 tsp sugar\nSalt",
        instructions:
            "Shred the cabbage and grate the carrots. Stir together mayonnaise, vinegar, sugar and salt, mix with the vegetables and chill for 30 minutes.",
    },
    {
        title: "Garlic Bread",
        description: "Warm, buttery and best served fresh.",
        category: "Sides",
        image_url: "https://sallysbakingaddiction.com/wp-content/uploads/2025/01/easy-garlic-bread.jpg",
        ingredients: "1 baguette\n100g soft butter\n3 garlic cloves\nParsley\nSalt",
        instructions:
            "Mix butter with pressed garlic, parsley and salt. Slice the baguette without cutting through, spread with the butter and bake at 200°C for 10 minutes.",
    },
    {
        title: "Honey Roasted Carrots",
        description: "Sweet, sticky and easy.",
        category: "Sides",
        image_url: "https://www.closetcooking.com/wp-content/uploads/2023/11/Honey-Balsamic-Roasted-Carrots-1200-1969.jpg",
        ingredients: "600g carrots\n2 tbsp olive oil\n1 tbsp honey\nThyme\nSalt",
        instructions:
            "Halve the carrots lengthwise and toss with oil, honey, thyme and salt. Roast at 200°C for 25 minutes until tender and caramelized.",
    },

    // Dessert
    {
        title: "Chocolate Mug Cake",
        description: "Dessert in two minutes.",
        category: "Dessert",
        image_url: "https://leitesculinaria.com/wp-content/uploads/2020/12/chocolate-mug-cake.jpg",
        ingredients: "4 tbsp flour\n2 tbsp cocoa\n3 tbsp sugar\n3 tbsp milk\n1 tbsp oil",
        instructions: "Mix everything in a mug and microwave for about 90 seconds.",
    },
    {
        title: "Apple Crumble",
        description: "Warm apples under a buttery oat topping.",
        category: "Dessert",
        image_url: "https://www.recipetineats.com/tachyon/2016/05/Apple-Crumble_1a-1.jpg",
        ingredients:
            "4 apples\n1 tbsp sugar\n1 tsp cinnamon\n100g butter\n1.5 dl flour\n1 dl rolled oats\n1 dl brown sugar",
        instructions:
            "Slice the apples into a baking dish and mix with sugar and cinnamon. Rub butter, flour, oats and brown sugar into crumbs and spread over the apples. Bake at 200°C for 25 minutes.",
    },
    {
        title: "Vanilla Panna Cotta",
        description: "Silky Italian cream dessert.",
        category: "Dessert",
        image_url: "https://www.oetker.se/assets/recipes/assets/63d3e27c2655433491b1952d29c68191/1272x764/vegegel_550_1jpg.webp",
        ingredients:
            "3 dl cream\n1 dl milk\n3 tbsp sugar\n1 vanilla pod\n3 gelatine leaves",
        instructions:
            "Soak the gelatine in cold water. Heat cream, milk, sugar and vanilla, then stir in the squeezed gelatine. Pour into glasses and chill for at least four hours.",
    },
    {
        title: "Chocolate Brownies",
        description: "Fudgy in the middle with a crisp top.",
        category: "Dessert",
        image_url: "https://organicallyaddison.com/wp-content/uploads/2022/09/2022-09-04_17-44-12_390.jpeg",
        ingredients:
            "150g butter\n200g dark chocolate\n2 dl sugar\n3 eggs\n1.5 dl flour\nPinch of salt",
        instructions:
            "Melt butter and chocolate together. Whisk in sugar and eggs, then fold in flour and salt. Pour into a lined tin and bake at 175°C for 20 minutes.",
    },
    {
        title: "Creamy Rice Pudding",
        description: "Warm, comforting and lightly spiced.",
        category: "Dessert",
        image_url: "https://www.theroastedroot.net/wp-content/uploads/2026/04/dairy-free-rice-pudding-6.jpg",
        ingredients: "1.5 dl short grain rice\n8 dl milk\n2 tbsp sugar\n1 tsp vanilla sugar\nCinnamon",
        instructions:
            "Simmer the rice with milk, sugar and vanilla sugar for about 35 minutes, stirring often. Serve warm with cinnamon.",
    },

    // Snacks
    {
        title: "Classic Hummus",
        description: "Creamy dip, great with vegetables or bread.",
        category: "Snacks",
        image_url: "https://cdn.loveandlemons.com/wp-content/uploads/2019/12/hummus-500x500.jpg",
        ingredients:
            "1 can chickpeas\n2 tbsp tahini\n1 lemon\n1 garlic clove\n3 tbsp olive oil\nSalt",
        instructions:
            "Blend everything until smooth, adding a splash of cold water if it is too thick. Serve with olive oil on top.",
    },
    {
        title: "Banana Oat Cookies",
        description: "Only three ingredients.",
        category: "Snacks",
        image_url: "https://joyfoodsunshine.com/wp-content/uploads/2021/03/banana-oatmeal-cookies-recipe-5.jpg",
        ingredients: "2 ripe bananas\n2 dl rolled oats\n50g dark chocolate chips",
        instructions:
            "Mash the bananas and stir in the oats and chocolate. Drop spoonfuls on a baking tray and bake at 180°C for 12 minutes.",
    },
    {
        title: "Fresh Guacamole",
        description: "Perfect with tortilla chips.",
        category: "Snacks",
        image_url: "https://hips.hearstapps.com/hmg-prod/images/guacamole-index-641e009dd015d.jpg?crop=0.503xw:1.00xh;0.252xw,0&resize=1200:*",
        ingredients: "2 ripe avocados\n1 lime\n1 small red onion\n1 tomato\nCoriander\nSalt",
        instructions:
            "Mash the avocados with lime juice. Stir in finely chopped onion, tomato and coriander, and season with salt.",
    },
    {
        title: "Cinnamon Popcorn",
        description: "Sweet and salty movie night snack.",
        category: "Snacks",
        image_url: "https://saltandbaker.com/wp-content/uploads/2019/10/cinnamon-roll-popcorn-recipe.jpg",
        ingredients: "0.5 dl popcorn kernels\n1 tbsp oil\n1 tbsp butter\n1 tbsp sugar\n1 tsp cinnamon\nSalt",
        instructions:
            "Pop the kernels in oil in a covered pot. Melt the butter and pour over the popcorn, then toss with sugar, cinnamon and a pinch of salt.",
    },
    {
        title: "Peanut Butter Energy Balls",
        description: "No baking, ready in ten minutes.",
        category: "Snacks",
        image_url: "https://cdn.loveandlemons.com/wp-content/uploads/2026/01/energy-bites-recipe.jpg",
        ingredients: "2 dl rolled oats\n1 dl peanut butter\n3 tbsp honey\n50g dark chocolate chips",
        instructions:
            "Mix everything in a bowl and chill for 15 minutes. Roll into small balls and keep them in the fridge.",
    },
];

async function getOrCreateDemoUser() {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
        DEMO_EMAIL,
    ]);
    if (existing.rows.length > 0) return existing.rows[0].id;

    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
    const created = await pool.query(
        "INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id",
        [DEMO_EMAIL, DEMO_USERNAME, passwordHash]
    );
    return created.rows[0].id;
}

async function seed() {
    const userId = await getOrCreateDemoUser();
    let created = 0;
    let refreshed = 0;

    for (const r of RECIPES) {
        const found = await pool.query(
            "SELECT id FROM recipes WHERE user_id = $1 AND title = $2",
            [userId, r.title]
        );

        if (found.rows.length > 0) {
            // Already exists: keep the category in sync and add an image if one was provided
            await pool.query(
                "UPDATE recipes SET category = $1, image_url = COALESCE($2, image_url) WHERE id = $3",
                [r.category, r.image_url || null, found.rows[0].id]
            );
            refreshed++;
            continue;
        }

        await pool.query(
            `INSERT INTO recipes (user_id, title, description, ingredients, instructions, category, image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [userId, r.title, r.description, r.ingredients, r.instructions, r.category, r.image_url || null]
        );
        created++;
    }

    console.log(
        `Demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}. Added ${created} new recipes, refreshed ${refreshed} existing.`
    );
}

seed()
    .catch((err) => console.error("Seeding failed:", err.message))
    .finally(() => pool.end());