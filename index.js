import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Create a new user
app.post("/users", async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = await prisma.user.create({
            data: { name, email },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", uptime: process.uptime() });
});

app.get("/user/:id", async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id: Number(id) } })

    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." })
    }

    res.json(user);
})

// Get all users
app.get("/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});