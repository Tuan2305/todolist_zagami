import { HttpInterceptorFn } from '@angular/common/http';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Lấy token từ localStorage
  const token = localStorage.getItem('token') || 
                (localStorage.getItem('user') ? 
                 JSON.parse(localStorage.getItem('user')!)?.token : null);
  
  // Nếu có token, thêm vào header Authorization
  if (token) {
    console.log('Adding token to request:', req.url);
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  
  // Nếu không có token, tiếp tục request như bình thường
  return next(req);
};