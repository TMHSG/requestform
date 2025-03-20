// export const state = () => ({
//   user: {
//     Id: null,
//     Name: '',
//     UserName: '',
//     PassWord: '',
//     Role: '',
//   },
//   isLoggedIn: false,
// })

// export const mutations = {
//   SET_USER_INFO(state, userInfo) {
//     state.user.Id = userInfo.Id
//     state.user.UserName = userInfo.UserName
//     state.user.PassWord = userInfo.PassWord
//     state.user.Role = userInfo.Role
//     state.user.Name = userInfo.Name
//     state.isLoggedIn = true
//   },
//   SET_LOGOUT_STATUS(state, status) {
//     state.isLoggedIn = status
//     if (!status) {
//       state.user = {
//         Id: null,
//         UserName: '',
//         PassWord: '',
//         Role: '',
//         Name: '',
//       }
//     }
//   },
// }

// export const actions = {
//   async login({ commit }, { Id, UserName, PassWord, Role, Name }) {
//     try {
//       const response = await this.$axios.post('/login', {
//         Id,
//         UserName,
//         PassWord,
//         Role,
//         Name,
//       })
//       if (response.status === 200) {
//         const { Id, UserName, PassWord, Role, Name } = response.data

//         // Gọi mutation để cập nhật thông tin người dùng vào Vuex
//         commit('SET_USER_INFO', { Id, UserName, PassWord, Role, Name })
//         commit('SET_LOGOUT_STATUS', false) // Đặt isLoggedIn thành true
//       } else {
//         // Xử lý khi đăng nhập không thành công
//       }
//     } catch (error) {
//       // Xử lý lỗi
//     }
//   },
// }
// store/auth.js

export const state = () => ({
  user: {
    Id: null,
    Name: '',
    UserName: '',
    Role: '',
  },
  isLoggedIn: false,
  authToken: null,
});

export const mutations = {
  SET_USER_INFO(state, userInfo) {
    state.user = userInfo;
    state.isLoggedIn = true;
  },
  SET_LOGOUT_STATUS(state) {
    state.isLoggedIn = false;
    state.user = {
      Id: null,
      UserName: '',
      Name: '',
      Role: '',
    };
    state.authToken = null;
    // Xóa token khỏi localStorage hoặc cookie nếu sử dụng
    localStorage.removeItem('authToken');
  },
  SET_AUTH_TOKEN(state, token) {
    state.authToken = token;
    // Lưu token vào localStorage hoặc cookie để duy trì trạng thái đăng nhập
    localStorage.setItem('authToken', token);
  },
};

export const actions = {
  async login({ commit }, { Id, UserName, Name, Role }) {
    try {
      // Gọi API để đăng nhập
      const response = await this.$axios.post('/login', { Id, UserName, Name, Role });
      if (response.status === 200) {
        const { Id, UserName, Name, Role } = response.data;

        // Gọi mutation để cập nhật thông tin người dùng và token vào Vuex
        commit('SET_USER_INFO', { Id, UserName, Name, Role });
        commit('SET_AUTH_TOKEN', response.data.token);
      } else {
        // Xử lý khi đăng nhập không thành công
      }
    } catch (error) {
      // Xử lý lỗi
    }
  },
  logout({ commit }) {
    // Thực hiện đăng xuất bằng cách xóa dữ liệu trong store và localStorage/cookie
    commit('SET_LOGOUT_STATUS');
  },
};
