import { createSlice } from "@reduxjs/toolkit"

export const localizacaoSlice = createSlice({
  name: "localizacao",
  initialState: {
    value: "",
  },
  reducers: {
    setlocalizacao: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setlocalizacao } = localizacaoSlice.actions

export const selectlocalizacao = state => state.localizacao.value

export default localizacaoSlice.reducer
