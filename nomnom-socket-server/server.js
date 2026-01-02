// ==============================
// NomNom Server (Express + SQL + JWT)
// ==============================
const express = require('express');
const http = require('http');
const cors = require('cors');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);

// ==============================
// CONFIG
// ==============================
const PORT = 3000;
const JWT_SECRET = 'nomnom_secret_change_me';

// ==============================
// MIDDLEWARE
// ==============================
app.use(cors());
app.use(express.json());

// ==============================
// SQL SERVER CONFIG
// ==============================
const dbConfig = {
    user: 'nomnom',
    password: '1234',
    server: 'localhost',
    port: 52919, // port SQL Express của bạn
    database: 'NomNomDB',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

let poolPromise;
async function getPool() {
    if (!poolPromise) {
        console.log('Connecting to SQL Server...');
        poolPromise = sql.connect(dbConfig);
    }
    return poolPromise;
}

// ==============================
// AUTH MIDDLEWARE
// ==============================
function authRequired(req, res, next) {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload; // { userId, role }
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

function adminOnly(req, res, next) {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin only' });
    }
    next();
}

// ==============================
// TEST ROUTE
// ==============================
app.get('/', (req, res) => {
    res.send('NomNom API is running');
});

// ==============================
// AUTH ROUTES
// ==============================

// REGISTER
app.post('/auth/register', async (req, res) => {
    const { email, password, fullName } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        const pool = await getPool();

        // Check email exists
        const exists = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT Id FROM Users WHERE Email = @email');

        if (exists.recordset.length > 0) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const hash = await bcrypt.hash(password, 10);

        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('hash', sql.NVarChar, hash)
            .input('fullName', sql.NVarChar, fullName || null)
            .query(`
        INSERT INTO Users (Email, PasswordHash, FullName)
        OUTPUT INSERTED.Id, INSERTED.Email, INSERTED.Role, INSERTED.FullName
        VALUES (@email, @hash, @fullName)
      `);

        const u = result.recordset[0];

        const token = jwt.sign(
            { userId: u.Id, role: u.Role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: u.Id,
                email: u.Email,
                role: u.Role,
                fullName: u.FullName,
            },
        });
    } catch (err) {
        console.error('REGISTER ERROR:', err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
});

// LOGIN
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const pool = await getPool();

        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query(`
        SELECT Id, Email, PasswordHash, Role, FullName
        FROM Users
        WHERE Email = @email
      `);

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.recordset[0];
        const ok = await bcrypt.compare(password, user.PasswordHash);
        if (!ok) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.Id, role: user.Role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user.Id,
                email: user.Email,
                role: user.Role,
                fullName: user.FullName,
            },
        });
    } catch (err) {
        console.error('LOGIN ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==============================
// RECIPES ROUTES
// ==============================

// GET ALL RECIPES (PUBLIC)
app.get('/recipes', async (req, res) => {
    try {
        const pool = await getPool();
        const result = await pool.request().query(`
      SELECT
        r.RecipeId,
        r.Name,
        r.Category,
        r.Description,
        r.TimeMinutes,
        r.Calories,
        img.ImageUrl
      FROM Recipes r
      OUTER APPLY (
        SELECT TOP 1 ImageUrl
        FROM RecipeImages
        WHERE RecipeId = r.RecipeId
        ORDER BY ImageId ASC
      ) img
      ORDER BY r.RecipeId DESC
    `);

        res.json(result.recordset);
    } catch (err) {
        console.error('GET /recipes ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET RECIPE DETAIL (PUBLIC)
app.get('/recipes/:id', async (req, res) => {
    const id = Number(req.params.id);
    try {
        const pool = await getPool();

        const recipe = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT * FROM Recipes WHERE RecipeId = @id`);

        if (!recipe.recordset.length) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        const images = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT ImageId, ImageUrl FROM RecipeImages WHERE RecipeId=@id`);

        const ingredients = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT IngredientId, Ingredient FROM RecipeIngredients WHERE RecipeId=@id`);

        const steps = await pool.request()
            .input('id', sql.Int, id)
            .query(`
        SELECT StepId, StepNumber, Instruction
        FROM RecipeSteps
        WHERE RecipeId=@id
        ORDER BY StepNumber
      `);

        res.json({
            ...recipe.recordset[0],
            images: images.recordset,
            ingredients: ingredients.recordset,
            steps: steps.recordset,
        });
    } catch (err) {
        console.error('GET /recipes/:id ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// CREATE RECIPE (ADMIN)
app.post('/recipes', authRequired, adminOnly, async (req, res) => {
    const { name, category, description, timeMinutes, calories, videoUrl } = req.body;
    if (!name || !category) {
        return res.status(400).json({ error: 'Missing name or category' });
    }

    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('Name', sql.NVarChar, name)
            .input('Category', sql.NVarChar, category)
            .input('Description', sql.NVarChar, description || null)
            .input('TimeMinutes', sql.Int, timeMinutes || null)
            .input('Calories', sql.Int, calories || null)
            .input('VideoUrl', sql.NVarChar, videoUrl || null)
            .query(`
        INSERT INTO Recipes (Name, Category, Description, TimeMinutes, Calories, VideoUrl)
        OUTPUT INSERTED.RecipeId
        VALUES (@Name, @Category, @Description, @TimeMinutes, @Calories, @VideoUrl)
      `);

        res.json({ id: result.recordset[0].RecipeId });
    } catch (err) {
        console.error('POST /recipes ERROR:', err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
});

// UPDATE RECIPE (ADMIN)
app.put('/recipes/:id', authRequired, adminOnly, async (req, res) => {
    const id = Number(req.params.id);
    const { name, category, description, timeMinutes, calories, videoUrl } = req.body;

    try {
        const pool = await getPool();
        await pool.request()
            .input('id', sql.Int, id)
            .input('Name', sql.NVarChar, name || null)
            .input('Category', sql.NVarChar, category || null)
            .input('Description', sql.NVarChar, description || null)
            .input('TimeMinutes', sql.Int, timeMinutes || null)
            .input('Calories', sql.Int, calories || null)
            .input('VideoUrl', sql.NVarChar, videoUrl || null)
            .query(`
        UPDATE Recipes SET
          Name = COALESCE(@Name, Name),
          Category = COALESCE(@Category, Category),
          Description = COALESCE(@Description, Description),
          TimeMinutes = COALESCE(@TimeMinutes, TimeMinutes),
          Calories = COALESCE(@Calories, Calories),
          VideoUrl = COALESCE(@VideoUrl, VideoUrl)
        WHERE RecipeId = @id
      `);

        res.json({ ok: true });
    } catch (err) {
        console.error('PUT /recipes ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE RECIPE (ADMIN)
app.delete('/recipes/:id', authRequired, adminOnly, async (req, res) => {
    const id = Number(req.params.id);
    try {
        const pool = await getPool();
        await pool.request()
            .input('id', sql.Int, id)
            .query(`DELETE FROM Recipes WHERE RecipeId=@id`);
        res.json({ ok: true });
    } catch (err) {
        console.error('DELETE /recipes ERROR:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==============================
// START SERVER
// ==============================
server.listen(PORT, () => {
    console.log(`NomNom API running on http://localhost:${PORT}`);
});
