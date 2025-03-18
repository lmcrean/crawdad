import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { UserLifecycleButton } from '../UserLifecycleButton'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: {} }))
  }
}))

describe('UserLifecycleButton - Axios Alignment', () => {
  const mockToken = 'test-token'
  
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should use the correct API URL pattern', async () => {
    render(<UserLifecycleButton token={mockToken} />)
    fireEvent.click(screen.getByRole('button'))
    
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringMatching(/^\/api\/auth\/test\/$/),
      expect.any(Object),
      expect.any(Object)
    )
  })

  it('should include required user data fields in request', () => {
    render(<UserLifecycleButton token={mockToken} />)
    fireEvent.click(screen.getByRole('button'))
    
    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        username: expect.stringMatching(/^testuser\d+$/),
        password: expect.stringMatching(/^Test\d+!123$/)
      }),
      expect.any(Object)
    )
  })

  it('should match API isolation pattern for auth endpoints', () => {
    render(<UserLifecycleButton token={mockToken} />)
    fireEvent.click(screen.getByRole('button'))
    
    // Verify URL follows /api/auth/test/ pattern
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringMatching(/^\/api\/auth\/test\/$/),
      expect.any(Object),
      expect.any(Object)
    )
  })

  it('should use consistent auth service prefix', () => {
    render(<UserLifecycleButton token={mockToken} />)
    fireEvent.click(screen.getByRole('button'))
    
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringMatching(/^\/api\/auth\//),
      expect.any(Object),
      expect.any(Object)
    )
  })

  it('should include authorization header', () => {
    render(<UserLifecycleButton token={mockToken} />)
    fireEvent.click(screen.getByRole('button'))
    
    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': `Bearer ${mockToken}`
        })
      })
    )
  })

  it('should generate valid test user data format', () => {
    render(<UserLifecycleButton token={mockToken} />)
    fireEvent.click(screen.getByRole('button'))
    
    const calls = vi.mocked(axios.post).mock.calls
    expect(calls.length).toBeGreaterThan(0)
    const [, requestData] = calls[0]
    
    // Verify username format
    expect(requestData.username).toMatch(/^testuser\d+$/)
    
    // Verify password meets requirements
    expect(requestData.password).toMatch(/^Test\d+!123$/)
    expect(requestData.password.length).toBeGreaterThan(8)
    expect(requestData.password).toMatch(/[A-Z]/) // Has uppercase
    expect(requestData.password).toMatch(/[a-z]/) // Has lowercase
    expect(requestData.password).toMatch(/[0-9]/) // Has number
    expect(requestData.password).toMatch(/[!]/) // Has special char
  })
})
