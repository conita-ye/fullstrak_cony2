import { describe, test, vi } from "vitest";


describe('HomePage', () => {

    //Simulación de agregar elementos al carrito
    test("Debe simular agregar un elemento al carrito", () => {

        const mockAddToCart = vi.fn();
        vi.mock("../../../contexts/CartContext", () => ({
            useCart: () => ({
        addToCart: mockAddToCart,
            }),
        }));
    })

    //Prueba que sonner funcione bien
    //Sonner: es una librería de React para crear mensajes 
    //de tipo "toast" (notificaciones emergentes) de forma 
    //elegante y eficiente.
    test("Debe mostrar las notificaciones con el sonner", () => {

        const mockToastSuccess = vi.fn();
            vi.mock("sonner", () => ({
                toast: {
                    success: mockToastSuccess,
                },
            }));
    });

    test("Debe seleccionar la categoría", () => {

        const mockSeleccionarCategoria = vi.fn();
            vi.mock("./HomeComponents/SeccionCategoria", () => ({
                onNavigate: () => ({
                    onclick: mockSeleccionarCategoria
                })
            }))
        }) 

})

