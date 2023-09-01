<template>
  <div>
    <h2>Edit Patient</h2>
    <form @submit.prevent="handleUpdatePatient">
      <div class="form-group">
        <label for="editName">EditName:</label>
        <input type="text" class="form-control" id="editName" v-model="editPatient.name">
      </div>
      <div class="form-group">
        <label for="editAddress">EditAddress:</label>
        <input type="text" class="form-control" id="editAddress" v-model="editPatient.address">
      </div>
      <div class="form-group">
        <label for="editPhoneNumber">EditPhone Number:</label>
        <input type="text" class="form-control" id="editPhoneNumber" v-model="editPatient.phoneNumber">
      </div>
      <div class="form-group">
        <label for="editEmail">EditEmail:</label>
        <input type="text" class="form-control" id="editEmail" v-model="editPatient.email">
      </div>
      <button type="submit" class="butn">Update</button>
      <button type="button" @click="handleCancel">Cancel</button>
    </form>
  </div>
</template>

<script>
// const { ipcRenderer } = require('electron');

export default {
  props: {
    patient: Object,
    handleUpdate: Function,
    handleCancel: Function,
    patients: Array,
  },
  data() {
    return {
      editPatient: { ...this.patient },
    };
  },
  methods: {
    async handleUpdatePatient() {
    try {
      const patientToUpdate = {
        id: this.editPatient.id,
        name: this.editPatient.name,
        address: this.editPatient.address,
        phoneNumber: this.editPatient.phoneNumber,
        email: this.editPatient.email,
      };
      const response = await window.electron.ipcRenderer.invoke(
        'updatePatientDetails',
        patientToUpdate
      );
      if (response.success) {
        console.log(response.message);
        const updatedIndex = this.patients.findIndex(p => p.id === patientToUpdate.id);
      if (updatedIndex !== -1) {
        this.patients[updatedIndex] = { ...patientToUpdate };
      }
      this.show = false;
        // You can perform additional actions here after successful update
      } else {
        console.error(response.message);
        // Handle the error case
      }
    } catch (error) {
      console.error('Error updating patient details:', error);
      // Handle the error case
    }
  },
    handleCancel() {
      this.handleCancel();
    },
  },
};
</script>

<style scoped>
.butn {
  margin-top: 10px;
  margin-right: 10px;
  margin-bottom: 15px;
  margin-left: 15%;
}
.form-group{
  width: 70%;
  margin-left: 10%;
}
</style>


  
  