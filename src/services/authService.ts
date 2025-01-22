import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Task from "../models/Task";
import Category from "../models/Category";

// Função para login de usuário
export const loginUser = async (email: string, password: string) => {
  try {
    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email não registrado");
    }

    // Verifica se a senha está correta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Senha incorreta");
    }
    // Gera o token JWT
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken, user };
  } catch (error: any) {
    throw new Error(`Erro no login: ${error.message}`);
  }
};

// Função para registrar um novo usuário
export const registerUser = async (name: string, email: string, password: string) => {
  try {
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Usuário já existe");
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId: newUser._id }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "7d",
    });

    // Retornar os dados necessários
    return {
      accessToken,
      refreshToken,
      user: newUser,
    };
  } catch (error: any) {
    throw new Error(`Erro no registro: ${error.message}`);
  }
};

export const getUserData = async (userId: string) => {
  try {
    // Busca os dados do usuário no banco de dados
    const user = await User.findById(userId); // Exclui a senha

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Retorna todos os dados do usuário, incluindo o refreshToken
    return user;
  } catch (error: any) {
    throw new Error(`Erro ao obter dados do usuário: ${error.message}`);
  }
};

export const updateUser = async (
  userId: string,
  data: { name?: string; email?: string; password?: string }
) => {
  try {
    const { name, email, password } = data;

    // Busca o usuário pelo ID
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Atualiza os campos permitidos
    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    if (password) {
      // Criptografa a nova senha antes de salvar
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    return {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    };
  } catch (error: any) {
    throw new Error(`Erro ao atualizar usuário: ${error.message}`);
  }
};

export const deleteUser = async (userId: string) => {
  try {
    // Busca os dados do usuário no banco de dados
    const user = await User.findById(userId); // Exclui a senha

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    await Task.deleteMany({ userId });
    await Category.deleteMany({ userId });
    await User.findByIdAndDelete(userId);
  } catch (error: any) {
    throw new Error(`Erro ao deletar usuário: ${error.message}`);
  }
};

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token não fornecido.");
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error("Refresh token inválido ou expirado.");
    }

    const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });
    return newAccessToken;
  } catch (error: any) {
    throw new Error(`Erro ao atualizar token: ${error.message}`);
  }
};
