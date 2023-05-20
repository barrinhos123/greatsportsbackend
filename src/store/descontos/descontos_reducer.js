import { createSlice } from "@reduxjs/toolkit"

export const descontosSlice = createSlice({
  name: "descontos",
  initialState: {
    value: "",
  },
  reducers: {
    setdescontos: (state, action) => {
      state.value = JSON.stringify(action.payload)
    },
  },
})

// Action creators are generated for each case reducer function
export const { setdescontos } = descontosSlice.actions

export const selectdescontos = state => state.descontos.value

export default descontosSlice.reducer
