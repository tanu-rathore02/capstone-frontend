// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await axios.post("http://localhost:8080/api/login", credentials);
//       return response.data;
//     } catch (error) {
//       console.error("Login error:", error.response || error.message);
//       if (error.response) {
//         return rejectWithValue(error.response.data);
//       }
//       return rejectWithValue({ message: "Network Error" });
//     }
//   }
// );


// export const signupUser = createAsyncThunk(
//   "auth/signup",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post("http://localhost:8080/api/register", userData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );


// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     token: null,
//     status: "idle",
//     error: null,
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       localStorage.removeItem("token");
//       localStorage.removeItem("userId");
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.fulfilled, (state, action) => {
//         // Since the user data is at the root level of the response, adjust how you access it
//         const { id, name, mobileNumber, email, role, token } = action.payload;

//         // Set the state with the received user info and token
//         state.user = { id, name, mobileNumber, email, role };
//         state.token = token;

//         // Save token and user info in localStorage
//         localStorage.setItem("token", token);
//         localStorage.setItem("userId", id);
//       })
//       .addCase(signupUser.fulfilled, (state, action) => {
//         const { id, name, mobileNumber, email, role, token } = action.payload;
//         state.user = { id, name, mobileNumber, email, role };
//         state.token = token;
//         localStorage.setItem("token", token);
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.error = action.payload;
//       })
//       .addCase(signupUser.rejected, (state, action) => {
//         state.error = action.payload;
//       });
//   },
// });

// export const { logout } = authSlice.actions;

// export default authSlice.reducer;



import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequest } from "../../api/ApiManager"
import { LOGIN_API, CREATE_USER } from "../../api/ApiConstants";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
   
      const response = await new Promise((resolve, reject) => {
        postRequest(LOGIN_API, credentials, (res) => {
          if (res?.status === 200 || 201) {
            resolve(res); 
            localStorage.setItem("token", response.data.token);
          } else {
            reject(res);
            return rejectWithValue({ message: "Network Error" });
          }
        });
      });
      
     
      return response.data;
  }
  
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    
      const response = await new Promise((resolve, reject) => {
        postRequest(CREATE_USER, userData, (res) => {
          if (res?.status === 200) {
            resolve(res);
            localStorage.setItem("token", response.data.token);
          } else {
            reject(res);
            return rejectWithValue({ message: "Network Error" });
          }
        });
      });
    
    }
);



const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        // Since the user data is at the root level of the response, adjust how you access it
        const { id, name, mobileNumber, email, role, token } = action.payload;

        // Set the state with the received user info and token
        state.user = { id, name, mobileNumber, email, role };
        state.token = token;

        // Save token and user info in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", id);
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        const { id, name, mobileNumber, email, role, token } = action.payload;
        state.user = { id, name, mobileNumber, email, role };
        state.token = token;
        localStorage.setItem("token", token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
 