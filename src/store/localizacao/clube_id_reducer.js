import { createSlice } from "@reduxjs/toolkit"

export const clubeidSlice = createSlice({
  name: "clubeid",
  initialState: {
    value: "",
  },
  reducers: {
    setclubeid: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setclubeid } = clubeidSlice.actions

export const selectclubeid = state => state.clubeid.value

export default clubeidSlice.reducer
