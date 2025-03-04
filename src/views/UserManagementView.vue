<template>
  <div class="p-8 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
    <div class="flex items-center justify-center mb-6 relative">
      <img
        src="https://godoycordoba.com/wp-content/uploads/2019/11/Logo-godoy-cordoba.svg"
        alt="Godoy Córdoba"
        class="h-12 absolute left-0"
      />
      <h2 class="text-3xl font-bold text-[#002F6C] text-center uppercase">
        Gestión de Usuarios
      </h2>
    </div>

    <div class="flex justify-between mb-4">
      <button
        @click="logout"
        class="bg-[#002F6C] text-white px-4 py-2 rounded shadow-md hover:bg-[#001D4A]"
      >
        Cerrar Sesión
      </button>
      <button
        @click="openUserModal(null)"
        class="bg-[#78BE20] text-white px-4 py-2 rounded shadow-md hover:bg-[#5A8E17]"
      >
        Agregar Usuario
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-300 rounded-lg shadow-md">
        <thead class="bg-[#FFD100] text-black">
          <tr>
            <th class="border border-gray-300 p-3">Nombre</th>
            <th class="border border-gray-300 p-3">Apellido</th>
            <th class="border border-gray-300 p-3">Cédula</th>
            <th class="border border-gray-300 p-3">Correo</th>
            <th class="border border-gray-300 p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in users"
            :key="index"
            class="text-center hover:bg-gray-50"
          >
            <td class="border border-gray-300 p-3">{{ user.nombre }}</td>
            <td class="border border-gray-300 p-3">{{ user.apellidos }}</td>
            <td class="border border-gray-300 p-3">{{ user.cedula }}</td>
            <td class="border border-gray-300 p-3">{{ user.correo }}</td>
            <td class="border border-gray-300 p-3 space-x-2">
              <button
                @click="openUserModal(index)"
                class="bg-[#002F6C] text-white px-3 py-1 rounded shadow-md hover:bg-[#001D4A]"
              >
                Editar
              </button>
              <button
                @click="deleteUser(index)"
                class="bg-[#C8102E] text-white px-3 py-1 rounded shadow-md hover:bg-[#A00E25]"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <UserModal
      v-if="isModalOpen"
      :user="selectedUser"
      :index="selectedIndex"
      @close="isModalOpen = false"
      @save="saveUser"
    />
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";
import UserModal from "@/components/UserModal.vue";

export default {
  components: { UserModal },
  data() {
    return {
      users: [],
      isModalOpen: false,
      selectedUser: null,
      selectedIndex: null,
    };
  },
  mounted() {
    const isAuthenticated = localStorage.getItem("loggedIn") === "true";
    if (!isAuthenticated) {
      this.$router.push("/");
    }
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get("/api/usuarios/");
        this.users = response.data;
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        Swal.fire("Error", "No se pudieron cargar los usuarios.", "error");
      }
    },

    logout() {
      localStorage.removeItem("loggedIn");
      this.$router.push("/");
    },

    openUserModal(index) {
      if (index !== null) {
        this.selectedUser = { ...this.users[index] };
        this.selectedIndex = index;
      } else {
        this.selectedUser = {
          nombre: "",
          apellidos: "",
          cedula: "",
          correo: "",
        };
        this.selectedIndex = null;
      }
      this.isModalOpen = true;
    },

    async saveUser(user, index) {
      if (index !== null) {
        try {
          await axios.put(`/api/usuarios/${user.id}`, user);
          this.users[index] = user;
          Swal.fire(
            "Usuario actualizado",
            "El usuario ha sido actualizado correctamente.",
            "success"
          );
        } catch (error) {
          Swal.fire("Error", "No se pudo actualizar el usuario.", "error");
          console.error(error);
        }
      } else {
        try {
          const response = await axios.post("/api/usuarios/", user);
          this.users.push(response.data);
          Swal.fire(
            "Usuario agregado",
            "El usuario ha sido agregado correctamente.",
            "success"
          );
        } catch (error) {
          Swal.fire("Error", "No se pudo agregar el usuario.", "error");
          console.error(error);
        }
      }

      this.fetchUsers();
      this.isModalOpen = false;
    },

    deleteUser(index) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#C8102E",
        cancelButtonColor: "#002F6C",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/api/usuarios/${this.users[index].id}`)
            .then(() => {
              this.users.splice(index, 1);
              Swal.fire(
                "Eliminado",
                "El usuario ha sido eliminado.",
                "success"
              );
            })
            .catch((error) => {
              Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
              console.error(error);
            });

          this.fetchUsers();
        }
      });
    },
  },
};
</script>
