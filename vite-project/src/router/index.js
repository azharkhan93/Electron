import { createRouter, createWebHistory } from 'vue-router';

import Signup from '../components/Signup.vue';
import Login from '../components/Login.vue';

import ForgotPassword from '../components/ForgotPassword.vue';
import customer from '../components/customer.vue';
// import Editpateint from '../components/Editpateint.vue';
import EditPateintForm from '../components/EditPatientForm.vue';
import resetPass from '../components/resetPass.vue';
// import EditpateintVue from '../components/Editpateint.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      name: 'Signup',
      component: Signup,
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
      
    },
    
      
    {
      path: '/Forgotpassword',
      name: 'Forgotpassword',
      component: ForgotPassword,
    },
    
    {
      path: '/customer', 
      name: 'custmoer',
      component: customer,
    },

    {
      path: '/EditPateintForm', 
      name: 'EditPatientForm',
      component: EditPateintForm,
    },

     {
      path: '/resetPass/:token/:email',
        name: 'resetPass',
        component: resetPass,
       
        
      
        
    },

    
  ]
});


export default router;

