// Enviar turno con token
document.addEventListener('DOMContentLoaded', function () {
    // Registrar paciente con token
    const pacienteForm = document.querySelector('form[action="http://localhost:3000/"]');
    if (pacienteForm) {
        // Crear elemento para mostrar mensaje si no existe
        let mensajePaciente = document.getElementById('mensaje-paciente');
        if (!mensajePaciente) {
            mensajePaciente = document.createElement('div');
            mensajePaciente.id = 'mensaje-paciente';
            mensajePaciente.style.marginTop = '10px';
            pacienteForm.appendChild(mensajePaciente);
        }
        pacienteForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            mensajePaciente.textContent = '';
            const token = localStorage.getItem('token');
            if (!token) {
                mensajePaciente.textContent = 'Debes iniciar sesión para registrar un paciente.';
                mensajePaciente.style.color = '#c80011';
                return;
            }
            const formData = new FormData(pacienteForm);
            const payload = {
                dni: formData.get('dniPaciente'),
                nombre: formData.get('nombrePaciente'),
                apellido: formData.get('apellidoPaciente'),
                email: formData.get('emailPaciente')
            };
            try {
                const response = await fetch('/api/v1/pacientes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': token
                    },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                if (response.ok) {
                    mensajePaciente.textContent = 'Paciente registrado correctamente';
                    mensajePaciente.style.color = '#00c22d';
                    pacienteForm.reset();
                    setTimeout(function() {
                        window.location.href = 'http://localhost:3000/pacientes';
                    }, 1200);
                } else {
                    mensajePaciente.textContent = data.error || 'Error al registrar paciente';
                    mensajePaciente.style.color = '#c80011';
                }
            } catch (err) {
                mensajePaciente.textContent = 'Error de conexión con el servidor';
                mensajePaciente.style.color = '#c80011';
            }
        });
    }
    const turnoForm = document.querySelector('form[action="/api/v1/turnos"]');
    const mensajeTurno = document.getElementById('mensaje-turno');
    if (turnoForm) {
        turnoForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            mensajeTurno.textContent = '';
            const token = localStorage.getItem('token');
            if (!token) {
                mensajeTurno.textContent = 'Debes iniciar sesión para registrar un turno.';
                mensajeTurno.style.color = '#c80011';
                return;
            }
            const formData = new FormData(turnoForm);
            const payload = {
                fecha: formData.get('fecha'),
                hora: formData.get('hora'),
                motivo: formData.get('motivo'),
                pacienteId: formData.get('pacienteId')
            };
            try {
                const response = await fetch('/api/v1/turnos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': token
                    },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                if (response.ok) {
                    mensajeTurno.textContent = 'Turno registrado correctamente';
                    mensajeTurno.style.color = '#00c22d';
                    turnoForm.reset();
                    setTimeout(function() {
                        window.location.href = 'http://localhost:3000/turnos';
                    }, 1200);
                } else {
                    mensajeTurno.textContent = data.error || 'Error al registrar turno';
                    mensajeTurno.style.color = '#c80011';
                }
            } catch (err) {
                mensajeTurno.textContent = 'Error de conexión con el servidor';
                mensajeTurno.style.color = '#c80011';
            }
        });
    }
});

// Seleccionamos todos los botones dentro del contenedor ".funciones"
const botones = document.querySelectorAll('.funciones button.register-btn');

// Variable para saber si el usuario está logueado
let usuarioLogueado = false;

// Función para activar o desactivar "visualmente" los botones
function activarBotones(activar) {
    botones.forEach(boton => {
        if (activar) {
            boton.classList.remove('deshabilitado');
        } else {
            boton.classList.add('deshabilitado');
        }
    });
    usuarioLogueado = activar;
}

// Al cargar la página, "deshabilitamos" los botones visualmente
activarBotones(false);

// Escuchamos el envío del formulario de login
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const password = document.getElementById('password').value.trim();
    const loginContainer = document.querySelector('.login');

    loginContainer.classList.remove('success', 'error');
    document.getElementById('mensaje').textContent = '';

    if (!password) {
        document.getElementById('mensaje').textContent = 'Por favor ingrese la contraseña';
        loginContainer.classList.add('error');
        activarBotones(false);
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/v1/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            document.getElementById('mensaje').textContent = 'Inicio de sesión exitoso';
            loginContainer.classList.add('success');

            activarBotones(true);
        } else {
            document.getElementById('mensaje').textContent = data.error || 'Contraseña incorrecta';
            loginContainer.classList.add('error');
            activarBotones(false);
        }
    } catch (error) {
        document.getElementById('mensaje').textContent = 'Error de conexión con el servidor';
        loginContainer.classList.add('error');
        activarBotones(false);
    }
});

// Cuando alguien hace click en un botón "deshabilitado" mostramos alerta y bloqueamos acción
botones.forEach(boton => {
    boton.addEventListener('click', function (e) {
        if (!usuarioLogueado) {
            e.preventDefault();
            alert('No puedes acceder hasta que ingreses la contraseña correctamente.');
        }
    });
});
