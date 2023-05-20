import { createSlice } from "@reduxjs/toolkit"

export const classesSlice = createSlice({
  name: "classes",
  initialState: {
    value: [],
  },
  reducers: {
    setclasses: (state, action) => {
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
export const { setclasses } = classesSlice.actions

export const selectclasses = state => state.classes.value

export default classesSlice.reducer
