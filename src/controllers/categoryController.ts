import { Request, Response } from "express";
import Category from "../models/Category";
import Task from "../models/Task";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const createCategory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o ID do usuário autenticado
    const { name } = req.body;

    if (!userId) {
      res.status(400).json({ message: "Usuário não autenticado" });
      return;
    }

    const newCategory = new Category({ name, userId });
    await newCategory.save();

    res.status(201).json({ message: "Categoria criada com sucesso", category: newCategory });
  } catch (error) {
    console.error("Erro ao criar categoria", error);
    res.status(500).send("Erro ao criar categoria");
  }
};

export const getCategoriesByUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id; // Obtém o ID do usuário autenticado

    if (!userId) {
      res.status(400).json({ message: "Usuário não autenticado" });
      return;
    }

    // Busca categorias pelo userId
    const categories = await Category.find({ userId });

    res.status(200).json({ categories });
  } catch (error) {
    console.error("Erro ao buscar categorias", error);
    res.status(500).send("Erro ao buscar categorias");
  }
};

export const getCategoryTotalDuration = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.categoryId;
    const tasks = await Task.find({ category: categoryId });

    const totalDuration = tasks.reduce((acc, task) => acc + Number(task.duration), 0);

    res.status(200).json(totalDuration);
  } catch (error) {
    console.error("Erro ao calcular a soma das durações das tarefas", error);
    res.status(500).json({ message: "Erro ao calcular a soma das durações das tarefas" });
  }
};

export const updateCategory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const categoryId = req.params.categoryId; // ID da tarefa a ser editada
    const { name } = req.body; // Campos atualizados
    const userId = req.user?.id; // ID do usuário autenticado

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }
    // Verificar se a categoria existe e pertence ao usuário autenticado
    const category = await Category.findOne({ _id: categoryId, userId });

    if (!category) {
      res
        .status(404)
        .json({ message: "Categoria não encontrada ou não pertence ao usuário." });
      return;
    }

    // Atualizar os campos da categoria
    category.name = name || category.name;
    await category.save();

    res.status(200).json({ message: "Categoria atualizada com sucesso.", category });
  } catch (error) {
    console.error("Erro ao atualizar categoria", error);
    res.status(500).send("Erro ao atualizar categoria.");
  }
};

export const deleteCategory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const categoryId = req.params.categoryId; // ID da categoria a ser deletada
    const userId = req.user?.id; // ID do usuário autenticado

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    // Verificar se a categoria existe e pertence ao usuário autenticado
    const category = await Category.findOne({ _id: categoryId, userId });

    if (!category) {
      res
        .status(404)
        .json({ message: "Categoria não encontrada ou não pertence ao usuário." });
      return;
    }

    // Deletar todas as tarefas associadas à categoria
    await Task.deleteMany({ category: categoryId });
    // Deletar a categoria
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({ message: "Categoria deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar categoria", error);
    res.status(500).send("Erro ao deletar categoria.");
  }
};
