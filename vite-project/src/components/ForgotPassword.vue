<template>
    <div class="vue-tempalte">
      <form @submit="resetPassword">
        <h3>Forgot Password</h3>
        <div class="form-group">
          <label>Email address</label>
          <input type="email" class="form-control form-control-lg" v-model="email" />
        </div>
        <button type="submit" class="btn btn-dark btn-lg btn-block">Reset password</button>
      </form>
    </div>
  </template> 
  
  
  <script>
export default {
  name: 'ForgotPassword',

  data() {
    return {
      email: '',
      emailError: '',
    };
  },

  methods: {
    async resetPassword(event) {
        event.preventDefault();
      try {
        const response = await window.electron.ipcRenderer.invoke('forgotPassword', this.email);
        if (response.success) {
          console.log('Password reset token generated:', response.token);
          this.$router.push({
            name: 'resetPass',
            params: { token: response.token, email: this.email },
          });
          // Show success message to the user, maybe using a toast
        } else {
          console.log('User not found');
          // Show error message to the user, maybe using a toast
        }
      } catch (error) {
        console.error(error);
        
      }
    },
  },
};
</script>
  <style scoped>
  .vue-tempalte {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  form {
    width: 400px;
    padding: 20px;
    background: #ffffff;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    font-weight: bold;
  }
  
  input.form-control-lg {
    width: 100%;
    padding: 10px;
    font-size: 16px;
  }
  
  button.btn {
    width: 100%;
    padding: 10px;
    font-size: 16px;
  }
  
  .forgot-password {
    text-align: right;
    margin-top: 10px;
    margin-bottom: 4px;
  }
  
  .forgot-password a {
    color: #2554FF;
  }
  
  </style>