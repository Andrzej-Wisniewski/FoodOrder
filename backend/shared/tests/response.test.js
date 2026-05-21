import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  success,
  badRequest,
  validationError,
  created,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  serverError,
} from '../utils/response.js';

function createMockRes() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
}

describe('response helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('success', () => {
    it('sets status 200 and returns success: true', () => {
      const res = createMockRes();
      success(res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: null,
        message: null,
      });
    });

    it('passes data and message to json', () => {
      const res = createMockRes();
      success(res, { id: 1 }, 'OK');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 1 },
        message: 'OK',
      });
    });
  });

  describe('badRequest', () => {
    it('sets status 400 and default message', () => {
      const res = createMockRes();
      badRequest(res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Nieprawidłowe dane.',
      });
    });

    it('passes custom message', () => {
      const res = createMockRes();
      badRequest(res, 'Błąd');
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Błąd',
      });
    });
  });

  describe('validationError', () => {
    it('sets status 422 with errors and default message', () => {
      const res = createMockRes();
      const errors = { email: 'Nieprawidłowy email' };
      validationError(res, errors);
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Błąd walidacji danych.',
        errors,
      });
    });

    it('passes custom message', () => {
      const res = createMockRes();
      validationError(res, [], 'Walidacja nie przeszła');
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Walidacja nie przeszła',
        errors: [],
      });
    });
  });

  describe('created', () => {
    it('sets status 201 and success: true', () => {
      const res = createMockRes();
      created(res, { id: 1 });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: 1 },
        message: null,
      });
    });
  });

  describe('unauthorized', () => {
    it('sets status 401 and default message', () => {
      const res = createMockRes();
      unauthorized(res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Brak autoryzacji.',
      });
    });
  });

  describe('forbidden', () => {
    it('sets status 403 and default message', () => {
      const res = createMockRes();
      forbidden(res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Brak uprawnień.',
      });
    });
  });

  describe('notFound', () => {
    it('sets status 404 and default message', () => {
      const res = createMockRes();
      notFound(res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Nie znaleziono.',
      });
    });
  });

  describe('conflict', () => {
    it('sets status 409 and default message', () => {
      const res = createMockRes();
      conflict(res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Konflikt zasobów.',
      });
    });
  });

  describe('serverError', () => {
    it('sets status 500 and passes error message in errors', () => {
      const res = createMockRes();
      const err = new Error('DB connection failed');
      serverError(res, err);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Błąd serwera.',
        errors: 'DB connection failed',
      });
    });

    it('handles error without message (errors: undefined)', () => {
      const res = createMockRes();
      serverError(res, {});
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Błąd serwera.',
        errors: undefined,
      });
    });
  });
});
