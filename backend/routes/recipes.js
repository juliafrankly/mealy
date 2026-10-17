const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/auth");

const router = express.Router();

const SELECT_RECIPE = `
  SELECT r.id, r.user_id, r.title, r.description, r.ingredients,
         r.instructions, r.category, r.image_url, r.created_at,
         u.username AS author
  FROM recipes r
  JOIN users u ON u.id = r.user_id
`;

function serverError(res, err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
}

// GET /api/recipes?search=pasta&category=Dinner&user_id=1&ids=1,2,3
router.get("/", async (req, res) => {
    const { search, category, user_id, ids } = req.query;
    const conditions = [];
    const values = [];

    if (search) {
        values.push(`%${search}%`);
        conditions.push(`r.title ILIKE $${values.length}`);
    }
    if (category) {
        values.push(category);
        conditions.push(`r.category = $${values.length}`);
    }
    if (user_id) {
        const userId = Number(user_id);
        if (!Number.isInteger(userId)) {
            return res.status(400).json({ message: "Invalid user id." });
        }
        values.push(userId);
        conditions.push(`r.user_id = $${values.length}`);
    }
    if (ids !== undefined) {
        const idList = String(ids)
            .split(",")
            .filter(Boolean)
            .map(Number)
            .filter(Number.isInteger);
        values.push(idList);
        conditions.push(`r.id = ANY($${values.length}::int[])`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    try {
        const result = await pool.query(
            `${SELECT_RECIPE} ${where} ORDER BY r.created_at DESC`,
            values
        );
        res.json(result.rows);
    } catch (err) {
        serverError(res, err);
    }
});

// GET /api/recipes/:id
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ message: "Invalid recipe id." });
    }

    try {
        const result = await pool.query(`${SELECT_RECIPE} WHERE r.id = $1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Recipe not found." });
        }
        res.json(result.rows[0]);
    } catch (err) {
        serverError(res, err);
    }
});

// POST /api/recipes (requires token)
router.post("/", requireAuth, async (req, res) => {
    const { title, description, ingredients, instructions, category, image_url } =
        req.body;

    if (!title || !ingredients || !instructions) {
        return res
            .status(400)
            .json({ message: "Title, ingredients and instructions are required." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO recipes
         (user_id, title, description, ingredients, instructions, category, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
            [req.userId, title, description, ingredients, instructions, category, image_url]
        );
        const created = await pool.query(`${SELECT_RECIPE} WHERE r.id = $1`, [
            result.rows[0].id,
        ]);
        res.status(201).json(created.rows[0]);
    } catch (err) {
        serverError(res, err);
    }
});

// PATCH /api/recipes/:id (requires token, owner only)
router.patch("/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ message: "Invalid recipe id." });
    }

    const { title, description, ingredients, instructions, category, image_url } =
        req.body;

    try {
        const existing = await pool.query(
            "SELECT user_id FROM recipes WHERE id = $1",
            [id]
        );
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: "Recipe not found." });
        }
        if (existing.rows[0].user_id !== req.userId) {
            return res
                .status(403)
                .json({ message: "You can only edit your own recipes." });
        }

        await pool.query(
            `UPDATE recipes SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         ingredients = COALESCE($3, ingredients),
         instructions = COALESCE($4, instructions),
         category = COALESCE($5, category),
         image_url = COALESCE($6, image_url)
       WHERE id = $7`,
            [title, description, ingredients, instructions, category, image_url, id]
        );

        const updated = await pool.query(`${SELECT_RECIPE} WHERE r.id = $1`, [id]);
        res.json(updated.rows[0]);
    } catch (err) {
        serverError(res, err);
    }
});

// DELETE /api/recipes/:id (requires token, owner only)
router.delete("/:id", requireAuth, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        return res.status(400).json({ message: "Invalid recipe id." });
    }

    try {
        const existing = await pool.query(
            "SELECT user_id FROM recipes WHERE id = $1",
            [id]
        );
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: "Recipe not found." });
        }
        if (existing.rows[0].user_id !== req.userId) {
            return res
                .status(403)
                .json({ message: "You can only delete your own recipes." });
        }

        await pool.query("DELETE FROM recipes WHERE id = $1", [id]);
        res.status(204).send();
    } catch (err) {
        serverError(res, err);
    }
});

module.exports = router;