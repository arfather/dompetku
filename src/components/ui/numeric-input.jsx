'use client'

import * as React from "react"
import { Input } from "./input"

export function NumericInput({ 
  name, 
  id, 
  placeholder, 
  defaultValue, 
  value,
  onChange,
  required, 
  disabled,
  className,
  ...props 
}) {
  const [internalDisplayValue, setInternalDisplayValue] = React.useState("")
  const [internalRawValue, setInternalRawValue] = React.useState("")

  const formatNumber = (val) => {
    if (val === undefined || val === null || val === "") return ""
    const num = val.toString().replace(/\D/g, "")
    if (!num) return ""
    return new Intl.NumberFormat('id-ID').format(num)
  }

  // Handle controlled mode
  const isControlled = value !== undefined
  const currentRawValue = isControlled ? value.toString() : internalRawValue
  const currentDisplayValue = formatNumber(currentRawValue)

  React.useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== null) {
      const val = defaultValue.toString()
      setInternalRawValue(val)
      setInternalDisplayValue(formatNumber(val))
    }
  }, [defaultValue])

  const handleChange = (e) => {
    const inputValue = e.target.value
    const raw = inputValue.replace(/\D/g, "")
    
    if (!isControlled) {
      setInternalRawValue(raw)
      setInternalDisplayValue(formatNumber(raw))
    }
    
    if (onChange) {
      // Pass the raw number string to the parent
      onChange(raw)
    }
  }

  return (
    <div className="relative w-full group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium z-10 pointer-events-none group-focus-within:text-primary transition-colors">
        Rp
      </div>
      <Input
        type="text"
        id={id}
        placeholder={placeholder}
        className={`${className} pl-9 font-mono font-medium`}
        value={currentDisplayValue}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        {...props}
      />
      {name && (
        <input 
          type="hidden" 
          name={name} 
          value={currentRawValue} 
        />
      )}
    </div>
  )
}
