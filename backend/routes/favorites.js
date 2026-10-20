const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/auth");
const { serverError, parseId } = require("../utils/http");

const router = express.Router();

// GET /api/favorites -> ids of the logged-in user's favorites, e.g. [12, 7, 3]
router.get("/favorites", requireAuth, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT recipe_id FROM favorites WHERE user_id = $1 ORDER BY created_at DESC",
            [req.userId]
        );
        res.json(result.rows.map((row) => row.recipe_id));
    } catch (err) {
        serverError(res, err);
    }
});

// PUT /api/recipes/:id/favorite -> save as favorite (safe to repeat)
router.put("/recipes/:id/favorite", requireAuth, async (req, res) => {
    const id = parseId(req, res);
    if (id === null) return;

    try {
        const recipe = await pool.query("SELECT id FROM recipes WHERE id = $1", [id]);
        if (recipe.rows.length === 0) {
            return res.status(404).json({ message: "Recipe not found." });
        }

        await pool.query(
            `INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
            [req.userId, id]
        );
        res.status(204).send();
    } catch (err) {
        serverError(res, err);
    }
});

// DELETE /api/recipes/:id/favorite -> remove favorite (safe to repeat)
router.delete("/recipes/:id/favorite", requireAuth, async (req, res) => {
    const id = parseId(req, res);
    if (id === null) return;

    try {
        await pool.query(
            "DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2",
            [req.userId, id]
        );
        res.status(204).send();
    } catch (err) {
        serverError(res, err);
    }
});

module.exports = router;