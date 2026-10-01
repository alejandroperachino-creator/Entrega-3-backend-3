import UserService from '../services/user.service.js';

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getAll(req, res, next) {
    try {
      const users = await this.userService.getAllUsers();
      return res.status(200).json({
        status: 'success',
        message: 'Usuarios obtenidos exitosamente',
        payload: users
      });
    } catch (error) {
      return next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      return res.status(200).json({
        status: 'success',
        message: 'Usuario obtenido exitosamente',
        payload: user
      });
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {
    try {
      const user = await this.userService.createUser(req.body);
      return res.status(201).json({
        status: 'success',
        message: 'Usuario creado exitosamente',
        payload: user
      });
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Usuario actualizado exitosamente',
        payload: user
      });
    } catch (error) {
      return next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const user = await this.userService.deleteUser(req.params.id);
      return res.status(200).json({
        status: 'success',
        message: 'Usuario eliminado exitosamente',
        payload: user
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default new UserController();