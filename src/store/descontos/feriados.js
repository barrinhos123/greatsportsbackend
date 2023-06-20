import { createSlice } from "@reduxjs/toolkit"

export const feriadosSlice = createSlice({
  name: "feriados",
  initialState: {
    value: "",
  },
  reducers: {
    setferiados: (state, action) => {
      state.value = JSON.stringify(action.payload)
    },
  },
})

// Action creators are generated for each case reducer function
export const { setferiados } = feriadosSlice.actions

export const selectferiados = state => state.feriados.value

export default feriadosSlice.reducer
