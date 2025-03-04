<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-96 relative">
      <img
        src="https://godoycordoba.com/wp-content/uploads/2019/11/Logo-godoy-cordoba.svg"
        alt="Logo"
        class="h-10 mx-auto mb-4"
      />
      <h2 class="text-2xl font-semibold text-center text-[#002F6C] mb-4">
        {{ isEditing ? "Editar Usuario" : "Crear Usuario" }}
      </h2>
      <form @submit.prevent="save">
        <div class="space-y-3">
          <input
            v-model="localUser.nombre"
            placeholder="Nombre"
            class="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#78BE20] transition"
            required
          />
          <input
            v-model="localUser.apellidos"
            placeholder="Apellidos"
            class="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#78BE20] transition"
            required
          />
          <input
            v-model="localUser.cedula"
            placeholder="Cédula"
            class="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#78BE20] transition"
            required
          />
          <input
            v-model="localUser.correo"
            type="email"
            placeholder="Correo Electrónico"
            class="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#78BE20] transition"
            required
          />
          <input
            v-model="localUser.password"
            type="password"
            placeholder="Contraseña"
            class="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#78BE20] transition"
            required
          />
        </div>
        <div class="flex justify-between mt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-[#002F6C] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#001D4A] transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="bg-[#78BE20] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#5A8E17] transition"
          >
            {{ isEditing ? "Guardar Cambios" : "Crear Usuario" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "axios";

export default {
  props: {
    user: Object,
    index: Number,
  },
  data() {
    return {
      localUser: {
        nombre: "",
        apellidos: "",
        cedula: "",
        correo: "",
        password: "",
      },
      showPassword: false,
    };
  },
  computed: {
    isEditing() {
      return this.index !== null;
    },
  },
  watch: {
    user: {
      immediate: true,
      handler(newUser) {
        this.localUser = { ...newUser };
      },
    },
  },
  methods: {
    async save() {
      try {
        if (this.isEditing) {
          await this.updateUser();
        } else {
          await this.createUser();
        }
        this.$emit("close");
      } catch (error) {
        console.error("Error al guardar el usuario:", error);
        this.showErrorAlert("Hubo un error al guardar el usuario.");
      }
    },
    async createUser() {
      try {
        const response = await axios.post("/api/usuarios/", this.localUser);
        this.$emit("userSaved", response.data);
        this.showSuccessAlert("El usuario ha sido creado con éxito.");
      } catch (error) {
        console.error("Error al crear el usuario:", error);
        this.showErrorAlert("Hubo un error al crear el usuario.");
      }
    },
    async updateUser() {
      try {
        const response = await axios.put(
          `/api/usuarios/${this.localUser.id}`,
          this.localUser
        );
        this.$emit("userSaved", response.data);
        this.showSuccessAlert("El usuario ha sido actualizado con éxito.");
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        this.showErrorAlert("Hubo un error al actualizar el usuario.");
      }
    },
    showSuccessAlert(message) {
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: message,
        confirmButtonColor: "#78BE20",
        background: "#f4f4f4",
        iconColor: "#2f7f1f",
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    },
    showErrorAlert(message) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonColor: "#C8102E",
        background: "#f4f4f4",
        iconColor: "#b13e2a",
      });
    },
  },
};
</script>
