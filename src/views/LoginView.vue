<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="w-96 bg-white p-6 rounded-lg shadow-lg relative">
      <img
        src="https://godoycordoba.com/wp-content/uploads/2019/11/Logo-godoy-cordoba.svg"
        alt="Logo"
        class="h-12 mx-auto mb-4"
      />
      <h2 class="text-2xl font-semibold text-center text-[#002F6C] mb-4">
        Inicio de Sesión
      </h2>
      <form @submit.prevent="login">
        <input
          v-model="email"
          type="email"
          placeholder="Correo"
          class="w-full p-2 border rounded mb-2"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          class="w-full p-2 border rounded mb-2"
          required
        />
        <button
          class="w-full bg-[#002F6C] text-white p-2 rounded shadow-md hover:bg-[#001D4A]"
        >
          Ingresar
        </button>
      </form>
      <button
        @click="openRegisterModal"
        class="bg-[#78BE20] mt-4 w-full text-white p-2 rounded shadow-md hover:bg-[#5A8E17]"
      >
        Registrarse
      </button>
    </div>
  </div>

  <UserModal
    v-if="isModalOpen"
    :user="newUser"
    :index="null"
    @close="isModalOpen = false"
    @save="registerUser"
  />
</template>

<script>
import Swal from "sweetalert2";
import UserModal from "@/components/UserModal.vue";
import axios from "axios";

export default {
  components: { UserModal },
  data() {
    return {
      email: "",
      password: "",
      isModalOpen: false,
      newUser: {
        Nombre: "",
        Apellidos: "",
        Cedula: "",
        Correo: "",
        Password: "",
      },
      users: [], // Lista de usuarios locales
    };
  },
  methods: {
    async login() {
      // Validación básica de los campos
      if (!this.email || !this.password) {
        Swal.fire({
          icon: "warning",
          title: "Campos incompletos",
          text: "Por favor, ingresa tanto el correo como la contraseña.",
        });
        return;
      }

      // Validar formato del correo
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(this.email)) {
        Swal.fire({
          icon: "error",
          title: "Correo inválido",
          text: "Por favor, ingresa un correo electrónico válido.",
        });
        return;
      }

      try {
        // Enviar la solicitud de login
        const response = await axios.post("/api/usuarios/login/", {
          correo: this.email,
          password: this.password,
        });
        console.log("LOGINPRUEBA", response);

        if (response.status === 200) {
          localStorage.setItem("loggedIn", "true");
          Swal.fire({
            icon: "success",
            title: "Bienvenido",
            text: "Inicio de sesión exitoso",
          }).then(() => {
            this.$router.push("/users"); // Redirigir al listado de usuarios
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Correo o contraseña incorrectos",
          });
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al intentar iniciar sesión.",
        });
      }
    },
    openRegisterModal() {
      this.newUser = {
        Nombre: "",
        Apellidos: "",
        Cedula: "",
        Correo: "",
        Password: "",
      };
      this.isModalOpen = true;
    },
    registerUser(user) {
      // Verificamos que el objeto user tenga los valores correctos antes de proceder
      if (
        !user.Nombre ||
        !user.Apellidos ||
        !user.Cedula ||
        !user.Correo ||
        !user.Password
      ) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor, complete todos los campos",
        });
        return;
      }

      // Verificar que el correo no esté registrado
      if (this.users.some((u) => u.Correo === user.Correo)) {
        Swal.fire({
          icon: "error",
          title: "Correo ya registrado",
          text: "Este correo ya está registrado. Intenta con otro.",
        });
        return;
      }

      // Agregar el nuevo usuario
      this.users.push(user);
      this.isModalOpen = false;

      Swal.fire("Éxito", "Usuario registrado correctamente", "success");
    },
  },
};
</script>
