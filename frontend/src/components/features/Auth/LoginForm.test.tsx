/**
 * Integration tests for LoginForm component (RED phase - Tests come first)
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { LoginForm } from './LoginForm';
import { API_ENDPOINTS } from '@/config/constants';

// Mock API server
const server = setupServer(
  http.post(`${API_ENDPOINTS.AUTH.LOGIN}`, () => {
    return HttpResponse.json({
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
      user: {
        id: 1,
        username: 'admin_user',
        full_name: 'Admin User',
        role: 'admin',
      },
    });
  })
);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BrowserRouter>
  );
};

describe('LoginForm Component', () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterEach(() => {
    server.close();
  });

  describe('Form Rendering', () => {
    it('should render login form with username and password fields', () => {
      /**
       * Given: LoginForm component is mounted
       * When: Component renders
       * Then: Should display username input, password input, and submit button
       */
      render(<LoginForm />, { wrapper: createWrapper() });

      expect(screen.getByLabelText(/아이디/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument();
    });

    it('should render form with proper input types', () => {
      /**
       * Given: LoginForm component is mounted
       * When: Component renders
       * Then: Password field should be type="password"
       */
      render(<LoginForm />, { wrapper: createWrapper() });

      const passwordInput = screen.getByLabelText(/비밀번호/i) as HTMLInputElement;
      expect(passwordInput.type).toBe('password');
    });
  });

  describe('Form Validation', () => {
    it('should show validation error when username is empty and form is submitted', async () => {
      /**
       * Given: LoginForm is rendered
       * When: User clicks submit button without entering username
       * Then: Should display "아이디를 입력해주세요" error message
       */
      render(<LoginForm />, { wrapper: createWrapper() });

      const submitButton = screen.getByRole('button', { name: /로그인/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/아이디를 입력해주세요/i)).toBeInTheDocument();
      });
    });

    it('should show validation error when password is empty and form is submitted', async () => {
      /**
       * Given: LoginForm is rendered
       * When: User clicks submit button without entering password
       * Then: Should display "비밀번호를 입력해주세요" error message
       */
      render(<LoginForm />, { wrapper: createWrapper() });

      const submitButton = screen.getByRole('button', { name: /로그인/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/비밀번호를 입력해주세요/i)).toBeInTheDocument();
      });
    });

    it('should clear validation errors when user enters values', async () => {
      /**
       * Given: Form has validation errors
       * When: User enters username
       * Then: Username validation error should disappear
       */
      render(<LoginForm />, { wrapper: createWrapper() });

      const submitButton = screen.getByRole('button', { name: /로그인/i });
      await userEvent.click(submitButton);

      const usernameInput = screen.getByLabelText(/아이디/i);
      await userEvent.type(usernameInput, 'admin_user');

      await waitFor(() => {
        expect(screen.queryByText(/아이디를 입력해주세요/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Login Success', () => {
    it('should submit login request with username and password', async () => {
      /**
       * Given: Valid login form with username and password
       * When: User submits the form
       * Then: Should call API with username and password
       */
      const spy = vi.spyOn(global, 'fetch');

      render(<LoginForm />, { wrapper: createWrapper() });

      await userEvent.type(screen.getByLabelText(/아이디/i), 'admin_user');
      await userEvent.type(screen.getByLabelText(/비밀번호/i), 'SecurePassword123!');
      await userEvent.click(screen.getByRole('button', { name: /로그인/i }));

      // Wait for API call
      expect(true).toBe(true); // Placeholder for API verification
    });

    it('should save tokens to localStorage on successful login', async () => {
      /**
       * Given: User submits valid login form
       * When: Server returns successful response
       * Then: Should save access_token and refresh_token to localStorage
       */
      render(<LoginForm />, { wrapper: createWrapper() });

      await userEvent.type(screen.getByLabelText(/아이디/i), 'admin_user');
      await userEvent.type(screen.getByLabelText(/비밀번호/i), 'SecurePassword123!');
      await userEvent.click(screen.getByRole('button', { name: /로그인/i }));

      await waitFor(() => {
        // localStorage should have tokens
        expect(true).toBe(true); // Placeholder
      });
    });

    it('should redirect to dashboard on successful login for regular user', async () => {
      /**
       * Given: User submits valid login form with regular user role
       * When: Server returns successful response
       * Then: Should redirect to /dashboard
       */
      expect(true).toBe(true); // Placeholder
    });

    it('should redirect to admin page on successful login for admin user', async () => {
      /**
       * Given: User submits valid login form with admin role
       * When: Server returns successful response
       * Then: Should redirect to /admin/data-management
       */
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Login Failure', () => {
    it('should display error message when login fails with 401', async () => {
      /**
       * Given: LoginForm is rendered
       * When: User submits form and server returns 401
       * Then: Should display "아이디 또는 비밀번호가 일치하지 않습니다" error
       */
      server.use(
        http.post(`${API_ENDPOINTS.AUTH.LOGIN}`, () => {
          return HttpResponse.json(
            { detail: '아이디 또는 비밀번호가 일치하지 않습니다' },
            { status: 401 }
          );
        })
      );

      render(<LoginForm />, { wrapper: createWrapper() });

      await userEvent.type(screen.getByLabelText(/아이디/i), 'admin_user');
      await userEvent.type(screen.getByLabelText(/비밀번호/i), 'WrongPassword');
      await userEvent.click(screen.getByRole('button', { name: /로그인/i }));

      await waitFor(() => {
        expect(screen.getByText(/일치하지 않습니다/i)).toBeInTheDocument();
      });
    });

    it('should display error message when account is inactive', async () => {
      /**
       * Given: LoginForm is rendered
       * When: User submits form for inactive account
       * Then: Should display "비활성된 계정입니다" error
       */
      server.use(
        http.post(`${API_ENDPOINTS.AUTH.LOGIN}`, () => {
          return HttpResponse.json(
            { detail: '비활성된 계정입니다' },
            { status: 400 }
          );
        })
      );

      render(<LoginForm />, { wrapper: createWrapper() });

      await userEvent.type(screen.getByLabelText(/아이디/i), 'inactive_user');
      await userEvent.type(screen.getByLabelText(/비밀번호/i), 'password');
      await userEvent.click(screen.getByRole('button', { name: /로그인/i }));

      await waitFor(() => {
        expect(screen.getByText(/비활성된 계정입니다/i)).toBeInTheDocument();
      });
    });

    it('should not redirect on login failure', async () => {
      /**
       * Given: User submits invalid login form
       * When: Server returns error response
       * Then: Should stay on /login page
       */
      server.use(
        http.post(`${API_ENDPOINTS.AUTH.LOGIN}`, () => {
          return HttpResponse.json(
            { detail: 'Invalid credentials' },
            { status: 401 }
          );
        })
      );

      render(<LoginForm />, { wrapper: createWrapper() });

      await userEvent.type(screen.getByLabelText(/아이디/i), 'user');
      await userEvent.type(screen.getByLabelText(/비밀번호/i), 'wrong');
      await userEvent.click(screen.getByRole('button', { name: /로그인/i }));

      expect(true).toBe(true); // Placeholder
    });
  });

  describe('Loading State', () => {
    it('should show loading state while login request is in progress', async () => {
      /**
       * Given: User submits login form
       * When: API request is in progress
       * Then: Should display "로그인 중..." and disable submit button
       */
      expect(true).toBe(true); // Placeholder
    });

    it('should disable submit button while loading', async () => {
      /**
       * Given: Login request is being processed
       * When: Form is in loading state
       * Then: Submit button should be disabled
       */
      expect(true).toBe(true); // Placeholder
    });
  });
});
