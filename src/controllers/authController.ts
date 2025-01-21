import { Request, Response } from "express";
import {
  deleteUser,
  getUserData,
  loginUser,
  refreshAccessToken,
  registerUser,
  updateUser,
} from "../services/authService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const registerController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Chamar o serviço de registro
    const result = await registerUser(name, email, password);

    // Retornar a resposta de sucesso
    res.status(201).json({ message: "Usuário registrado com sucesso", ...result });
  } catch (error: any) {
    console.error("Erro ao registrar usuário", error);
    res.status(500).json({ message: error.message || "Erro ao registrar usuário" });
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const response = await loginUser(email, password);
    res.status(200).json({ message: "Login bem-sucedido", ...response });
  } catch (error: unknown) {
    // Aqui verificamos se o erro é uma instância de Error
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      // Caso o erro não seja uma instância de Error, você pode personalizar a resposta
      res.status(500).json({ message: "Erro inesperado" });
    }
  }
};

export const getUserDataController = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user; // O middleware já adicionou o user ao req

  if (!user) {
    res.status(401).json({ message: "Usuário não autenticado." });
    return;
  }

  try {
    const userData = await getUserData(user.id); // Usando o id do usuário para obter os dados
    res.status(200).json(userData);
  } catch (error: any) {
    res.status(500).json({ message: "Erro ao recuperar dados do usuário: " + error.message });
  }
};

export const updateUserController = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id; // Obtém o ID do usuário autenticado
  const { name, password } = req.body; // Dados de atualização

  if (!userId) {
    res.status(401).json({ message: "Usuário não autenticado." });
    return;
  }

  try {
    const updatedUser = await updateUser(userId, { name, password });
    res.status(200).json({ message: "Usuário atualizado com sucesso", user: updatedUser });
  } catch (error: any) {
    res.status(500).json({ message: `Erro ao atualizar usuário: ${error.message}` });
  }
};

export const deleteUserController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id; // ID do usuário autenticado

    if (!userId) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    await deleteUser(userId);
    res.status(200).json({ message: "Usuário deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar usuário", error);
    res.status(500).send("Erro ao deletar usuário.");
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token não fornecido." });
    return;
  }

  try {
    const newAccessToken = await refreshAccessToken(refreshToken);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error: any) {
    res.status(401).json({ message: "Erro ao renovar o token: " + error.message });
  }
};
