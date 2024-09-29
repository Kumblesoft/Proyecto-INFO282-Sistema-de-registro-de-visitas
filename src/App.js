import React, { useState, useEffect } from 'react';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import DynamicForm from './components/DynamicForm'; // Tu componente dinámico

const App = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  // JSON de ejemplo (anteriormente cargado desde un archivo)
  const jsonData = {
    "nombre formulario": "Formulario 1",
    "formato salida": "JSON",
    "nombre archivo salida": "respuestas formulario 1.json",
    "campos": [
      {
        "tipo": "checkbox",
        "nombre": "Edad del participante",
        "obligatorio": true,
        "salida": "edad",
        "opcion predeterminada": null,
        "texto predeterminado": "Seleccione su edad",
        "opciones": [
          { "name": "18 años", "value": "18" },
          { "name": "19 años", "value": "19" }
        ]
      },
      {
        "tipo": "texto",
        "nombre": "Ingrese un mensaje",
        "obligatorio": true,
        "salida": "mensaje",
        "limitaciones": ["solo letras"],
        "formato": ["solo mayusculas"]
      },
      {
        "tipo": "fecha",
        "nombre": "Fecha de Hoy",
        "obligatorio": true,
        "salida": "fecha",
        "limitaciones": ["no editable"],
        "formato": "dd/mm/aaaa",
        "fecha predeterminada": "hoy"
      }
    ],
    "accion personalizada": "()=>{console.log('Hacer algo')}"
  };

  useEffect(() => {
    // Simulando carga de datos
    setTimeout(() => {
      setFormData(jsonData);
      setLoading(false);
    }, 1000); // Simulación de carga con un retraso de 1 segundo
  }, []);

  // Mientras se cargan los datos, mostramos un mensaje de carga
  if (loading) {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text category='h4'>Cargando formulario...</Text>
        </Layout>
      </ApplicationProvider>
    );
  }

  // Si los datos fueron cargados correctamente, mostramos el formulario
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layout style={{ padding: 20 }}>
        {formData ? <DynamicForm formData={formData} /> : <Text>Error al cargar el formulario</Text>}
      </Layout>
    </ApplicationProvider>
  );
};

export default App;
