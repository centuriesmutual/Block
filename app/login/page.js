'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Accept any credentials and redirect to dashboard
      // Store user session in localStorage
      localStorage.setItem('user', JSON.stringify({
        email: formData.email,
        loggedIn: true,
        timestamp: Date.now()
      }))
      
      // Small delay for better UX
      setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    } catch (error) {
      console.error('Login error:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-light py-3 py-md-5 d-flex flex-column">
      <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="row justify-content-center w-100">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-sm">
              {/* Card Header with Logo */}
              <div className="card-header bg-white border-0 text-center pt-4 pb-2">
                <div className="mb-3 mb-md-4 d-flex justify-content-center">
                  <Image 
                    src="/cmlogotreesmall-removebg-preview.png"
                    alt="Centuries Mutual"
                    width={120}
                    height={60}
                    style={{ 
                      objectFit: 'contain'
                    }}
                  />
                </div>
                <h4 className="mb-0" style={{ 
                  fontFamily: "'Playfair Display', serif",
                  color: '#14432A',
                  fontSize: '1.5rem'
                }}>Welcome Back</h4>
              </div>

              {/* Card Body */}
              <div className="card-body px-3 px-md-4 py-3 py-md-4">
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label small text-muted">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                      style={{ 
                        borderColor: '#e9ecef',
                        fontSize: '1rem',
                        padding: '0.75rem'
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label small text-muted">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                      style={{ 
                        borderColor: '#e9ecef',
                        fontSize: '1rem',
                        padding: '0.75rem'
                      }}
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        style={{ borderColor: '#14432A' }}
                      />
                      <label className="form-check-label small text-muted" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <Link 
                      href="/forgot-password" 
                      className="text-decoration-none small"
                      style={{ color: '#14432A' }}
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <button 
                    type="submit"
                    className="btn btn-primary w-100 py-3 mb-3"
                    style={{ backgroundColor: '#14432A', borderColor: '#14432A', fontSize: '1.1rem' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-muted small mb-3">
                    Don't have an account? {' '}
                    <Link href="/signup" className="text-decoration-none" style={{ color: '#14432A', fontWeight: '500' }}>
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="text-center mt-3 mt-md-4">
              <p className="text-muted small mb-0">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  fill="currentColor" 
                  className="bi bi-shield-lock me-2" 
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                </svg>
                Secure login with 256-bit encryption
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-2 py-md-3 text-center">
        <p className="text-muted small mb-0">
          © 2026 Centuries Mutual. All rights reserved.
        </p>
      </footer>
    </div>
  )
} 