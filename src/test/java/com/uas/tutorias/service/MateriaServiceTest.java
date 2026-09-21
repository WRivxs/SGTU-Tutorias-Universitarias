package com.uas.tutorias.service;

import com.uas.tutorias.entity.Materia;
import com.uas.tutorias.exception.ResourceNotFoundException;
import com.uas.tutorias.repository.MateriaRepository;
import com.uas.tutorias.service.impl.MateriaServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MateriaServiceTest {

    @Mock
    private MateriaRepository materiaRepository;

    @InjectMocks
    private MateriaServiceImpl materiaService;

    private Materia materiaPrueba;

    @BeforeEach
    void setUp() {
        materiaPrueba = new Materia();
        materiaPrueba.setId(1L);
        materiaPrueba.setNombre("Bases de Datos");
        materiaPrueba.setDescripcion("Modelado relacional y SQL");
        materiaPrueba.setEstado(true);
    }

    @Test
    @DisplayName("Debe listar todas las materias")
    void listarTodas_RetornaLista() {
        when(materiaRepository.findAll()).thenReturn(List.of(materiaPrueba));

        List<Materia> resultado = materiaService.listarTodas();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Bases de Datos", resultado.get(0).getNombre());
    }

    @Test
    @DisplayName("Debe obtener materia por ID existente")
    void obtenerPorId_MateriaExiste_RetornaMateria() {
        when(materiaRepository.findById(1L)).thenReturn(Optional.of(materiaPrueba));

        Materia resultado = materiaService.obtenerPorId(1L);

        assertNotNull(resultado);
        assertEquals("Bases de Datos", resultado.getNombre());
    }

    @Test
    @DisplayName("Debe lanzar ResourceNotFoundException si la materia no existe")
    void obtenerPorId_MateriaNoExiste_LanzaExcepcion() {
        when(materiaRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> materiaService.obtenerPorId(99L));
    }

    @Test
    @DisplayName("Debe crear una materia exitosamente")
    void crear_MateriaValida_GuardaMateria() {
        when(materiaRepository.save(any(Materia.class))).thenReturn(materiaPrueba);

        Materia resultado = materiaService.crear(materiaPrueba);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(materiaRepository, times(1)).save(materiaPrueba);
    }

    @Test
    @DisplayName("Debe eliminar una materia existente")
    void eliminar_MateriaExiste_EliminaExitosamente() {
        when(materiaRepository.findById(1L)).thenReturn(Optional.of(materiaPrueba));
        doNothing().when(materiaRepository).delete(materiaPrueba);

        assertDoesNotThrow(() -> materiaService.eliminar(1L));
        verify(materiaRepository, times(1)).delete(materiaPrueba);
    }
}
