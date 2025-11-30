'use client'

import { useState, useEffect } from 'react'
import {
  CalendarIcon,
  EnvelopeIcon,
  SparklesIcon,
  WalletIcon,
  UserCircleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import {
  CalendarIcon as CalendarIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  SparklesIcon as SparklesIconSolid,
  WalletIcon as WalletIconSolid,
  UserCircleIcon as UserCircleIconSolid
} from '@heroicons/react/24/solid'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [activeView, setActiveView] = useState('calendar') // 'calendar', 'mailbox', 'foryou', 'wallet', 'profile'
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedMail, setSelectedMail] = useState(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  useEffect(() => {
    // Set default user if not logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      // Set a default user so dashboard works without login
      const defaultUser = { email: 'user@example.com', loggedIn: true, timestamp: Date.now() }
      localStorage.setItem('user', JSON.stringify(defaultUser))
      setUser(defaultUser)
    }
  }, [])

  // Sample calendar events
  const events = [
    { id: 1, date: new Date(2025, 0, 15), title: 'Team Meeting', time: '10:00 AM', type: 'meeting' },
    { id: 2, date: new Date(2025, 0, 18), title: 'Project Deadline', time: '5:00 PM', type: 'deadline' },
    { id: 3, date: new Date(2025, 0, 20), title: 'Client Call', time: '2:00 PM', type: 'call' },
    { id: 4, date: new Date(2025, 0, 22), title: 'Workshop', time: '9:00 AM', type: 'workshop' },
  ]

  // Sample mailbox messages
  const messages = [
    { id: 1, from: 'John Smith', subject: 'Project Update', preview: 'Here is the latest update on the project...', time: '2 hours ago', unread: true, important: false },
    { id: 2, from: 'Sarah Johnson', subject: 'Meeting Notes', preview: 'Please find attached the meeting notes...', time: '5 hours ago', unread: true, important: true },
    { id: 3, from: 'Mike Davis', subject: 'Budget Approval', preview: 'The budget has been approved for Q1...', time: '1 day ago', unread: false, important: false },
    { id: 4, from: 'Emily Chen', subject: 'Team Lunch', preview: 'Would you like to join us for lunch?', time: '2 days ago', unread: false, important: false },
    { id: 5, from: 'David Wilson', subject: 'Report Ready', preview: 'The quarterly report is ready for review...', time: '3 days ago', unread: false, important: true },
  ]

  // Sample For You feed items
  const feedItems = [
    { id: 1, type: 'article', title: '10 Tips for Better Productivity', author: 'Jane Doe', time: '2 hours ago', image: null, likes: 245, comments: 32 },
    { id: 2, type: 'update', title: 'New Feature Released', author: 'Product Team', time: '5 hours ago', image: null, likes: 189, comments: 45 },
    { id: 3, type: 'tip', title: 'Weekly Productivity Tip', author: 'Expert Team', time: '1 day ago', image: null, likes: 312, comments: 67 },
    { id: 4, type: 'news', title: 'Industry News Update', author: 'News Team', time: '2 days ago', image: null, likes: 156, comments: 23 },
  ]

  // Sample wallet transactions
  const transactions = [
    { id: 1, type: 'income', description: 'Salary Payment', amount: 5000, date: '2025-01-10', category: 'Salary' },
    { id: 2, type: 'expense', description: 'Grocery Shopping', amount: -150, date: '2025-01-12', category: 'Food' },
    { id: 3, type: 'expense', description: 'Electricity Bill', amount: -85, date: '2025-01-13', category: 'Utilities' },
    { id: 4, type: 'income', description: 'Freelance Work', amount: 1200, date: '2025-01-14', category: 'Work' },
    { id: 5, type: 'expense', description: 'Restaurant', amount: -65, date: '2025-01-14', category: 'Food' },
  ]

  const totalBalance = transactions.reduce((sum, t) => sum + t.amount, 0)
  const monthlyIncome = transactions.filter(t => t.type === 'income' && new Date(t.date).getMonth() === currentMonth).reduce((sum, t) => sum + t.amount, 0)
  const monthlyExpenses = Math.abs(transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth).reduce((sum, t) => sum + t.amount, 0))

  // Calendar helpers
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getEventsForDate = (date) => {
    return events.filter(e => 
      e.date.getDate() === date &&
      e.date.getMonth() === currentMonth &&
      e.date.getFullYear() === currentYear
    )
  }

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const handleLogout = () => {
    // Reset to default user instead of redirecting
    const defaultUser = { email: 'user@example.com', loggedIn: true, timestamp: Date.now() }
    localStorage.setItem('user', JSON.stringify(defaultUser))
    setUser(defaultUser)
    setShowProfileMenu(false)
  }

  if (!user) {
    return null
  }

  const getInitials = (email) => {
    return email ? email.substring(0, 2).toUpperCase() : 'U'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Top Navigation Bar */}
      <div style={{ background: 'white', borderBottom: '2px solid #e9ecef', padding: '1rem 0' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-4">
              <h4 className="mb-0 fw-bold" style={{ color: '#14432A' }}>Dashboard</h4>
              <div className="input-group" style={{ width: '300px' }}>
                <span className="input-group-text bg-white border-end-0">
                  <MagnifyingGlassIcon style={{ width: '20px', height: '20px', color: '#6c757d' }} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search..."
                  style={{ borderLeft: 'none' }}
                />
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-outline-secondary border-0 position-relative">
                <BellIcon style={{ width: '24px', height: '24px' }} />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                  3
                </span>
              </button>
              <div className="position-relative">
                <button
                  className="btn btn-outline-secondary border-0 d-flex align-items-center gap-2"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {getInitials(user.email)}
                  </div>
                  <span className="d-none d-md-inline">{user.email}</span>
                </button>
                {showProfileMenu && (
                  <div className="position-absolute end-0 mt-2" style={{ zIndex: 1000, minWidth: '200px' }}>
                    <div className="card border-0 shadow-lg" style={{ borderRadius: '12px' }}>
                      <div className="card-body p-0">
                        <button
                          className="btn btn-link text-start w-100 p-3 border-bottom"
                          onClick={() => {
                            setActiveView('profile')
                            setShowProfileMenu(false)
                          }}
                        >
                          <UserCircleIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                          Profile
                        </button>
                        <button
                          className="btn btn-link text-start w-100 p-3 border-bottom"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Cog6ToothIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                          Settings
                        </button>
                        <button
                          className="btn btn-link text-start w-100 p-3 text-danger"
                          onClick={handleLogout}
                        >
                          <ArrowRightOnRectangleIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar Navigation */}
          <div className="col-md-3 col-lg-2 mb-4 mb-md-0">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', position: 'sticky', top: '20px' }}>
              <div className="card-body p-3">
                <nav className="nav flex-column gap-2">
                  <button
                    className={`btn text-start border-0 d-flex align-items-center gap-3 p-3 ${activeView === 'calendar' ? 'bg-primary text-white' : ''}`}
                    onClick={() => setActiveView('calendar')}
                    style={{
                      borderRadius: '12px',
                      backgroundColor: activeView === 'calendar' ? '#14432A' : 'transparent'
                    }}
                  >
                    {activeView === 'calendar' ? (
                      <CalendarIconSolid style={{ width: '24px', height: '24px' }} />
                    ) : (
                      <CalendarIcon style={{ width: '24px', height: '24px' }} />
                    )}
                    <span>Calendar</span>
                  </button>
                  <button
                    className={`btn text-start border-0 d-flex align-items-center gap-3 p-3 ${activeView === 'mailbox' ? 'bg-primary text-white' : ''}`}
                    onClick={() => setActiveView('mailbox')}
                    style={{
                      borderRadius: '12px',
                      backgroundColor: activeView === 'mailbox' ? '#14432A' : 'transparent'
                    }}
                  >
                    {activeView === 'mailbox' ? (
                      <EnvelopeIconSolid style={{ width: '24px', height: '24px' }} />
                    ) : (
                      <EnvelopeIcon style={{ width: '24px', height: '24px' }} />
                    )}
                    <span>Mailbox</span>
                    {messages.filter(m => m.unread).length > 0 && (
                      <span className="badge bg-danger ms-auto">{messages.filter(m => m.unread).length}</span>
                    )}
                  </button>
                  <button
                    className={`btn text-start border-0 d-flex align-items-center gap-3 p-3 ${activeView === 'foryou' ? 'bg-primary text-white' : ''}`}
                    onClick={() => setActiveView('foryou')}
                    style={{
                      borderRadius: '12px',
                      backgroundColor: activeView === 'foryou' ? '#14432A' : 'transparent'
                    }}
                  >
                    {activeView === 'foryou' ? (
                      <SparklesIconSolid style={{ width: '24px', height: '24px' }} />
                    ) : (
                      <SparklesIcon style={{ width: '24px', height: '24px' }} />
                    )}
                    <span>For You</span>
                  </button>
                  <button
                    className={`btn text-start border-0 d-flex align-items-center gap-3 p-3 ${activeView === 'wallet' ? 'bg-primary text-white' : ''}`}
                    onClick={() => setActiveView('wallet')}
                    style={{
                      borderRadius: '12px',
                      backgroundColor: activeView === 'wallet' ? '#14432A' : 'transparent'
                    }}
                  >
                    {activeView === 'wallet' ? (
                      <WalletIconSolid style={{ width: '24px', height: '24px' }} />
                    ) : (
                      <WalletIcon style={{ width: '24px', height: '24px' }} />
                    )}
                    <span>Wallet</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-md-9 col-lg-10">
            {/* Calendar View */}
            {activeView === 'calendar' && (
              <div>
                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
                  <div className="card-header bg-white border-0 p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-bold" style={{ color: '#14432A' }}>
                        {monthNames[currentMonth]} {currentYear}
                      </h5>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-secondary border-0"
                          onClick={() => navigateMonth('prev')}
                        >
                          <ArrowLeftIcon style={{ width: '20px', height: '20px' }} />
                        </button>
                        <button
                          className="btn btn-outline-secondary border-0"
                          onClick={() => {
                            setCurrentMonth(new Date().getMonth())
                            setCurrentYear(new Date().getFullYear())
                          }}
                        >
                          Today
                        </button>
                        <button
                          className="btn btn-outline-secondary border-0"
                          onClick={() => navigateMonth('next')}
                        >
                          <ArrowRightIcon style={{ width: '20px', height: '20px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-0">
                      {dayNames.map(day => (
                        <div key={day} className="col text-center fw-bold p-2" style={{ color: '#14432A' }}>
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="row g-0">
                      {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="col" style={{ aspectRatio: '1', padding: '4px' }}></div>
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, idx) => {
                        const date = idx + 1
                        const dayEvents = getEventsForDate(date)
                        const isToday = date === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()
                        return (
                          <div
                            key={date}
                            className="col position-relative"
                            style={{
                              aspectRatio: '1',
                              padding: '4px',
                              cursor: 'pointer'
                            }}
                            onClick={() => setSelectedDate(new Date(currentYear, currentMonth, date))}
                          >
                            <div
                              className={`d-flex flex-column h-100 p-2 ${isToday ? 'bg-primary text-white rounded' : ''}`}
                              style={{
                                border: isToday ? 'none' : '1px solid #e9ecef',
                                borderRadius: isToday ? '8px' : '4px',
                                backgroundColor: isToday ? '#14432A' : 'white'
                              }}
                            >
                              <span className={`fw-bold ${isToday ? 'text-white' : ''}`}>{date}</span>
                              {dayEvents.length > 0 && (
                                <div className="mt-auto">
                                  {dayEvents.slice(0, 2).map(event => (
                                    <div
                                      key={event.id}
                                      className="small mb-1 p-1 rounded text-truncate"
                                      style={{
                                        backgroundColor: isToday ? 'rgba(255,255,255,0.2)' : '#e3f2fd',
                                        fontSize: '0.7rem'
                                      }}
                                    >
                                      {event.title}
                                    </div>
                                  ))}
                                  {dayEvents.length > 2 && (
                                    <div className="small text-muted">+{dayEvents.length - 2} more</div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                  <div className="card-header bg-white border-0 p-4">
                    <h5 className="mb-0 fw-bold" style={{ color: '#14432A' }}>Upcoming Events</h5>
                  </div>
                  <div className="card-body p-4">
                    {events
                      .filter(e => e.date >= new Date())
                      .sort((a, b) => a.date - b.date)
                      .slice(0, 5)
                      .map(event => (
                        <div key={event.id} className="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
                          <div
                            className="rounded d-flex align-items-center justify-content-center"
                            style={{
                              width: '50px',
                              height: '50px',
                              backgroundColor: '#e3f2fd',
                              color: '#14432A',
                              flexShrink: 0
                            }}
                          >
                            <CalendarIcon style={{ width: '24px', height: '24px' }} />
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold">{event.title}</h6>
                            <div className="d-flex align-items-center gap-2 text-muted small">
                              <ClockIcon style={{ width: '16px', height: '16px' }} />
                              {event.date.toLocaleDateString()} at {event.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    {events.filter(e => e.date >= new Date()).length === 0 && (
                      <p className="text-muted text-center py-4">No upcoming events</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mailbox View */}
            {activeView === 'mailbox' && (
              <div className="row">
                <div className="col-md-4 mb-4 mb-md-0">
                  <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', height: '600px' }}>
                    <div className="card-header bg-white border-0 p-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0 fw-bold" style={{ color: '#14432A' }}>Inbox</h5>
                        <button className="btn btn-primary btn-sm">
                          <PlusIcon style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search messages..."
                      />
                    </div>
                    <div className="card-body p-0" style={{ overflowY: 'auto', maxHeight: '500px' }}>
                      {messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`p-3 border-bottom ${selectedMail?.id === msg.id ? 'bg-light' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedMail(msg)}
                        >
                          <div className="d-flex align-items-start gap-2">
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                flexShrink: 0
                              }}
                            >
                              {msg.from.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-grow-1" style={{ minWidth: 0 }}>
                              <div className="d-flex justify-content-between align-items-start mb-1">
                                <h6 className={`mb-0 small ${msg.unread ? 'fw-bold' : ''}`}>
                                  {msg.from}
                                  {msg.important && (
                                    <span className="badge bg-danger ms-1" style={{ fontSize: '0.6rem' }}>!</span>
                                  )}
                                </h6>
                                <small className="text-muted">{msg.time}</small>
                              </div>
                              <p className="mb-1 small fw-bold text-truncate">{msg.subject}</p>
                              <p className="mb-0 small text-muted text-truncate">{msg.preview}</p>
                            </div>
                            {msg.unread && (
                              <div className="badge bg-primary rounded-circle" style={{ width: '8px', height: '8px', flexShrink: 0, marginTop: '4px' }}></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', minHeight: '600px' }}>
                    {selectedMail ? (
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-4">
                          <div>
                            <h4 className="fw-bold mb-2" style={{ color: '#14432A' }}>{selectedMail.subject}</h4>
                            <div className="d-flex align-items-center gap-3 text-muted">
                              <span>From: {selectedMail.from}</span>
                              <span>•</span>
                              <span>{selectedMail.time}</span>
                            </div>
                          </div>
                          {selectedMail.important && (
                            <span className="badge bg-danger">Important</span>
                          )}
                        </div>
                        <div className="border-top border-bottom py-4">
                          <p className="mb-0">{selectedMail.preview}</p>
                          <p className="mt-3 mb-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                          </p>
                          <p className="mt-3 mb-0">
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                          </p>
                        </div>
                        <div className="mt-4 d-flex gap-2">
                          <button className="btn btn-primary">Reply</button>
                          <button className="btn btn-outline-secondary">Forward</button>
                          <button className="btn btn-outline-danger">Delete</button>
                        </div>
                      </div>
                    ) : (
                      <div className="card-body d-flex align-items-center justify-content-center" style={{ minHeight: '600px' }}>
                        <div className="text-center">
                          <EnvelopeIcon style={{ width: '64px', height: '64px', color: '#dee2e6', marginBottom: '16px' }} />
                          <p className="text-muted">Select a message to read</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* For You Feed View */}
            {activeView === 'foryou' && (
              <div>
                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
                  <div className="card-header bg-white border-0 p-4">
                    <h5 className="mb-0 fw-bold" style={{ color: '#14432A' }}>For You</h5>
                    <p className="text-muted small mb-0 mt-2">Personalized content just for you</p>
                  </div>
                </div>
                <div className="row g-4">
                  {feedItems.map(item => (
                    <div key={item.id} className="col-md-6">
                      <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                        <div className="card-body p-4">
                          <div className="d-flex align-items-start gap-3 mb-3">
                            <div
                              style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                flexShrink: 0
                              }}
                            >
                              {item.author.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-1" style={{ color: '#14432A' }}>{item.title}</h6>
                              <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                                <span>{item.author}</span>
                                <span>•</span>
                                <span>{item.time}</span>
                              </div>
                              <span className="badge" style={{ backgroundColor: 'rgba(20, 67, 42, 0.1)', color: '#14432A' }}>
                                {item.type}
                              </span>
                            </div>
                          </div>
                          <p className="text-muted small mb-3">
                            This is a sample preview of the content. Click to read more about {item.title.toLowerCase()} and discover valuable insights...
                          </p>
                          <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                            <div className="d-flex gap-3">
                              <button className="btn btn-sm btn-outline-secondary border-0">
                                <span className="me-1">👍</span> {item.likes}
                              </button>
                              <button className="btn btn-sm btn-outline-secondary border-0">
                                <span className="me-1">💬</span> {item.comments}
                              </button>
                            </div>
                            <button className="btn btn-sm btn-primary">Read More</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wallet View */}
            {activeView === 'wallet' && (
              <div>
                <div className="row g-4 mb-4">
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm text-white" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)' }}>
                      <div className="card-body p-4">
                        <h6 className="mb-3 opacity-75">Total Balance</h6>
                        <h2 className="fw-bold mb-0">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <div
                            className="rounded d-flex align-items-center justify-content-center"
                            style={{
                              width: '50px',
                              height: '50px',
                              backgroundColor: '#d4edda',
                              color: '#155724'
                            }}
                          >
                            <CurrencyDollarIcon style={{ width: '24px', height: '24px' }} />
                          </div>
                          <div>
                            <h6 className="mb-0 text-muted small">Monthly Income</h6>
                            <h5 className="mb-0 fw-bold text-success">${monthlyIncome.toLocaleString()}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <div
                            className="rounded d-flex align-items-center justify-content-center"
                            style={{
                              width: '50px',
                              height: '50px',
                              backgroundColor: '#f8d7da',
                              color: '#721c24'
                            }}
                          >
                            <ChartBarIcon style={{ width: '24px', height: '24px' }} />
                          </div>
                          <div>
                            <h6 className="mb-0 text-muted small">Monthly Expenses</h6>
                            <h5 className="mb-0 fw-bold text-danger">${monthlyExpenses.toLocaleString()}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                  <div className="card-header bg-white border-0 p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-bold" style={{ color: '#14432A' }}>Recent Transactions</h5>
                      <button className="btn btn-primary btn-sm">
                        <PlusIcon style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                        Add Transaction
                      </button>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                          <tr>
                            <th className="border-0 p-3">Description</th>
                            <th className="border-0 p-3">Category</th>
                            <th className="border-0 p-3">Date</th>
                            <th className="border-0 p-3 text-end">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map(transaction => (
                            <tr key={transaction.id}>
                              <td className="p-3">
                                <div className="d-flex align-items-center gap-2">
                                  <div
                                    className="rounded d-flex align-items-center justify-content-center"
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      backgroundColor: transaction.type === 'income' ? '#d4edda' : '#f8d7da',
                                      color: transaction.type === 'income' ? '#155724' : '#721c24'
                                    }}
                                  >
                                    {transaction.type === 'income' ? '+' : '-'}
                                  </div>
                                  <span className="fw-bold">{transaction.description}</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="badge" style={{ backgroundColor: 'rgba(20, 67, 42, 0.1)', color: '#14432A' }}>
                                  {transaction.category}
                                </span>
                              </td>
                              <td className="p-3 text-muted">{transaction.date}</td>
                              <td className={`p-3 text-end fw-bold ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                                {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile View */}
            {activeView === 'profile' && (
              <div className="row">
                <div className="col-md-8">
                  <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
                    <div className="card-header bg-white border-0 p-4">
                      <h5 className="mb-0 fw-bold" style={{ color: '#14432A' }}>Profile Information</h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="text-center mb-4">
                        <div
                          style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #14432A 0%, #1a5436 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            margin: '0 auto'
                          }}
                        >
                          {getInitials(user.email)}
                        </div>
                        <h4 className="fw-bold mt-3 mb-1" style={{ color: '#14432A' }}>User Profile</h4>
                        <p className="text-muted">{user.email}</p>
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-bold">First Name</label>
                          <input type="text" className="form-control" defaultValue="John" />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-bold">Last Name</label>
                          <input type="text" className="form-control" defaultValue="Doe" />
                        </div>
                        <div className="col-12">
                          <label className="form-label small fw-bold">Email</label>
                          <input type="email" className="form-control" defaultValue={user.email} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-bold">Phone</label>
                          <input type="tel" className="form-control" defaultValue="+1 (555) 123-4567" />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small fw-bold">Location</label>
                          <input type="text" className="form-control" defaultValue="New York, NY" />
                        </div>
                        <div className="col-12">
                          <label className="form-label small fw-bold">Bio</label>
                          <textarea className="form-control" rows="4" defaultValue="Tell us about yourself..."></textarea>
                        </div>
                      </div>
                      <button className="btn btn-primary mt-3">Save Changes</button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                    <div className="card-body p-4">
                      <h6 className="fw-bold mb-3" style={{ color: '#14432A' }}>Account Settings</h6>
                      <div className="d-flex flex-column gap-2">
                        <button className="btn btn-outline-secondary text-start">
                          <Cog6ToothIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                          Preferences
                        </button>
                        <button className="btn btn-outline-secondary text-start">
                          <UserCircleIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                          Privacy
                        </button>
                        <button className="btn btn-outline-secondary text-start">
                          <BellIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                          Notifications
                        </button>
                        <button className="btn btn-outline-danger text-start mt-3" onClick={handleLogout}>
                          <ArrowRightOnRectangleIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
