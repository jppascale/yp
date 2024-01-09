const headHTML = `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="css/estilos.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
`

const headerHTML = `<img src="./media/img/Logo-150.png" alt="Logo YP Indumentaria" class="logo">
<nav>
    <ul class="menu">
        <li><a href="#">Home</a></li>
        <li><a href="#">Productos</a></li>
    </ul>
</nav>
`

const footerHTML = `<p>Jπ</p>
`

const headElement = document.querySelector('head')
headElement.innerHTML = headHTML

const headerElement = document.querySelector('.header')
headerElement.innerHTML = headerHTML

const footerElement = document.querySelector('.footer')
footerElement.innerHTML(footerHTML)