import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: { id: string }; // Propriedade adicionada ao Request
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token ausente ou malformado." });
    return;
  }

  const token = authHeader.replace("Bearer ", ""); // Remove o "Bearer " para obter o token puro

  if (!token) {
    res.status(401).json({ message: "Acesso negado. Nenhum token fornecido." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.user = { id: decoded.userId }; // Adiciona o userId ao req.user
    next(); // Prossegue para o próximo middleware ou rota
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expirado. Faça login novamente." });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Token inválido." });
    } else {
      res.status(500).json({ message: "Erro interno ao validar o token." });
    }
  }
};
