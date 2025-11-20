'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import React, { createContext, useContext, useState, ReactNode } from 'react'

type AlertType = 'info' | 'success' | 'error'

type AlertContextType = {
  showAlert: (message: string, type?: AlertType) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState<AlertType>('info')

  const showAlert = (msg: string, alertType: AlertType = 'info') => {
    setMessage(msg)
    setType(alertType)
    setVisible(true)
    setTimeout(() => setVisible(false), 3000)
  }

  const typeStyles = {
    success: 'border-green-600 text-green-700 bg-green-50',
    error: 'border-red-600 text-red-700 bg-red-50',
    info: 'border-blue-600 text-blue-700 bg-blue-50',
  }

  const typeIcons: Record<AlertType, React.ReactNode> = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  }

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`
              fixed top-5 right-5 w-[300px] px-4 py-3 rounded-lg shadow-md 
              border-l-4 flex items-start gap-3 z-9999
              ${typeStyles[type]}
            `}
          >
            <div className="shrink-0 mt-0.5">{typeIcons[type]}</div>
            <div className="flex-1">
              <p className="font-medium text-sm">{message}</p>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (!context) throw new Error('useAlert must be used within an AlertProvider')
  return context
}
