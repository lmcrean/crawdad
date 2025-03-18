import { useState } from 'react'
import axios from 'axios'

export function UserLifecycleButton({ token, onSuccess, onError, className = '' }) {
  const [loading, setLoading] = useState(false)
  const [lifecycleData, setLifecycleData] = useState(null)
  const [error, setError] = useState(null)
  const [testUser, setTestUser] = useState(null)

  const generateTestUser = () => ({
    username: `testuser${Date.now()}`,
    password: `Test${Date.now()}!123`
  })

  const handleClick = async () => {
    if (!token) {
      setError('Please generate a JWT token first')
      return
    }

    setLoading(true)
    setError(null)
    setLifecycleData(null)
    
    try {
      const newTestUser = generateTestUser()
      setTestUser(newTestUser)
      const { data } = await axios.post('/api/auth/test/', newTestUser, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setLifecycleData(data)
      if (onSuccess) onSuccess(data)
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred'
      setError(errorMessage)
      if (onError) onError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getButtonColor = () => {
    if (loading) return 'bg-yellow-500'
    if (error) return 'bg-red-500'
    if (lifecycleData) return 'bg-green-500'
    return 'bg-blue-500'
  }

  const getContainerColor = () => {
    if (error) return 'bg-red-900/20'
    if (lifecycleData) return 'bg-green-900/20'
    return 'bg-gray-900/20'
  }

  const buttonClasses = `${getButtonColor()} text-white font-bold py-2 px-4 rounded transition-colors`
  const containerClasses = `${getContainerColor()} p-6 rounded-lg transition-colors duration-300 ${className}`

  return (
    <div className={containerClasses} data-testid="user-lifecycle-container">
      <button 
        onClick={handleClick} 
        disabled={loading}
        className={buttonClasses}
      >
        Test User Lifecycle
      </button>
      {testUser && lifecycleData && (
        <div className="mt-4 text-white">
          <h3 className="text-xl font-bold mb-2">Lifecycle Test Results:</h3>
          <div className="bg-black/30 p-3 rounded">
            <div className="mb-2" data-testid="test-username">
              <strong>Test Username:</strong> {testUser.username}
            </div>
            <div className="mb-2" data-testid="lifecycle-message">
              <strong>Message:</strong> {lifecycleData.message}
            </div>
            <div className="mb-2" data-testid="signup-status">
              <strong>Signup:</strong> {lifecycleData.details.signup}
            </div>
            <div className="mb-2" data-testid="signin-status">
              <strong>Sign In:</strong> {lifecycleData.details.signin}
            </div>
            <div data-testid="delete-status">
              <strong>Delete:</strong> {lifecycleData.details.delete}
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-400" data-testid="error-message">
          <span className="text-red-400">✗</span> Error: {error}
        </div>
      )}
    </div>
  )
} 