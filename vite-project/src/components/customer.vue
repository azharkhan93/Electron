<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">Patient Management</a>
    <ul class="navbar-nav ms-auto">
      <li class="nav-item">
        <a class="nav-link" href="#" @click="handleLogout">Logout</a>
      </li>
    </ul>
  </nav>

  <div class="container">

    <div class="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded">
      <div class="navbar">

      </div>

      <div class="row">
        <div class="col-sm-3 mt-5 mb-4 text-red">
          <div class="search">
            <form class="form-inline">
              <input class="form-control mr-sm-2" type="search" placeholder="Search patient" aria-label="Search"
                v-model="searchQuery" />
            </form>
          </div>
        </div>
        <div class="col-sm-3 offset-sm-2 mt-5 mb-4 text-red" style="color:purple">
          <h2><b>Patient Details</b></h2>
        </div>
        <div class="col-sm-3 offset-sm-1 mt-5 mb-4 text-red">
          <button class="btn btn-primary" @click="handleShow" v-if="!show">Add New Patient</button>
        </div>
      </div>


      <!-- Form box -->
      <div class="row mt-4" v-if="show">
        <div class="col-sm-6 offset-sm-3">
          <div class="card">
            <div class="card-body">
              <form @submit.prevent="handleAddPatient">
                <div class="form-group">
                  <label for="name">Name</label>
                  <input type="text" class="form-control" id="name" v-model="newPatient.name">
                </div>
                <div class="form-group">
                  <label for="address">Address</label>
                  <input type="text" class="form-control" id="address" v-model="newPatient.address">
                </div>
                <div class="form-group">
                  <label for="phoneNumber">PhoneNumber</label>
                  <input type="text" class="form-control" id="phoneNumber" v-model="newPatient.phoneNumber">
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="text" class="form-control" id="email" v-model="newPatient.email">
                </div>
                <button type="submit" class="btn btn-primary">Save</button>
                <button type="button" class="btn btn-secondary" @click="handleClose">Cancel</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <EditPatientForm v-if="editingUser" :patient="editingUser" :handleUpdate="handleUpdatePatient"
        :handleCancel="handleCancelEdit" :patients="patients" />
      <div class="row">
        <div class="table-responsive">
          <table class="table table-striped table-hover table-bordered">
            <thead>
              <tr>
                <th @click="sort('name')">Name</th>
                <th @click="sort('address')">Address</th>
                <th @click="sort('phoneNumber')">PhoneNumber</th>
                <th @click="sort('email')">Email</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(patient, index) in paginatedPatients" :key="index">

                <td>{{ patient.name }}</td>
                <td>{{ patient.address }}</td>
                <td>{{ patient.phoneNumber }}</td>
                <td>{{ patient.email }}</td>
                <td>
                  <a href="#" class="view" title="View" data-toggle="tooltip" style="color: #10ab80">
                    <i class="material-icons">&#xE417;</i>
                  </a>
                  <a href="#" class="edit" title="Edit" data-toggle="tooltip" @click="handleEdit(patient)">
                    <i class="material-icons">&#xE254;</i>
                  </a>
                  <!-- <a href="#" class="edit" title="Edit" data-toggle="tooltip" @click="handleEdit(patient)">
                    <i class="material-icons">&#xE254;</i>
                  </a> -->


                  <a href="#" class="save" title="Save" data-toggle="tooltip" style="color: blue"
                    @click="handleSave(patient)">
                    <i class="material-icons">&#xE161;</i>
                  </a>
                  <a href="#" class="delete" title="Delete" data-toggle="tooltip" style="color: red"
                    @click="handleDelete(patient)">
                    <i class="material-icons">&#xE872;</i>
                  </a>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>

      <div class="row">
        <div class="col-sm-12">
          <nav>
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click="changePage(currentPage - 1)">Previous</a>
              </li>
              <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
                <a class="page-link" href="#" @click="changePage(page)">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click="changePage(currentPage + 1)">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//  import Editpateint from '../components/Editpateint.vue';
import EditPatientForm from './EditPatientForm.vue';
import { ref, reactive, computed, onMounted } from 'vue';


export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'customer',

  components: {
    EditPatientForm,
  },

  setup() {


    // const editingIndex = ref(-1);
    const show = ref(false);
    const patients = ref([]);
    const newPatient = ref({
      name: '',
      address: '',
      phoneNumber: '',
      email: '',
    });
    const editingUser = ref(null);
    function handleEdit(patient) {
      editingUser.value = { ...patient };
    }
    function handleUpdatePatient(updatedPatient) {
      // Call your update logic here, e.g., sending updatedPatient to the database
      console.log('Updating patient:', updatedPatient);
      // After successful update, reset editingUser and fetch updated data
      editingUser.value = null;
      fetchPatients();
    }

    function handleCancelEdit() {
      editingUser.value = null;
    }

    // function handleEdit(user) {
    //   editingUser.value = { ...user };
    // }
    // function handleUpdateUser(updatedUser) {
    //   // Handle the update process, e.g., update in database and refresh users list
    //   console.log('Updating user:', updatedUser);
    //   editingUser.value = null; // Hide the edit form
    //   // Call fetchUsers() or similar to refresh the user list
    // }

    // let editingPatient = reactive({ name: '', address: '', email: '', phoneNumber: '' });

    const searchQuery = ref('');

    if (!searchQuery.value) {
      searchQuery.value = '';
    }

    const currentPage = ref(1);
    const itemsPerPage = ref(6);
    const sortBy = ref('');
    const sortDirection = ref('asc');

    function handleShow() {
      console.log('handleShow function called');
      show.value = true;
    }

    function handleClose() {
      console.log('handleClose function called');
      show.value = false;
    }
    async function handleAddPatient() {
      try {
        const response = await window.electron.ipcRenderer.invoke('savePatientDetails', {
          name: newPatient.value.name,
          address: newPatient.value.address,
          phoneNumber: newPatient.value.phoneNumber,
          email: newPatient.value.email
        });
        console.log(response);
        newPatient.value = {
          name: '',
          address: '',
          phoneNumber: '',
          email: '',
        };
        show.value = false;
        fetchPatients();

      } catch (error) {
        console.error('Error saving patient details:', error);
      }
    }

    async function fetchPatients() {
      try {
        const patientsFromDB = await window.electron.ipcRenderer.invoke('fetchPatients');
        patients.value = patientsFromDB;
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }

    onMounted(() => {
      fetchPatients();
    });

    async function handleDelete(patient) {
      try {
        const confirmation = confirm('Are you sure you want to delete this patient?');
        if (confirmation) {
          await window.electron.ipcRenderer.invoke('deletePatient', patient.id);
          patients.value = patients.value.filter(p => p.id !== patient.id);
        }
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }

    const filteredPatients = computed(() => {
      const query = searchQuery.value ? searchQuery.value.toLowerCase() : '';
      if (!query) {
        return patients.value;
      }
      return patients.value.filter(
        (patient) =>
          patient.name.toLowerCase().includes(query) ||
          patient.address.toLowerCase().includes(query) ||
          patient.phoneNumber.toLowerCase().includes(query) ||
          patient.email.toLowerCase().includes(query)
      );
    });

    const sortedPatients = computed(() => {
      const field = sortBy.value;
      const direction = sortDirection.value === 'asc' ? 1 : -1;
      if (!field) {
        return filteredPatients.value;
      }
      return filteredPatients.value.slice().sort((a, b) => {
        if (a[field] < b[field]) {
          return -1 * direction;
        }
        if (a[field] > b[field]) {
          return 1 * direction;
        }
        return 0;
      });
    });

    const totalPages = computed(() => {
      return Math.ceil(sortedPatients.value.length / itemsPerPage.value);
    });

    const paginatedPatients = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return sortedPatients.value.slice(start, end);
    });

    function sort(field) {
      if (sortBy.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortBy.value = field;
        sortDirection.value = 'asc';
      }
    }

    function changePage(page) {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    }
    const handleLogout = () => {
      localStorage.removeItem('userToken');
      console.log('User token removed. Logging out...')
      window.location.href = '/login';
    };

    return {
      show,

      patients,
      newPatient,
      // handleEdit,
      searchQuery,
      currentPage,
      itemsPerPage,
      sortBy,
      sortDirection,
      handleShow,
      handleClose,
      handleAddPatient,
      filteredPatients,
      sortedPatients,
      totalPages,
      paginatedPatients,
      handleDelete,
      // handleSave,
      // handleUpdateUser,
      editingUser,
      handleEdit,
      handleUpdatePatient,
      handleCancelEdit,
      sort,
      changePage,
      handleLogout,
      fetchPatients

    };

  },

};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Material+Icons');
@import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');



.crud {
  color: blueviolet;
}

.search {
  margin-top: 10px;
  width: 60%;
  font: bold
}

.form-inline {
  color: aqua
}

.table-responsive {
  color: brown
}

.table {
  margin-bottom: 10px;
}

.model_box {
  padding: 5px;
}

.row {
  margin-bottom: 25px;
}

.btn {
  margin: 5px;
}
</style>