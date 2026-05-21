export function success(res, data = null, message = null) {
  return res.status(200).json({
    success: true,
    data,
    message,
  });
}

export function badRequest(res, message = 'Nieprawidłowe dane.') {
  return res.status(400).json({
    success: false,
    message,
  });
}

export function validationError(
  res,
  errors,
  message = 'Błąd walidacji danych.',
) {
  return res.status(422).json({
    success: false,
    message,
    errors,
  });
}

export function created(res, data = null, message = null) {
  return res.status(201).json({
    success: true,
    data,
    message,
  });
}

export function unauthorized(res, message = 'Brak autoryzacji.') {
  return res.status(401).json({
    success: false,
    message,
  });
}

export function forbidden(res, message = 'Brak uprawnień.') {
  return res.status(403).json({
    success: false,
    message,
  });
}

export function notFound(res, message = 'Nie znaleziono.') {
  return res.status(404).json({
    success: false,
    message,
  });
}

export function conflict(res, message = 'Konflikt zasobów.') {
  return res.status(409).json({
    success: false,
    message,
  });
}

export function serverError(res, error) {
  return res.status(500).json({
    success: false,
    message: 'Błąd serwera.',
    errors: error?.message,
  });
}

export function serviceUnavailable(res, error) {
  return res.status(503).json({
    success: false,
    message: 'Płatności niedostępne.',
    errors: error?.message,
  });
}
