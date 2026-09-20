import React, { useState, useEffect } from 'react'

const OrderModal = ({ isOpen, onClose, item }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    protein: 'Grilled Chicken'
  })

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
  }, [isOpen])

  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.9)]" onClick={onClose} />
      <div className="relative bg-[var(--bg-surface)] border border-[var(--gold)]/20 w-full max-w-md p-8 text-[var(--cream)]">
        <h2 className="font-serif text-2xl mb-4">{item.name}</h2>
        <p className="text-sm text-gray-400 mb-6">Price: £{item.price.toFixed(2)}</p>
        
        {step === 1 ? (
          <button 
            onClick={() => setStep(2)}
            className="w-full bg-[var(--gold)] text-black py-3 uppercase tracking-widest text-xs font-bold"
          >
            Next
          </button>
        ) : (
          <button 
            onClick={onClose}
            className="w-full border border-[var(--gold)] text-[var(--gold)] py-3 uppercase tracking-widest text-xs font-bold"
          >
            Close
          </button>
        )}
      </div>
    </div>
  )
}

export default OrderModal
