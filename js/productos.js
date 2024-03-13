// const url_YP = 'http://localhost:5000'
const url_YP = 'https://jotapy79.pythonanywhere.com'  

const productosApp = Vue.createApp({
    data(){
        return {
            prueba: "Esto es Vue",
            mostrarFiltro: false,
            productos: [],
            dirImagenes: './media/catalogo/',
            pagTotalProductos: 0,
            pagCantProductos: 8,
            pagProductoDesde: 0,
            pagProductoHasta: 0,
            pagUltimaPagina: false,
            pagPrimeraPagina: true,
            talles: [],
            colores: [],
            categorias: [],
            idCategoria: 0,
            idColor: 0,
            idTalle: 0,
            texto: '',
            producto: {},
            mostrarDetalleProducto: false
        }
    },
    methods: {
        visualizarFiltro(){
            this.mostrarFiltro = !this.mostrarFiltro
            console.log(this.mostrarFiltro)
            return this.mostrarFiltro            
        },
        async obtenerProductos(){
            let urlProductos = new URL(url_YP + '/productos')
            if (this.idCategoria>0){
                urlProductos.searchParams.append('idCategoria', this.idCategoria)
            }
            if (this.idColor>0){
                urlProductos.searchParams.append('idColor', this.idColor)
            }
            if (this.idTalle>0){
                urlProductos.searchParams.append('idTalle', this.idTalle)
            }
            if (this.texto){
                urlProductos.searchParams.append('texto', this.texto)
            }
            let response = await fetch(urlProductos)
            if (response.ok){
                data = await response.json()
                this.productos = data
                this.pagTotalProductos = this.productos.length
                this.pagProductoHasta = this.pagCantProductos
            }
        },
        async obtenerMaestros(){
            let response = await fetch(url_YP + '/maestros')
            if (response.ok){
                let maestros = await response.json()
                this.talles = maestros.talles
                this.colores = maestros.colores
                this.categorias = maestros.categorias
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
        },
        estiloColor(color){
            return 'background: ' + color
        },
        filtrarCategoria(event){
            this.idCategoria = event.target.value
            this.obtenerProductos()
            let filtros = document.getElementsByName('itemCategoria')
            filtros.forEach(filtro=>{
                let labelCategoria = document.querySelector(`label[for="${filtro.id}"]`)
                if(filtro.value == event.target.value){
                    labelCategoria.classList.add('filtroActivo')                
                }
                else{
                    labelCategoria.classList.remove('filtroActivo')
                }
            })
        },
        filtrarColor(event){
            this.idColor = event.target.value
            this.obtenerProductos()
            let filtros = document.getElementsByName('itemColor')
            filtros.forEach(filtro=>{
                let labelColor = document.querySelector(`label[for="${filtro.id}"]`)
                if(filtro.value == event.target.value){
                    labelColor.classList.add('filtroActivo')                
                }
                else{
                    labelColor.classList.remove('filtroActivo')
                }
            })
        },
        filtrarTalle(event){
            this.idTalle = event.target.value
            this.obtenerProductos()
            let filtros = document.getElementsByName('itemTalle')
            filtros.forEach(filtro=>{
                let labelTalle = document.querySelector(`label[for="${filtro.id}"]`)
                if(filtro.value == event.target.value){
                    labelTalle.classList.add('filtroActivo')                
                }
                else{
                    labelTalle.classList.remove('filtroActivo')
                }
            })
        },
        filtrarTexto(){
            this.texto = document.getElementById('texto').value
            this.obtenerProductos()
        },
        getProducto(idProducto){
            this.producto = this.productos.find(prod => prod.idProducto == idProducto)
            document.body.classList.add('detalleProductoVisible')
            this.mostrarDetalleProducto = true
            this.$nextTick(()=>{
                const detalleProducto = document.querySelector('.detalleProducto')
                detalleProducto.scrollTop = 0   
            })
        },
        cerrarDetalleProducto(){
            this.mostrarDetalleProducto = false
            document.body.classList.remove('detalleProductoVisible')
        }
    },
    created(){
        this.obtenerMaestros()
        this.obtenerProductos()
    }


}).mount('#productosApp')
