import React, { useState, useEffect } from 'react';
import { Text } from '@ui-kitten/components';
import CheckboxGroup from "./subcomponents/CheckboxGroup";
import ItemSelector from "./subcomponents/ItemSelector";
import RadioButtonGroup from "./subcomponents/RadioButtonGroup";

// Definir el enum para los tipos de componentes
export default ComponentTypes = Object.freeze({
    SELECT: 0,
    CHECKBOX: 1,
    RADIO: 2
});

// Arreglo de los componentes disponibles
const Selectors = [ItemSelector, CheckboxGroup, RadioButtonGroup];

export const OptionSelector = ({ type, items, onSelect, title, placeholder, defaultOption }) => {
    const [selectedValue, setSelectedValue] = useState(defaultOption || null); // Usar la opción predeterminada como estado inicial

    // Lógica para manejar la selección
    const handleSelect = selectedValue => {
        setSelectedValue(selectedValue); // Actualizar el estado con el valor seleccionado
        if (onSelect) onSelect(selectedValue); // Ejecutar la función de selección pasada como prop
    };

    // Renderizar el componente correcto basado en `type`
    const SelectedComponent = Selectors[type]; // Selecciona el componente correspondiente según `type`

    return (
        <>
            <Text category="h6" >{title}</Text>
            <SelectedComponent
                items={items} // Pasar los ítems
                onSelect={handleSelect} // Función de manejo de selección
                placeholder={placeholder || "Seleccione una opción"} // Asignar el placeholder si no se pasa uno
                value={selectedValue} // Pasar el valor actual
                defaultOption={defaultOption}
            />
        </>
    );
};
