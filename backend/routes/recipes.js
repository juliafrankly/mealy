const express = require("express");
const pool = require("../db");
const requireAuth = require("../middleware/auth");
const { serverError, parseId } = require("../utils/http");

const router = express.Router();

const SELECT_RECIPE = `
  SELECT r.id, r.user_id, r.title, r.description, r.ingredients,
         r.instructions, r.category, r.image_url, r.created_at,
         u.username AS author
  FROM recipes r
  JOIN users u ON u.id = r.user_id
`;

const SORT_OPTIONS = {
    newest: "r.created_at DESC, r.id DESC",
    oldest: "r.created_at ASC, r.id ASC",
    title_asc: "LOWER(r.title) ASC, r.id ASC",
    title_desc: "LOWER(r.title) DESC, r.id DESC",
};

// GET /api/recipes?search=pasta&category=Dinner&sort=title_asc&limit=10&offset=0
router.get("/", async (req, res) => {
    const { search, category, user_id, ids, sort = "newest", limit, offset } =
        req.query;
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

    if (!Object.hasOwn(SORT_OPTIONS, sort)) {
        return res.status(400).json({ message: "Invalid sort option." });
    }
    const orderBy = SORT_OPTIONS[sort];

    // Paging is optional: without limit, all matching recipes are returned
    let paging = "";
    if (limit !== undefined) {
        const limitNumber = Number(limit);
        const offsetNumber = Number(offset ?? 0);
        if (
            !Number.isInteger(limitNumber) ||
            limitNumber < 1 ||
            limitNumber > 100 ||
            !Number.isInteger(offsetNumber) ||
            offsetNumber < 0
        ) {
            return res.status(400).json({ message: "Invalid paging options." });
        }
        values.push(limitNumber);
        const limitParam = values.length;
        values.push(offsetNumber);
        paging = `LIMIT $${limitParam} OFFSET $${values.length}`;
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    try {
        const result = await pool.query(
            `${SELECT_RECIPE} ${where} ORDER BY ${orderBy} ${paging}`,
            values
        );
        res.json(result.rows);
    } catch (err) {
        serverError(res, err);
    }
});

// GET /api/recipes/:id
router.get("/:id", async (req, res) => {
    const id = parseId(req, res);
    if (id === null) return;

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
        req.body || {};

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
    const id = parseId(req, res);
    if (id === null) return;

    const { title, description, ingredients, instructions, category, image_url } =
        req.body || {};

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
    const id = parseId(req, res);
    if (id === null) return;

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