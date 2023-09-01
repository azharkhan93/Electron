<template>
    <div class="vue-template">
      <form @submit="resetPassword">
        <h3>Reset Password</h3>
        <div class="form-group">
          <label>Email address</label>
          <input type="email" class="form-control form-control-lg" v-model="email" required />
        </div>
        <div class="form-group">
          <label>New password</label>
          <input type="password" class="form-control form-control-lg" v-model="newPassword" required />
        </div>
        <div class="form-group">
          <label>Confirm password</label>
          <input type="password" class="form-control form-control-lg" v-model="confirmPassword" required />
        </div>
        <button type="submit" class="btn btn-dark btn-lg btn-block">Submit</button>
      </form>
    </div>
  </template>
  <script>
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  
  export default {
    // props: ['token', 'email'],
    data() {
      return {
        newPassword: '',
        confirmPassword: '',
      };
    },
 methods: {
      async resetPassword(event) {
        event.preventDefault();
  
        if (this.newPassword !== this.confirmPassword) {
          console.log('Passwords do not match');
          return;
        }
  
        try {
          const response = await window.electron.ipcRenderer.invoke('resetPassword', {
            token: this.$route.params.token, 
            newPassword: this.newPassword,
          });
  
          if (response.success) {
            console.log('Password reset successful:', response.message);
            toast.success('Password reset successful');
            this.$router.push('/login');
          } else {
            console.log('Password reset failed:', response.message);
            toast.error('Failed to reset password');
          }
        } catch (error) {
          console.error(error);
          toast.error('An error occurred while resetting password');
        }
      },
      mounted() {
    console.log('Token:', this.token); 
    console.log('Email:', this.email);
  },
    },
  };
  </script>
    
  
    
  <style scoped>
  .vue-template {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding-top: 50px;
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
  </style>