import React, { useEffect, useState } from "react"
import DateTimePicker from "react-datetime-picker"

function DatePickerComp() {
  const [value, onChange] = useState(new Date())

  return (
    <div>
      <DateTimePicker disableClock={true} onChange={onChange} value={value} />
    </div>
  )
}

export default DatePickerComp
