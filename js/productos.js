const productosApp = Vue.createApp({
    data(){
        return {
            prueba: "Esto es Vue",
            mostrarFiltro: false,
            productos: [],
            dirImagenes: './media/catalogo/',
            pagTotalProductos: 0,
            pagCantProductos: 6,
            pagProductoDesde: 0,
            pagProductoHasta: 0,
            pagUltimaPagina: false,
            pagPrimeraPagina: true,
        }
    },
    methods: {
        visualizarFiltro(){
            this.mostrarFiltro = !this.mostrarFiltro
            console.log(this.mostrarFiltro)
            return this.mostrarFiltro            
        },
        async obtenerProductos(){
            response = await fetch('./js/catalogo.json')
            if (response.ok){
                data = await response.json()
                this.productos = data
                this.pagTotalProductos = this.productos.length
                this.pagProductoHasta = this.pagCantProductos
            }
        },
        paginaAnterior(){
            this.pagProductoDesde = this.pagProductoDesde - this.pagCantProductos
            this.pagProductoHasta = this.pagProductoHasta - this.pagCantProductos
            this.pagPrimeraPagina = (this.pagProductoDesde < this.pagCantProductos)
            this.pagUltimaPagina = (this.pagProductoHasta >= this.pagTotalProductos)

        },
        paginaSiguiente(){
            this.pagProductoDesde = this.pagProductoDesde + this.pagCantProductos
            this.pagProductoHasta = this.pagProductoHasta + this.pagCantProductos
            this.pagPrimeraPagina = (this.pagProductoDesde < this.pagCantProductos)
            this.pagUltimaPagina = (this.pagProductoHasta >= this.pagTotalProductos)
        }
    },
    created(){
        this.obtenerProductos()
    }


}).mount('#productosApp')