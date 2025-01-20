import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import categoryRoutes from "./routes/categoryRoutes";
import taskRoutes from "./routes/taskRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao banco de dados MongoDB
const dbUri = process.env.MONGODB_URI || "";
mongoose
  .connect(dbUri)
  .then(() => {
    console.log("Conectado ao banco de dados MongoDB");
  })
  .catch((error) => {
    console.error("Erro ao conectar com o MongoDB", error);
  });

// Definir as rotas
app.use("/user", authRoutes); // Rota de login
app.use("/categories", categoryRoutes);
app.use("/tasks", taskRoutes);

// Iniciar o servidor
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
