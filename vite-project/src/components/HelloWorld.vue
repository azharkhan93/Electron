<!-- eslint-disable no-undef -->
<!-- eslint-disable no-undef -->
<!-- <template>
  <div class="vue-tempalte">
    <form @submit.prevent="signUp">
      <h3>Admin Signup</h3>

      <div class="form-group">
        <label>Full Name</label>
        <input type="text" class="form-control form-control-lg" v-model="fullName" />
        <span class="error-message">{{ fullNameError }}</span>
      </div>
      <div class="form-group">
        <label>Email address</label>
        <input type="email" class="form-control form-control-lg" v-model="email" />
        <span class="error-message">{{ emailError }}</span>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" class="form-control form-control-lg" v-model="password" />
        <span class="error-message">{{ passwordError }}</span>
      </div>
      <div class="form-group">
        <label>Confirm Password</label>
        <input type="password" class="form-control form-control-lg" v-model="confirmPassword" />
        <span class="error-message">{{ confirmPasswordError }}</span>
      </div>
      <button type="submit" class="btn btn-dark btn-lg btn-block">Sign Up</button>
      <p class="forgot-password text-right">
        Already registered
        <router-link to="/login">sign in?</router-link>
      </p>
    </form>
  </div>
</template>

<script>
// import { ipcRenderer } from 'electron';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Signup',
  

  data() {
  
    
    return {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullNameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
    };
  },



    
 

  methods: {
    async signUp() {
      this.fullNameError = '';
      this.emailError = '';
      this.passwordError = '';
      this.confirmPasswordError = '';
      try {
        const response = await window.electron.ipcRenderer.invoke('saveUserDetails', {
          fullName: this.fullName,
          email: this.email,
          password: this.password
        });
        console.log(response);
      } catch (error) {
        console.error(error);
      }

      // let isValid = true;

      if (this.fullName.trim() === '') {
        this.fullNameError = 'Full name is required.';
        // isValid = false;
      }

      if (this.email.trim() === '') {
        this.emailError = 'Email address is required.';
        // isValid = false;
      } else if (!this.validateEmail(this.email)) {
        this.emailError = 'Invalid email address.';
        // isValid = false;
      }

      if (this.password.trim() === '') {
        this.passwordError = 'Password is required.';
        // isValid = false;
      } else if (this.password.length < 6) {
        this.passwordError = 'Password should be at least 6 characters.';
        // isValid = false;
      }

      if (this.confirmPassword.trim() === '') {
        this.confirmPasswordError = 'Please confirm the password.';
        // isValid = false;
      } else if (this.confirmPassword !== this.password) {
        this.confirmPasswordError = 'Passwords do not match.';
        // isValid = false;
      }
   
  },
}
 
  
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
  /* margin-top: 110px; */
  width: 550px;
  padding: 20px;
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h3 {
  text-align: center;
  color: purple;
  /* margin-bottom: 20px; */
}

.form-group {
  margin-bottom: 10px;
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
  width: 30%;
  padding: 10px;
  margin-top: 15px;
  font-size: 16px;
  margin-left: 70%;
}

.forgot-password {
  text-align: right;
  margin-top: 10px;
  margin-bottom: 4px;
}

.forgot-password a {
  color: #2554FF;
}
.error-message {
  color: red;
  font-size: small;
}

</style> -->
