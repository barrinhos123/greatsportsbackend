import { createSlice } from "@reduxjs/toolkit"

export const treinadoresSlice = createSlice({
  name: "treinadores",
  initialState: {
    value: [],
  },
  reducers: {
    settreinadores: (state, action) => {
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
export const { settreinadores } = treinadoresSlice.actions

export const selecttreinadores = state => state.treinadores.value

export default treinadoresSlice.reducer
