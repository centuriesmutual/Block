'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
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
  ArrowRightOnRectangleIcon,
  PhoneIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon
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
  const [showCallModal, setShowCallModal] = useState(false)
  const [calendarView, setCalendarView] = useState('month') // 'day', 'week', 'month'
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [currentShortIndex, setCurrentShortIndex] = useState(0)
  const [eventFormData, setEventFormData] = useState({
    title: '',
    time: '',
    endTime: '',
    location: '',
    notes: '',
    color: '#007AFF'
  })
  const [loadingEvents, setLoadingEvents] = useState(false)

  // Calendar events state
  const [events, setEvents] = useState([])

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
    
    // Load events from Supabase
    loadEvents()
  }, [])

  // Load events from Supabase
  const loadEvents = async () => {
    try {
      setLoadingEvents(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })

      if (error) {
        console.error('Error loading events:', error)
        // If table doesn't exist, use sample data
        setEvents([
          { id: 1, date: new Date(2025, 0, 15), title: 'Team Meeting', time: '10:00 AM', endTime: '11:00 AM', type: 'meeting', color: '#007AFF', location: 'Conference Room A', notes: 'Quarterly planning session' },
          { id: 2, date: new Date(2025, 0, 18), title: 'Project Deadline', time: '5:00 PM', endTime: '5:00 PM', type: 'deadline', color: '#FF3B30', location: '', notes: 'Submit final report' },
        ])
      } else if (data) {
        // Convert date strings to Date objects
        const formattedEvents = data.map(event => ({
          ...event,
          date: new Date(event.date)
        }))
        setEvents(formattedEvents)
      }
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoadingEvents(false)
    }
  }

  // Save event to Supabase
  const saveEvent = async (eventData) => {
    try {
      const eventToSave = {
        title: eventData.title,
        date: selectedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        time: eventData.time,
        end_time: eventData.endTime,
        location: eventData.location || '',
        notes: eventData.notes || '',
        color: eventData.color || '#007AFF',
        type: eventData.type || 'meeting'
      }

      if (editingEvent && editingEvent.id) {
        // Update existing event
        const { data, error } = await supabase
          .from('events')
          .update(eventToSave)
          .eq('id', editingEvent.id)
          .select()

        if (error) throw error

        // Update local state
        setEvents(events.map(e => 
          e.id === editingEvent.id 
            ? { ...editingEvent, ...eventToSave, date: selectedDate }
            : e
        ))
      } else {
        // Create new event
        const { data, error } = await supabase
          .from('events')
          .insert([eventToSave])
          .select()

        if (error) throw error

        // Add to local state
        if (data && data[0]) {
          setEvents([...events, { ...data[0], date: selectedDate }])
        }
      }

      setShowEventModal(false)
      setEditingEvent(null)
      setEventFormData({
        title: '',
        time: '',
        endTime: '',
        location: '',
        notes: '',
        color: '#007AFF'
      })
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Error saving event. Please try again.')
    }
  }

  // Delete event from Supabase
  const deleteEvent = async (eventId) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      // Update local state
      setEvents(events.filter(e => e.id !== eventId))
      setShowEventModal(false)
      setEditingEvent(null)
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Error deleting event. Please try again.')
    }
  }

  // Sample mailbox messages
  const messages = [
    { id: 1, from: 'John Smith', subject: 'Project Update', preview: 'Here is the latest update on the project...', time: '2 hours ago', unread: true, important: false },
    { id: 2, from: 'Sarah Johnson', subject: 'Meeting Notes', preview: 'Please find attached the meeting notes...', time: '5 hours ago', unread: true, important: true },
    { id: 3, from: 'Mike Davis', subject: 'Budget Approval', preview: 'The budget has been approved for Q1...', time: '1 day ago', unread: false, important: false },
    { id: 4, from: 'Emily Chen', subject: 'Team Lunch', preview: 'Would you like to join us for lunch?', time: '2 days ago', unread: false, important: false },
    { id: 5, from: 'David Wilson', subject: 'Report Ready', preview: 'The quarterly report is ready for review...', time: '3 days ago', unread: false, important: true },
  ]

  // Sample For You feed items (YouTube Shorts style)
  const shortsItems = [
    { id: 1, title: 'Market Update: Q1 2025 Outlook', author: 'Financial Advisor', time: '2 hours ago', likes: 1245, comments: 132, shares: 89, videoUrl: null, thumbnail: null },
    { id: 2, title: 'Investment Strategies for Beginners', author: 'Investment Expert', time: '5 hours ago', likes: 2189, comments: 245, shares: 156, videoUrl: null, thumbnail: null },
    { id: 3, title: 'Real Estate Market Trends', author: 'Real Estate Pro', time: '1 day ago', likes: 3312, comments: 367, shares: 234, videoUrl: null, thumbnail: null },
    { id: 4, title: 'Tax Planning Tips 2025', author: 'Tax Specialist', time: '2 days ago', likes: 2156, comments: 223, shares: 145, videoUrl: null, thumbnail: null },
    { id: 5, title: 'Retirement Planning Guide', author: 'Retirement Advisor', time: '3 days ago', likes: 1890, comments: 198, shares: 112, videoUrl: null, thumbnail: null },
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

  // Calculate calendar days for 5 rows (35 cells)
  const getCalendarDays = () => {
    const days = []
    const totalCells = 35 // 5 rows × 7 days
    
    // Days from previous month
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()
    
    // Start from the first day of the month
    const startDate = firstDayOfMonth
    
    // Add previous month days
    for (let i = startDate - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false
      })
    }
    
    // Add current month days
    for (let date = 1; date <= daysInMonth; date++) {
      days.push({
        date,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true
      })
    }
    
    // Add next month days to fill 35 cells
    const remainingCells = totalCells - days.length
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear
    
    for (let date = 1; date <= remainingCells; date++) {
      days.push({
        date,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false
      })
    }
    
    return days
  }

  const getEventsForDate = (date, month, year) => {
    return events.filter(e => {
      const eventDate = new Date(e.date)
      return eventDate.getDate() === date &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
    })
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
    localStorage.removeItem('user')
    window.location.href = 'https://centuriesmutual.com/login'
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
      <div style={{ background: 'white', borderBottom: '2px solid #e9ecef', padding: '0.75rem 0' }}>
        <div className="container-fluid px-3 px-md-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2 gap-md-4 flex-grow-1">
              <h4 className="mb-0 fw-bold" style={{ color: '#14432A', fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}>Dashboard</h4>
              <div className="input-group d-none d-md-flex" style={{ maxWidth: '300px', flexGrow: 1 }}>
                <span className="input-group-text bg-white border-end-0">
                  <MagnifyingGlassIcon style={{ width: '18px', height: '18px', color: '#6c757d' }} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search..."
                  style={{ borderLeft: 'none', fontSize: '0.875rem' }}
                />
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-outline-secondary border-0 position-relative d-none d-md-block">
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

      <div className="container-fluid px-2 px-md-4 py-3 py-md-4">
        <div className="row g-3">
          {/* Sidebar Navigation */}
          <div className="col-12 col-md-3 col-lg-2 mb-2 mb-md-0">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', position: 'sticky', top: '20px' }}>
              <div className="card-body p-2 p-md-3">
                <nav className="nav flex-column gap-1 gap-md-2">
                  <button
                    className={`btn text-start border-0 d-flex align-items-center gap-2 gap-md-3 p-2 p-md-3 ${activeView === 'calendar' ? 'bg-primary text-white' : ''}`}
                    onClick={() => setActiveView('calendar')}
                    style={{
                      borderRadius: '10px',
                      backgroundColor: activeView === 'calendar' ? '#14432A' : 'transparent',
                      fontSize: '0.875rem'
                    }}
                  >
                    {activeView === 'calendar' ? (
                      <CalendarIconSolid style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                    ) : (
                      <CalendarIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                    )}
                    <span className="d-none d-md-inline">Calendar</span>
                    <span className="d-md-none">Cal</span>
                  </button>
                  <button
                    className={`btn text-start border-0 d-flex align-items-center gap-2 gap-md-3 p-2 p-md-3 ${activeView === 'mailbox' ? 'bg-primary text-white' : ''}`}
                    onClick={() => setActiveView('mailbox')}
                    style={{
                      borderRadius: '10px',
                      backgroundColor: activeView === 'mailbox' ? '#14432A' : 'transparent',
                      fontSize: '0.875rem'
                    }}
                  >
                    {activeView === 'mailbox' ? (
                      <EnvelopeIconSolid style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                    ) : (
                      <EnvelopeIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                    )}
                    <span className="d-none d-md-inline">Mailbox</span>
                    <span className="d-md-none">Mail</span>
                    {messages.filter(m => m.unread).length > 0 && (
                      <span className="badge bg-danger ms-auto" style={{ fontSize: '0.65rem' }}>{messages.filter(m => m.unread).length}</span>
                    )}
                  </button>
                  <button
                    className={`btn text-start border-0 d-flex align-items-center gap-2 gap-md-3 p-2 p-md-3 ${activeView === 'foryou' ? 'bg-primary text-white' : ''}`}
                    onClick={() => setActiveView('foryou')}
                    style={{
                      borderRadius: '10px',
                      backgroundColor: activeView === 'foryou' ? '#14432A' : 'transparent',
                      fontSize: '0.875rem'
                    }}
                  >
                    {activeView === 'foryou' ? (
                      <SparklesIconSolid style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                    ) : (
                      <SparklesIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                    )}
                    <span className="d-none d-md-inline">For You</span>
                    <span className="d-md-none">Feed</span>
                  </button>
                  <button
                    className={`btn text-start border-0 d-flex align-items-center gap-2 gap-md-3 p-2 p-md-3 ${activeView === 'wallet' ? 'bg-primary text-white' : ''}`}
                    onClick={() => setActiveView('wallet')}
                    style={{
                      borderRadius: '10px',
                      backgroundColor: activeView === 'wallet' ? '#14432A' : 'transparent',
                      fontSize: '0.875rem'
                    }}
                  >
                    {activeView === 'wallet' ? (
                      <WalletIconSolid style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                    ) : (
                      <WalletIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                    )}
                    <span className="d-none d-md-inline">Wallet</span>
                    <span className="d-md-none">Wallet</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-12 col-md-9 col-lg-10">
            {/* Calendar View - Wide Symmetrical Apple Style */}
            {activeView === 'calendar' && (
              <div>
                {/* Calendar Header */}
                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                  <div className="card-body p-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
                      <h4 className="mb-0 fw-bold" style={{ fontSize: '1.5rem', color: '#1d1d1f' }}>
                        {monthNames[currentMonth]} {currentYear}
                      </h4>
                      <div className="d-flex gap-2 align-items-center">
                        <button
                          className="btn btn-sm border"
                          onClick={() => navigateMonth('prev')}
                          style={{ background: 'white', padding: '6px 12px', borderRadius: '8px' }}
                        >
                          <ArrowLeftIcon style={{ width: '18px', height: '18px' }} />
                        </button>
                        <button
                          className="btn btn-sm border"
                          onClick={() => {
                            setCurrentMonth(new Date().getMonth())
                            setCurrentYear(new Date().getFullYear())
                            setSelectedDate(new Date())
                          }}
                          style={{ background: 'white', padding: '6px 16px', borderRadius: '8px', fontSize: '0.875rem' }}
                        >
                          Today
                        </button>
                        <button
                          className="btn btn-sm border"
                          onClick={() => navigateMonth('next')}
                          style={{ background: 'white', padding: '6px 12px', borderRadius: '8px' }}
                        >
                          <ArrowRightIcon style={{ width: '18px', height: '18px' }} />
                        </button>
                        <button
                          className="btn btn-sm ms-2"
                          onClick={() => {
                            setEditingEvent(null)
                            setEventFormData({
                              title: '',
                              time: '',
                              endTime: '',
                              location: '',
                              notes: '',
                              color: '#007AFF'
                            })
                            setShowEventModal(true)
                          }}
                          style={{
                            background: '#007AFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 16px',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}
                        >
                          <PlusIcon style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                          New Event
                        </button>
                      </div>
                    </div>
                    
                    {/* Calendar Grid - Wide Symmetrical with 5 Rows */}
                    <div className="row g-0 mb-2 mb-md-3">
                      {dayNames.map(day => (
                        <div key={day} className="col text-center fw-semibold" style={{ fontSize: 'clamp(0.7rem, 2vw, 0.875rem)', color: '#86868b', padding: '6px 2px', fontWeight: '500' }}>
                          {day}
                        </div>
                      ))}
                    </div>
                    {/* Render 5 rows (35 cells) */}
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                      <div key={rowIndex} className="row g-0">
                        {getCalendarDays().slice(rowIndex * 7, (rowIndex + 1) * 7).map((day, cellIndex) => {
                          const dayEvents = getEventsForDate(day.date, day.month, day.year)
                          const isToday = day.date === new Date().getDate() && day.month === new Date().getMonth() && day.year === new Date().getFullYear()
                          const isSelected = selectedDate.getDate() === day.date && selectedDate.getMonth() === day.month && selectedDate.getFullYear() === day.year
                          return (
                            <div
                              key={`${rowIndex}-${cellIndex}`}
                              className="col position-relative"
                              style={{ aspectRatio: '1', padding: '2px', cursor: 'pointer' }}
                              onClick={() => setSelectedDate(new Date(day.year, day.month, day.date))}
                            >
                              <div
                                className="d-flex flex-column align-items-center justify-content-center h-100 rounded"
                                style={{
                                  background: isToday ? '#007AFF' : isSelected ? '#e5e5ea' : 'transparent',
                                  color: isToday ? 'white' : isSelected ? '#1d1d1f' : day.isCurrentMonth ? '#1d1d1f' : '#86868b',
                                  fontWeight: isToday || isSelected ? '600' : '400',
                                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                  minHeight: '40px',
                                  opacity: day.isCurrentMonth ? 1 : 0.4
                                }}
                              >
                                <span>{day.date}</span>
                                {dayEvents.length > 0 && day.isCurrentMonth && (
                                  <div className="d-flex flex-wrap justify-content-center" style={{ maxWidth: '100%', gap: '2px', marginTop: '2px' }}>
                                    {dayEvents.slice(0, 3).map(event => (
                                      <div
                                        key={event.id}
                                        style={{
                                          width: '4px',
                                          height: '4px',
                                          borderRadius: '50%',
                                          backgroundColor: event.color || '#007AFF'
                                        }}
                                      ></div>
                                    ))}
                                    {dayEvents.length > 3 && (
                                      <span style={{ fontSize: '0.55rem', color: isToday ? 'rgba(255,255,255,0.8)' : '#86868b' }}>
                                        +{dayEvents.length - 3}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Event List - Full Width */}
                <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                  <div className="card-body p-0">
                    <div className="p-4 border-bottom">
                      <h5 className="mb-0 fw-bold" style={{ fontSize: '1.1rem', color: '#1d1d1f' }}>
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </h5>
                    </div>
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                      {getEventsForDate(selectedDate.getDate(), selectedDate.getMonth(), selectedDate.getFullYear()).length > 0 ? (
                        getEventsForDate(selectedDate.getDate(), selectedDate.getMonth(), selectedDate.getFullYear()).map(event => (
                          <div
                            key={event.id}
                            className="p-4 border-bottom d-flex align-items-start gap-3"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setEditingEvent(event)
                              setShowEventModal(true)
                            }}
                          >
                            <div
                              style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: event.color || '#007AFF',
                                marginTop: '6px',
                                flexShrink: 0
                              }}
                            ></div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1 fw-bold" style={{ fontSize: '1rem', color: '#1d1d1f' }}>{event.title}</h6>
                              <div className="d-flex flex-wrap align-items-center gap-3 text-muted" style={{ fontSize: '0.875rem' }}>
                                <span>{event.time} - {event.endTime}</span>
                                {event.location && <span>• {event.location}</span>}
                              </div>
                              {event.notes && (
                                <p className="mb-0 mt-2 text-muted" style={{ fontSize: '0.875rem' }}>{event.notes}</p>
                              )}
                            </div>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm border-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setEditingEvent(event)
                                  setShowEventModal(true)
                                }}
                                style={{ padding: '4px 8px' }}
                              >
                                <PencilIcon style={{ width: '16px', height: '16px', color: '#86868b' }} />
                              </button>
                              <button
                                className="btn btn-sm border-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (window.confirm('Are you sure you want to delete this event?')) {
                                    deleteEvent(event.id)
                                  }
                                }}
                                style={{ padding: '4px 8px' }}
                              >
                                <TrashIcon style={{ width: '16px', height: '16px', color: '#ff3b30' }} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-5 text-center">
                          <p className="text-muted mb-0">No events scheduled for this day</p>
                            <button
                              className="btn btn-link mt-2 p-0"
                              onClick={() => {
                                setEditingEvent(null)
                                setEventFormData({
                                  title: '',
                                  time: '',
                                  endTime: '',
                                  location: '',
                                  notes: '',
                                  color: '#007AFF'
                                })
                                setShowEventModal(true)
                              }}
                              style={{ color: '#007AFF', textDecoration: 'none', fontSize: '0.875rem' }}
                            >
                              Create new event
                            </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mailbox View */}
            {activeView === 'mailbox' && (
              <div className="row g-3">
                <div className="col-12 col-md-4 mb-2 mb-md-0">
                  <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', height: 'calc(100vh - 250px)', minHeight: '400px' }}>
                    <div className="card-header bg-white border-0 p-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0 fw-bold" style={{ color: '#14432A' }}>Inbox</h5>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm"
                            onClick={() => setShowCallModal(true)}
                            style={{ background: '#007AFF', color: 'white', border: 'none' }}
                          >
                            <PhoneIcon style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button className="btn btn-primary btn-sm">
                            <PlusIcon style={{ width: '16px', height: '16px' }} />
                          </button>
                        </div>
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
                <div className="col-12 col-md-8">
                  <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', minHeight: '400px' }}>
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

            {/* For You Feed View - YouTube Shorts Style */}
            {activeView === 'foryou' && (
              <div style={{ height: 'calc(100vh - 200px)', overflow: 'hidden', position: 'relative' }}>
                <div
                  style={{
                    height: '100%',
                    overflowY: 'auto',
                    scrollSnapType: 'y mandatory',
                    scrollBehavior: 'smooth'
                  }}
                  onScroll={(e) => {
                    const scrollTop = e.target.scrollTop
                    const itemHeight = e.target.clientHeight
                    const newIndex = Math.round(scrollTop / itemHeight)
                    if (newIndex !== currentShortIndex && newIndex >= 0 && newIndex < shortsItems.length) {
                      setCurrentShortIndex(newIndex)
                    }
                  }}
                >
                  {shortsItems.map((item, index) => (
                    <div
                      key={item.id}
                      style={{
                        height: '100%',
                        minHeight: 'calc(100vh - 200px)',
                        scrollSnapAlign: 'start',
                        position: 'relative',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      {/* Content Card */}
                      <div className="container" style={{ maxWidth: '600px', padding: '2rem' }}>
                        <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
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
                                <h5 className="fw-bold mb-1" style={{ color: '#1d1d1f' }}>{item.title}</h5>
                                <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                                  <span>{item.author}</span>
                                  <span>•</span>
                                  <span>{item.time}</span>
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                height: '300px',
                                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1rem'
                              }}
                            >
                              <div className="text-center">
                                <SparklesIcon style={{ width: '64px', height: '64px', color: '#86868b', marginBottom: '1rem' }} />
                                <p className="text-muted mb-0">Video Content</p>
                              </div>
                            </div>
                            <p className="text-muted mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                              Watch this informative content about {item.title.toLowerCase()}. Get expert insights and valuable information to help you make better decisions.
                            </p>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="d-flex gap-3">
                                <button className="btn btn-outline-secondary border-0 d-flex flex-column align-items-center gap-1" style={{ padding: '8px 12px' }}>
                                  <HeartIcon style={{ width: '20px', height: '20px' }} />
                                  <span style={{ fontSize: '0.75rem' }}>{item.likes > 1000 ? `${(item.likes / 1000).toFixed(1)}K` : item.likes}</span>
                                </button>
                                <button className="btn btn-outline-secondary border-0 d-flex flex-column align-items-center gap-1" style={{ padding: '8px 12px' }}>
                                  <ChatBubbleLeftIcon style={{ width: '20px', height: '20px' }} />
                                  <span style={{ fontSize: '0.75rem' }}>{item.comments > 1000 ? `${(item.comments / 1000).toFixed(1)}K` : item.comments}</span>
                                </button>
                                <button className="btn btn-outline-secondary border-0 d-flex flex-column align-items-center gap-1" style={{ padding: '8px 12px' }}>
                                  <ShareIcon style={{ width: '20px', height: '20px' }} />
                                  <span style={{ fontSize: '0.75rem' }}>{item.shares > 1000 ? `${(item.shares / 1000).toFixed(1)}K` : item.shares}</span>
                                </button>
                              </div>
                              <button className="btn" style={{ background: '#007AFF', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 20px' }}>
                                Watch Now
                              </button>
                            </div>
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

      {/* Call Broker Modal */}
      {showCallModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          onClick={() => setShowCallModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
              <div className="modal-header border-0 p-4">
                <h5 className="modal-title fw-bold" style={{ color: '#1d1d1f' }}>Call Your Broker</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCallModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="text-center mb-4">
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px'
                    }}
                  >
                    <PhoneIcon style={{ width: '50px', height: '50px', color: 'white' }} />
                  </div>
                  <h4 className="fw-bold mb-2" style={{ color: '#1d1d1f' }}>John Smith</h4>
                  <p className="text-muted mb-1">Financial Advisor</p>
                  <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Centuries Mutual</p>
                </div>
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between p-3 border rounded mb-2" style={{ borderRadius: '12px' }}>
                    <div>
                      <p className="mb-0 fw-bold" style={{ fontSize: '0.875rem' }}>Phone</p>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.875rem' }}>+1 (555) 123-4567</p>
                    </div>
                    <a href="tel:+15551234567" className="btn" style={{ background: '#007AFF', color: 'white', borderRadius: '12px' }}>
                      <PhoneIcon style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                      Call Now
                    </a>
                  </div>
                  <div className="d-flex align-items-center justify-content-between p-3 border rounded" style={{ borderRadius: '12px' }}>
                    <div>
                      <p className="mb-0 fw-bold" style={{ fontSize: '0.875rem' }}>Email</p>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.875rem' }}>john.smith@centuriesmutual.com</p>
                    </div>
                    <a href="mailto:john.smith@centuriesmutual.com" className="btn btn-outline-secondary" style={{ borderRadius: '12px' }}>
                      Email
                    </a>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-muted small mb-0">Available Monday - Friday, 9 AM - 5 PM EST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          onClick={() => {
            setShowEventModal(false)
            setEditingEvent(null)
            setEventFormData({
              title: '',
              time: '',
              endTime: '',
              location: '',
              notes: '',
              color: '#007AFF'
            })
          }}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
              <div className="modal-header border-0 p-4">
                <h5 className="modal-title fw-bold" style={{ color: '#1d1d1f' }}>
                  {editingEvent ? 'Edit Event' : 'New Event'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEventModal(false)
                    setEditingEvent(null)
                    setEventFormData({
                      title: '',
                      time: '',
                      endTime: '',
                      location: '',
                      notes: '',
                      color: '#007AFF'
                    })
                  }}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-bold">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingEvent ? (editingEvent.title || '') : eventFormData.title}
                    onChange={(e) => {
                      if (editingEvent) {
                        setEditingEvent({ ...editingEvent, title: e.target.value })
                      } else {
                        setEventFormData({ ...eventFormData, title: e.target.value })
                      }
                    }}
                    placeholder="Event title"
                    required
                  />
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold">Start Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={editingEvent ? (editingEvent.time || '') : eventFormData.time}
                      onChange={(e) => {
                        if (editingEvent) {
                          setEditingEvent({ ...editingEvent, time: e.target.value })
                        } else {
                          setEventFormData({ ...eventFormData, time: e.target.value })
                        }
                      }}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold">End Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={editingEvent ? (editingEvent.endTime || '') : eventFormData.endTime}
                      onChange={(e) => {
                        if (editingEvent) {
                          setEditingEvent({ ...editingEvent, endTime: e.target.value })
                        } else {
                          setEventFormData({ ...eventFormData, endTime: e.target.value })
                        }
                      }}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingEvent ? (editingEvent.location || '') : eventFormData.location}
                    onChange={(e) => {
                      if (editingEvent) {
                        setEditingEvent({ ...editingEvent, location: e.target.value })
                      } else {
                        setEventFormData({ ...eventFormData, location: e.target.value })
                      }
                    }}
                    placeholder="Optional"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Notes</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={editingEvent ? (editingEvent.notes || '') : eventFormData.notes}
                    onChange={(e) => {
                      if (editingEvent) {
                        setEditingEvent({ ...editingEvent, notes: e.target.value })
                      } else {
                        setEventFormData({ ...eventFormData, notes: e.target.value })
                      }
                    }}
                    placeholder="Optional"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Color</label>
                  <div className="d-flex gap-2">
                    {['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#FF2D55'].map(color => (
                      <button
                        key={color}
                        type="button"
                        className="btn border"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: color,
                          border: (editingEvent ? editingEvent.color : eventFormData.color) === color ? '3px solid #1d1d1f' : '1px solid #e5e5ea'
                        }}
                        onClick={() => {
                          if (editingEvent) {
                            setEditingEvent({ ...editingEvent, color })
                          } else {
                            setEventFormData({ ...eventFormData, color })
                          }
                        }}
                      ></button>
                    ))}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-secondary flex-grow-1"
                    onClick={() => {
                      setShowEventModal(false)
                      setEditingEvent(null)
                      setEventFormData({
                        title: '',
                        time: '',
                        endTime: '',
                        location: '',
                        notes: '',
                        color: '#007AFF'
                      })
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn flex-grow-1"
                    style={{ background: '#007AFF', color: 'white' }}
                    onClick={() => {
                      const dataToSave = editingEvent || eventFormData
                      if (!dataToSave.title || !dataToSave.time) {
                        alert('Please fill in title and start time')
                        return
                      }
                      saveEvent(dataToSave)
                    }}
                  >
                    {editingEvent ? 'Save Changes' : 'Create Event'}
                  </button>
                  {editingEvent && editingEvent.id && (
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this event?')) {
                          deleteEvent(editingEvent.id)
                        }
                      }}
                    >
                      <TrashIcon style={{ width: '20px', height: '20px' }} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
