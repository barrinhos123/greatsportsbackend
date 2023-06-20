import { createSlice } from "@reduxjs/toolkit"

export const bloquearReservasSlice = createSlice({
  name: "bloquearReservas",
  initialState: {
    value: [],
  },
  reducers: {
    setbloquearReservas: (state, action) => {
        state.value = []
        /* while (state.value.length != 0) {
          state.value.pop()
        } */
        action.payload.forEach(element => {
          state.value.push(element)
        })
    },
  },
})

// Action creators are generated for each case reducer function
export const { setbloquearReservas } = bloquearReservasSlice.actions

export const selectbloquearReservas = state => state.bloquearReservas.value

export default bloquearReservasSlice.reducer
